// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../libraries/Data.sol";

contract Faucet is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable stablecoin;
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18;
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    uint256 public constant FAUCET_TOTAL_CAP = 1000000 * 10**18;

    uint256 public totalFaucetClaimed;
    mapping(address => uint256) public lastFaucetClaim;
    
    constructor(IERC20 _stablecoin) {
        stablecoin = _stablecoin;
    }
    
    function claimFaucet() external nonReentrant {
        if (block.timestamp < lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN) {
            revert Data.FaucetCooldownActive();
        }

        if (totalFaucetClaimed + FAUCET_AMOUNT > FAUCET_TOTAL_CAP) {
            revert Data.FaucetCapExceeded();
        }

        uint256 contractBalance = stablecoin.balanceOf(address(this));
        if (contractBalance < FAUCET_AMOUNT) {
            revert Data.InsufficientContractBalance();
        }

        lastFaucetClaim[msg.sender] = block.timestamp;
        totalFaucetClaimed += FAUCET_AMOUNT;

        stablecoin.safeTransfer(msg.sender, FAUCET_AMOUNT);
        
        emit Data.FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }
    
    function getFaucetInfo(address _user) external view returns (
        uint256 lastClaim,
        bool canClaim,
        uint256 nextClaimTime
    ) {
        lastClaim = lastFaucetClaim[_user];
        nextClaimTime = lastClaim + FAUCET_COOLDOWN;
        canClaim = block.timestamp >= nextClaimTime && 
                   totalFaucetClaimed + FAUCET_AMOUNT <= FAUCET_TOTAL_CAP;
    }
    
    function getRemainingTokens() external view returns (uint256) {
        uint256 remaining = FAUCET_TOTAL_CAP - totalFaucetClaimed;
        uint256 contractBalance = stablecoin.balanceOf(address(this));
        return remaining < contractBalance ? remaining : contractBalance;
    }
    
    function isCapReached() external view returns (bool) {
        return totalFaucetClaimed >= FAUCET_TOTAL_CAP;
    }
    
    function getContractBalance() external view returns (uint256) {
        return stablecoin.balanceOf(address(this));
    }
}
