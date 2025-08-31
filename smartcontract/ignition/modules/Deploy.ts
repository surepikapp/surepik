import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployModule = buildModule("Deploy", (m) => {
  const mockStablecoin = m.contract("MockStablecoin");
  const driverRegistry = m.contract("DriverRegistry");
  const faucet = m.contract("Faucet", [mockStablecoin]);
  const deliveryService = m.contract("DeliveryService", [
    mockStablecoin,
    driverRegistry,
  ]);
  const reputationNFT = m.contract("ReputationNFT");

  m.call(mockStablecoin, "mint", [faucet, "1000000000000000000000000"], {
    id: "MintToFaucet",
  });

  m.call(
    mockStablecoin,
    "mint",
    [deliveryService, "100000000000000000000000"],
    {
      id: "MintToDeliveryService",
    }
  );

  return {
    mockStablecoin,
    driverRegistry,
    faucet,
    deliveryService,
    reputationNFT,
  };
});

export default DeployModule;
