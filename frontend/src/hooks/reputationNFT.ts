
import { useWaitForTransactionReceipt } from "wagmi"
import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES, REPUTATION_NFT_ABI as ABI} from "@/config/contracts"

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.REPUTATION_NFT as `0x${string}`

// Write Hooks
export function useMintNft() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const mintNft = (driver: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'mintBadge',
      args: [driver],
    } as any)
  }

  return {
    mintNft,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useRecordDeliveryAndMaybeMint() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const recordDeliveryAndMaybeMint = (driver: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'recordDeliveryAndMaybeMint',
      args: [driver],
    } as any)
  }

  return {
    recordDeliveryAndMaybeMint,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useGetDeliveries(driver: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'driverDeliveries',
    args: [driver],
    query: {
      enabled: !!driver, // Only run query when driver address is available
    }
  })
}