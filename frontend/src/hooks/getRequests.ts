import { useReadContract } from "wagmi";
import { DELIVERY_SERVICE_ABI, CONTRACT_ADDRESSES } from "@/config/contracts";

export const useGetActiveRequests = () => {
  return useReadContract({
    address: CONTRACT_ADDRESSES.DELIVERY_SERVICE as `0x${string}`,
    abi: DELIVERY_SERVICE_ABI,
    functionName: "getActiveRequests",
  });
};

// Legacy function for backward compatibility
const getRequests = async () => {
  console.warn("getRequests is deprecated. Use useGetActiveRequests hook instead.");
  return [];
};
