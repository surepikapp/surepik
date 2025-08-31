// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../libraries/Data.sol";

contract DriverRegistry {
    
    mapping(address => bool) public registeredDrivers;
    mapping(address => bool) public driverAvailable;
    
    mapping(address => uint256) public totalDeliveries;
    mapping(address => uint256) public driverRating; 
    
    address[] public driverList;
    mapping(address => uint256) private driverIndex;
    
    function registerDriver() external {
        if (registeredDrivers[msg.sender]) revert Data.DriverAlreadyRegistered();
        
        registeredDrivers[msg.sender] = true;
        driverAvailable[msg.sender] = false; 
        driverRating[msg.sender] = 100; 
        

        driverIndex[msg.sender] = driverList.length;
        driverList.push(msg.sender);
        
        emit Data.DriverRegistered(msg.sender);
    }
    
    function setDriverAvailability(bool _available) external {
        if (!registeredDrivers[msg.sender]) revert Data.DriverNotRegistered();
        
        driverAvailable[msg.sender] = _available;
        emit Data.DriverStatusChanged(msg.sender, _available);
    }
    
    function updateDriverStats(address _driver, uint256 _rating) external {
        if (!registeredDrivers[_driver]) revert Data.DriverNotRegistered();
        
        totalDeliveries[_driver]++;
        
    
        uint256 currentRating = driverRating[_driver];
        uint256 deliveries = totalDeliveries[_driver];
        
        if (deliveries == 1) {
            driverRating[_driver] = _rating;
        } else {
            driverRating[_driver] = ((currentRating * (deliveries - 1)) + _rating) / deliveries;
        }
        
        emit Data.CompanyStatsUpdated(uint256(uint160(_driver)), totalDeliveries[_driver], driverRating[_driver]);
    }
    
   
    function isDriverRegistered(address _driver) external view returns (bool) {
        return registeredDrivers[_driver];
    }
   
    function isDriverAvailable(address _driver) external view returns (bool) {
        return registeredDrivers[_driver] && driverAvailable[_driver];
    }
    
   
    function getDriverStats(address _driver) external view returns (uint256 deliveries, uint256 rating) {
        return (totalDeliveries[_driver], driverRating[_driver]);
    }
   
    function getAllDrivers() external view returns (address[] memory) {
        return driverList;
    }
   
    function getAvailableDrivers() external view returns (address[] memory) {
        uint256 availableCount = 0;
        
        for (uint256 i = 0; i < driverList.length; i++) {
            if (driverAvailable[driverList[i]]) {
                availableCount++;
            }
        }
        
        address[] memory availableDrivers = new address[](availableCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < driverList.length; i++) {
            if (driverAvailable[driverList[i]]) {
                availableDrivers[index] = driverList[i];
                index++;
            }
        }
        
        return availableDrivers;
    }
    
   
    function getDriverCount() external view returns (uint256) {
        return driverList.length;
    }
}
