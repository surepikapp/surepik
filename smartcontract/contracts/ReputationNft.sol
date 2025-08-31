// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ReputationNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    
    uint256 public tokenIdCounter;

    mapping(address => uint256) public driverDeliveries;

    mapping(address => uint256) public driverBadgeLevel;
    
    uint256 public constant MAX_BADGES_PER_DRIVER = 20;

    
    uint256[] public deliveryMilestones = [5, 10, 25, 50, 100, 250, 500, 1000];

    event BadgeMinted(address indexed driver, uint256 indexed tokenId, uint256 milestone);
    event DeliveryRecorded(address indexed driver, uint256 totalDeliveries);

    constructor() ERC721("DriverReputation", "DRNFT") Ownable(msg.sender) {}

    function mintBadge(address driver, uint256 milestone) public onlyOwner nonReentrant {
        require(driver != address(0), "ReputationNFT: invalid driver address");
        require(driverBadgeLevel[driver] < MAX_BADGES_PER_DRIVER, "ReputationNFT: max badges reached");

        uint256 tokenId = tokenIdCounter++;
        driverBadgeLevel[driver]++;

        _safeMint(driver, tokenId);

        
        string memory metadataURI = _generateTokenURI(milestone);
        _setTokenURI(tokenId, metadataURI);

        emit BadgeMinted(driver, tokenId, milestone);
    }

    function recordDeliveryAndMaybeMint(address driver) external onlyOwner {
        require(driver != address(0), "ReputationNFT: invalid driver address");

        driverDeliveries[driver]++;
        uint256 totalDeliveries = driverDeliveries[driver];

        emit DeliveryRecorded(driver, totalDeliveries);

        
        for (uint256 i = 0; i < deliveryMilestones.length; i++) {
            if (totalDeliveries == deliveryMilestones[i]) {
                mintBadge(driver, deliveryMilestones[i]);
                break;
            }
        }
    }

    function getDriverBadgeLevel(address driver) external view returns (uint256) {
        return driverBadgeLevel[driver];
    }

    function getDriverDeliveries(address driver) external view returns (uint256) {
        return driverDeliveries[driver];
    }

    function _generateTokenURI(uint256 milestone) internal pure returns (string memory) {
        
        if (milestone >= 1000) return "ipfs://QmHighTierBadge";
        if (milestone >= 500) return "ipfs://QmMidTierBadge";
        if (milestone >= 100) return "ipfs://QmLowTierBadge";
        return "ipfs://QmStarterBadge";
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
