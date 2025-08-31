# SUREPIK - Decentralized Delivery Platform

SUREPIK is a blockchain-based delivery service platform that connects users with drivers through smart contracts. The platform ensures secure, transparent, and trustless delivery transactions using cryptocurrency payments and reputation systems.

- PROJECT OVERVIEW

SUREPIK consists of two main components:
- Smart Contracts: Ethereum-based contracts handling delivery logic, payments, and driver management
- Frontend: React-based web application for user interaction

Architecture

- Smart Contract System

The platform operates on five interconnected smart contracts:

1. DeliveryService Contract
The core contract managing delivery requests and transactions.

Key Features:
- Create delivery requests with pickup/dropoff locations
- Accept requests by registered drivers
- Dual confirmation system (user + driver)
- Automatic payment release upon completion
- Request modification and cancellation

Constants:
- Base fee: 10 tokens minimum
- Maximum active requests: 1,000

2. DriverRegistry Contract
Manages driver registration and availability status.

Key Features:
- Driver registration system
- Availability toggle functionality
- Driver statistics tracking (deliveries, ratings)
- Rating calculation with weighted averages
- Available driver listing

Default Values:
- Initial driver rating: 100
- New drivers start as unavailable

3. MockStablecoin Contract
ERC20 token contract simulating USDC for payments.

Specifications:
- Token name: Mock USDC (mUSDC)
- Maximum supply: 100,000,000 tokens
- Initial supply: 1,000,000 tokens
- 18 decimal places

4. Faucet Contract
Provides test tokens for platform users.

Configuration:
- Claim amount: 100 tokens per request
- Cooldown period: 24 hours
- Total distribution cap: 1,000,000 tokens
- Prevents double claiming

5. ReputationNFT Contract
ERC721 contract for driver achievement badges.

Badge System:
- Milestone-based badge minting
- Delivery milestones: 5, 10, 25, 50, 100, 250, 500, 1000
- Maximum 20 badges per driver
- IPFS metadata storage
- Automatic badge generation

Frontend Application

Built with modern React and TypeScript stack.

Technology Stack:
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.2 (build tool)
- ESLint (code quality)

Development Features:
- Hot module replacement
- TypeScript strict mode
- Modern ES2022 target
- Optimized production builds

Network Configuration

Supported Networks:

Testnet:
- Lisk Sepolia Testnet (Chain ID: 4202)
- RPC: https://rpc.sepolia-api.lisk.com
- Explorer: https://sepolia-blockscout.lisk.com

Deployed Contract Addresses (Lisk Sepolia)

- DriverRegistry: `0x114409A757403A9c237a36c1a4160AF9ceb50cDa`
- MockStablecoin: `0x8aFc399457889DF696B9F60398f855cb6FD926E1`
- ReputationNFT: `0x09EC71bf820895E61C03F1c0b3E3d37e0A791db5`
- DeliveryService: `0x896D8509A351ef07E0d29f816dc04D0426b7d7F7`
- Faucet: `0xDd82cE54d41A698f08E60DE6217140f44A2B8143`

Installation and Setup

Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

Smart Contract Features

Delivery Workflow

1. Request Creation: Users create delivery requests with location details and payment
2. Driver Assignment: Available drivers can accept requests
3. Dual Confirmation: Both user and driver must confirm delivery completion
4. Payment Release: Automatic token transfer to driver upon dual confirmation
5. Reputation Update: Driver statistics and potential NFT badges updated

Security Features

- Reentrancy Protection: All state-changing functions protected
- Access Control: Role-based permissions for contract operations
- Safe Token Transfers: OpenZeppelin SafeERC20 implementation
- Input Validation: Comprehensive parameter checking
- Error Handling: Custom error types for gas efficiency

Gas Optimization

- Compiler Settings: Optimized for 200 runs with IR pipeline
- Storage Efficiency: Packed structs and optimized mappings
- Custom Errors: Gas-efficient error handling
- Batch Operations: Efficient array management

Testing

Comprehensive test suite covering:

Unit Tests
- Driver registration and availability
- Faucet claiming with cooldown enforcement
- Delivery request lifecycle
- Payment processing
- Error condition handling

Integration Tests
- Complete delivery workflow
- Multi-contract interactions
- Driver statistics maintenance
- Token flow verification


Development Tools

Smart Contract Development
- Hardhat: Development environment and testing framework
- TypeChain: TypeScript bindings for contracts
- Hardhat Ignition: Deployment management
- Solidity Coverage: Code coverage analysis
- Gas Reporter: Transaction cost analysis

Frontend Development
- Vite: Fast build tool with HMR
- ESLint: Code quality enforcement
- TypeScript: Type safety and developer experience
- React DevTools: Component debugging

Contributing

Code Standards
- Follow existing code formatting
- Write comprehensive tests for new features
- Document public functions and contracts
- Use TypeScript strict mode
- Implement proper error handling


License

This project is licensed under the MIT License.
