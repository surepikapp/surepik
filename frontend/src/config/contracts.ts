import driverRegistryAbi from "@/lib/DriverRegistry.json";
import mockCoinAbi from "@/lib/MockStableCoinAbi.json";
import reputationAbi from "@/lib/ReputationNftAbi.json";
import deliveryServiceAbi from "@/lib/DeliveryService.json";
import faucetAbi from "@/lib/Faucet.json";

// Smart contract addresses and ABIs
export const CONTRACT_ADDRESSES = {
  DELIVERY_SERVICE: "0x2D4aCA74bCb99ae8d56B6B639d3a483C37A8B136",
  REPUTATION_NFT: "0x1F51b8Bfcb558285c0f9a2b1e22714cbD99d9917",
  MOCK_STABLECOIN: "0x8EE6e2B8536Dd1E7E47E473269BAC5799A86c386",
  DRIVER_REGISTRY: "0xB114C0df0c52d8B93B6cBF6Fe4F18aD0f86a51C8",
  FAUCET: "0x7e1Dc330db3BA354C50FDBAC63415aeC2Bc6e107",
};

export const DELIVERY_SERVICE_ABI = deliveryServiceAbi;
export const REPUTATION_NFT_ABI = reputationAbi;
export const MOCK_STABLECOIN_ABI = mockCoinAbi;
export const FAUCET_ABI = faucetAbi;
export const DRIVER_REGISTRY_ABI = driverRegistryAbi;

// Legacy exports for backward compatibility (will be removed)
export const DELIVERY_CONTRACT_ABI = deliveryServiceAbi; // Deprecated: use DELIVERY_SERVICE_ABI
export const CONTRACT_ADDRESSES_LEGACY = {
  DELIVERY_CONTRACT: CONTRACT_ADDRESSES.DELIVERY_SERVICE, // Deprecated: use DELIVERY_SERVICE
};
