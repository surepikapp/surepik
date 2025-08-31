// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library Data {
    error InsufficientAmount();
    error RequestNotFound();
    error NotRequestOwner();
    error RequestAlreadyAccepted();
    error RequestNotAccepted();
    error RequestAlreadyCompleted();
    error RequestAlreadyCancelled();
    error DriverNotAvailable();
    error DriverNotRegistered();
    error DriverAlreadyRegistered();
    error NotAssignedDriver();
    error AlreadyConfirmed();
    error BothConfirmationsRequired();
    error FaucetCooldownActive();
    error FaucetCapExceeded();
    error InsufficientContractBalance();
    error MaxActiveRequestsReached();
    error TransferFailed();

    struct DeliveryRequest {
        uint256 id;
        address user;
        string description;
        string pickupLocation;
        string dropoffLocation;
        uint256 amount;
        bool completed;
        bool cancelled;
        uint256 createdAt;
    }

    event RequestCreated(
        uint256 indexed requestId,
        address indexed user,
        string description,
        uint256 amount
    );
    event RequestUpdated(
        uint256 indexed requestId,
        string description,
        uint256 amount
    );
    event RequestCancelled(uint256 indexed requestId);
    event RequestAccepted(
        uint256 indexed requestId,
        address indexed driver
    );
    event DeliveryConfirmed(
        uint256 indexed requestId,
        address indexed confirmer,
        bool isUser
    );
    event DeliveryCompleted(
        uint256 indexed requestId,
        address indexed driver,
        uint256 amount
    );
    event DriverStatusChanged(
        address indexed driver,
        bool available
    );
    event FaucetClaimed(
        address indexed user,
        uint256 amount
    );
    event DriverConfirmationProcessed(uint256 indexed requestId, address indexed driver, uint256 amount);
    event DriverRegistered(address indexed driver);
    event CompanyStatsUpdated(uint256 indexed companyId, uint256 totalDeliveries, uint256 rating);
}
