import { ethers } from "hardhat";

async function deployLocal() {
  console.log(" Starting local deployment...");

  // Get signers
  const [deployer, secondSigner] = await ethers.getSigners();

  console.log(" Deployer address:", deployer.address);
  console.log(
    " Second signer address:",
    secondSigner?.address || "Using deployer as second signer"
  );

  // Check balances
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log(" Deployer balance:", ethers.formatEther(deployerBalance), "ETH");

  // Deploy contracts step by step
  console.log("\n Deploying MockStablecoin...");
  const MockStablecoin = await ethers.getContractFactory("MockStablecoin");
  const mockStablecoin = await MockStablecoin.deploy();
  await mockStablecoin.waitForDeployment();
  const mockStablecoinAddress = await mockStablecoin.getAddress();
  console.log(" MockStablecoin deployed to:", mockStablecoinAddress);

  console.log("\n Deploying ReputationNFT...");
  const ReputationNFT = await ethers.getContractFactory("ReputationNFT");
  const reputationNFT = await ReputationNFT.deploy();
  await reputationNFT.waitForDeployment();
  const reputationNFTAddress = await reputationNFT.getAddress();
  console.log(" ReputationNFT deployed to:", reputationNFTAddress);

  console.log("\n Deploying DriverRegistry...");
  const DriverRegistry = await ethers.getContractFactory("DriverRegistry");
  const driverRegistry = await DriverRegistry.deploy();
  await driverRegistry.waitForDeployment();
  const driverRegistryAddress = await driverRegistry.getAddress();
  console.log(" DriverRegistry deployed to:", driverRegistryAddress);

  console.log("\n Deploying Faucet...");
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(mockStablecoinAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log(" Faucet deployed to:", faucetAddress);

  console.log("\n Deploying DeliveryService...");
  const DeliveryService = await ethers.getContractFactory("DeliveryService");
  const deliveryService = await DeliveryService.deploy(
    mockStablecoinAddress,
    driverRegistryAddress
  );
  await deliveryService.waitForDeployment();
  const deliveryServiceAddress = await deliveryService.getAddress();
  console.log("DeliveryService deployed to:", deliveryServiceAddress);

  console.log("\n  Setting up initial configuration...");

  // Mint tokens to faucet for distribution
  console.log(" Minting tokens to faucet...");
  const faucetMintTx = await mockStablecoin.mint(
    faucetAddress,
    ethers.parseEther("1000000") // 1M tokens
  );
  await faucetMintTx.wait();
  console.log(" Minted 1M tokens to Faucet");

  // Mint tokens to delivery service for testing
  console.log(" Minting tokens to delivery service...");
  const deliveryMintTx = await mockStablecoin.mint(
    deliveryServiceAddress,
    ethers.parseEther("100000") // 100K tokens
  );
  await deliveryMintTx.wait();
  console.log(" Minted 100K tokens to DeliveryService");

  // Mint some tokens to users for testing
  console.log(" Minting tokens to users for testing...");
  const userMintTx = await mockStablecoin.mint(
    deployer.address,
    ethers.parseEther("10000") // 10K tokens
  );
  await userMintTx.wait();

  if (secondSigner) {
    const secondUserMintTx = await mockStablecoin.mint(
      secondSigner.address,
      ethers.parseEther("10000") // 10K tokens
    );
    await secondUserMintTx.wait();
  }
  console.log(" Minted 10K tokens to test users");

  // Prepare deployment result
  const deploymentResult = {
    deliveryService: deliveryServiceAddress,
    driverRegistry: driverRegistryAddress,
    faucet: faucetAddress,
    mockStablecoin: mockStablecoinAddress,
    reputationNFT: reputationNFTAddress,
  };

  console.log("\n deployment completed successfully!");
  console.log("\n Contract Addresses:");
  console.log(`DeliveryService: ${deliveryServiceAddress}`);
  console.log(`DriverRegistry: ${driverRegistryAddress}`);
  console.log(`Faucet: ${faucetAddress}`);
  console.log(`MockStablecoin: ${mockStablecoinAddress}`);
  console.log(`ReputationNFT: ${reputationNFTAddress}`);

  return deploymentResult;
}

if (require.main === module) {
  deployLocal()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Local deployment failed:", error);
      process.exit(1);
    });
}

export { deployLocal };
