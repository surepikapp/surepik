// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../libraries/Data.sol";
import "./DriverRegistry.sol";

contract DeliveryService is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable stablecoin;
    DriverRegistry public immutable driverRegistry;
    uint256 public constant BASE_FEE = 10;
    uint256 public constant MAX_ACTIVE_REQUESTS = 1000;
    
    uint256 public requestCounter;
    mapping(uint256 => Data.DeliveryRequest) public requests;
    mapping(uint256 => address) public requestToDriver;
    mapping(uint256 => bool) public userConfirmed;
    mapping(uint256 => bool) public driverConfirmed;
    uint256[] public activeRequestIds;
    
    constructor(IERC20 _stablecoin, DriverRegistry _driverRegistry) {
        stablecoin = _stablecoin;
        driverRegistry = _driverRegistry;
    }
    
    modifier requestExists(uint256 _requestId) {
        if (requests[_requestId].user == address(0)) revert Data.RequestNotFound();
        _;
    }
    
    modifier onlyRequestOwner(uint256 _requestId) {
        if (requests[_requestId].user != msg.sender) revert Data.NotRequestOwner();
        _;
    }
    
    modifier requestNotAccepted(uint256 _requestId) {
        if (requestToDriver[_requestId] != address(0)) revert Data.RequestAlreadyAccepted();
        _;
    }
    
    modifier requestAccepted(uint256 _requestId) {
        if (requestToDriver[_requestId] == address(0)) revert Data.RequestNotAccepted();
        _;
    }
    
    modifier onlyAssignedDriver(uint256 _requestId) {
        if (requestToDriver[_requestId] != msg.sender) revert Data.NotAssignedDriver();
        _;
    }
    
    modifier requestNotCompleted(uint256 _requestId) {
        if (requests[_requestId].completed) revert Data.RequestAlreadyCompleted();
        if (requests[_requestId].cancelled) revert Data.RequestAlreadyCancelled();
        _;
    }
    
    function createRequest(
        string calldata _description,
        string calldata _pickupLocation,
        string calldata _dropoffLocation,
        uint256 _amount
    ) external nonReentrant {
        if (_amount < BASE_FEE) revert Data.InsufficientAmount();
        
        if (activeRequestIds.length >= MAX_ACTIVE_REQUESTS) revert Data.MaxActiveRequestsReached();
        
        stablecoin.safeTransferFrom(msg.sender, address(this), _amount);
        
        uint256 requestId = ++requestCounter;
        requests[requestId] = Data.DeliveryRequest({
            id: requestId,
            user: msg.sender,
            description: _description,
            pickupLocation: _pickupLocation,
            dropoffLocation: _dropoffLocation,
            amount: _amount,
            completed: false,
            cancelled: false,
            createdAt: block.timestamp
        });
        
        activeRequestIds.push(requestId);
        emit Data.RequestCreated(requestId, msg.sender, _description, _amount);
    }
    
    function updateRequest(
        uint256 _requestId,
        string calldata _description,
        string calldata _pickupLocation,
        string calldata _dropoffLocation,
        uint256 _newAmount
    ) external 
        requestExists(_requestId)
        onlyRequestOwner(_requestId)
        requestNotAccepted(_requestId)
        requestNotCompleted(_requestId)
        nonReentrant
    {
        if (_newAmount < BASE_FEE) revert Data.InsufficientAmount();
        
        Data.DeliveryRequest storage request = requests[_requestId];
        uint256 currentAmount = request.amount;
        
        if (_newAmount > currentAmount) {
            uint256 difference = _newAmount - currentAmount;
            stablecoin.safeTransferFrom(msg.sender, address(this), difference);
        } else if (_newAmount < currentAmount) {
            uint256 difference = currentAmount - _newAmount;
            stablecoin.safeTransfer(msg.sender, difference);
        }
        
        request.description = _description;
        request.pickupLocation = _pickupLocation;
        request.dropoffLocation = _dropoffLocation;
        request.amount = _newAmount;
        
        emit Data.RequestUpdated(_requestId, _description, _newAmount);
    }
    
    function cancelRequest(uint256 _requestId) 
        external 
        requestExists(_requestId)
        onlyRequestOwner(_requestId)
        requestNotAccepted(_requestId)
        requestNotCompleted(_requestId)
        nonReentrant
    {
        Data.DeliveryRequest storage request = requests[_requestId];
        request.cancelled = true;
        
        stablecoin.safeTransfer(msg.sender, request.amount);
        
        _removeFromActiveRequests(_requestId);
        
        emit Data.RequestCancelled(_requestId);
    }
    
    function acceptRequest(uint256 _requestId)
        external
        requestExists(_requestId)
        requestNotAccepted(_requestId)
        requestNotCompleted(_requestId)
    {
        if (!driverRegistry.isDriverAvailable(msg.sender)) {
            revert Data.DriverNotAvailable();
        }
        
        requestToDriver[_requestId] = msg.sender;
        
        emit Data.RequestAccepted(_requestId, msg.sender);
    }
    
    function confirmDeliveryAsUser(uint256 _requestId)
        external
        requestExists(_requestId)
        onlyRequestOwner(_requestId)
        requestAccepted(_requestId)
        requestNotCompleted(_requestId)
    {
        if (userConfirmed[_requestId]) revert Data.AlreadyConfirmed();
        
        userConfirmed[_requestId] = true;
        emit Data.DeliveryConfirmed(_requestId, msg.sender, true);
        
        _checkAndCompleteDelivery(_requestId);
    }
    
    function confirmDeliveryAsDriver(uint256 _requestId)
        external
        requestExists(_requestId)
        onlyAssignedDriver(_requestId)
        requestNotCompleted(_requestId)
    {
        if (driverConfirmed[_requestId]) revert Data.AlreadyConfirmed();
        
        driverConfirmed[_requestId] = true;
        emit Data.DeliveryConfirmed(_requestId, msg.sender, false);
        
        _checkAndCompleteDelivery(_requestId);
    }
    
    
    function getRequest(uint256 _requestId) external view returns (Data.DeliveryRequest memory) {
        return requests[_requestId];
    }
    
    function getActiveRequests() external view returns (uint256[] memory) {
        return activeRequestIds;
    }
    
    function getAssignedDriver(uint256 _requestId) external view returns (address) {
        return requestToDriver[_requestId];
    }
    
    function getConfirmationStatus(uint256 _requestId) external view returns (bool userHasConfirmed, bool driverHasConfirmed) {
        return (userConfirmed[_requestId], driverConfirmed[_requestId]);
    }
    
    
    function _checkAndCompleteDelivery(uint256 _requestId) internal {
        if (userConfirmed[_requestId] && driverConfirmed[_requestId]) {
            Data.DeliveryRequest storage request = requests[_requestId];
            request.completed = true;
            
            address driver = requestToDriver[_requestId];
            
            stablecoin.safeTransfer(driver, request.amount);
            
            _removeFromActiveRequests(_requestId);
            
            emit Data.DeliveryCompleted(_requestId, driver, request.amount);
        }
    }
    
    function _removeFromActiveRequests(uint256 _requestId) internal {
        for (uint256 i = 0; i < activeRequestIds.length; i++) {
            if (activeRequestIds[i] == _requestId) {
                activeRequestIds[i] = activeRequestIds[activeRequestIds.length - 1];
                activeRequestIds.pop();
                break;
            }
        }
    }
}
