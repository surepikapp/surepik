import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES, MOCK_STABLECOIN_ABI} from "@/config/contracts"

export function useApproveTokens() {
  const { writeContract, data: hash, isPending } = useWriteContract()

  const approve = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.MOCK_STABLECOIN as  `0x${string}`, // Your mUSDC contract address
      abi: MOCK_STABLECOIN_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.DELIVERY_SERVICE as `0x${string}`, amount], // Approve DeliveryService to spend
    } as any)
  }

  return { approve, hash, isPending }
}

export function useTokenBalance(userAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_STABLECOIN as `0x${string}`, // Your mUSDC contract address
    abi: MOCK_STABLECOIN_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
  })
}