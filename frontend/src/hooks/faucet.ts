import { useWaitForTransactionReceipt } from "wagmi"
import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES, FAUCET_ABI as ABI } from "@/config/contracts"

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.FAUCET as `0x${string}`

// Read Hooks
export function useFaucetAmount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'FAUCET_AMOUNT',
  })
}

export function useFaucetCooldown() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'FAUCET_COOLDOWN',
  })
}

export function useFaucetTotalCap() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'FAUCET_TOTAL_CAP',
  })
}

export function useGetContractBalance() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getContractBalance',
  })
}

export function useGetRemainingTokens() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getRemainingTokens',
  })
}

export function useIsCapReached() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'isCapReached',
  })
}

export function useGetFaucetInfo(userAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getFaucetInfo',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    }
  })
}

export function useLastFaucetClaim(userAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'lastFaucetClaim',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    }
  })
}

export function useTotalFaucetClaimed() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalFaucetClaimed',
  })
}

// Write Hooks
export function useFaucet() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const claimFaucet = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'claimFaucet',
      args: [],
    } as any)
  }

  return {
    claimFaucet,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}