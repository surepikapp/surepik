// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MockStablecoin is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M tokens

    uint256 public totalMinted;

    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        uint256 initialSupply = 1_000_000 * 10**decimals(); // 1M initial
        _mint(msg.sender, initialSupply);
        totalMinted = initialSupply;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "MockStablecoin: mint to zero address");
        require(amount > 0, "MockStablecoin: mint amount must be positive");
        require(totalMinted + amount <= MAX_SUPPLY, "MockStablecoin: exceeds max supply");

        _mint(to, amount);
        totalMinted += amount;

        emit TokensMinted(to, amount);
    }

    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }
}
