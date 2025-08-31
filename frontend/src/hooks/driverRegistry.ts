import { useWaitForTransactionReceipt } from "wagmi"
import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES, DRIVER_REGISTRY_ABI as ABI} from "@/config/contracts"

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.DRIVER_REGISTRY as `0x${string}`

// Read Hooks
export function useIsDriverRegistered(driverAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'isDriverRegistered',
    args: [driverAddress],
    query: {
      enabled: !!driverAddress,
    }
  })
}

export function useIsDriverAvailable(driverAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'isDriverAvailable',
    args: [driverAddress],
    query: {
      enabled: !!driverAddress,
    }
  })
}

export function useGetAllDrivers() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAllDrivers',
  })
}

export function useGetAvailableDrivers() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAvailableDrivers',
  })
}

export function useGetDriverCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getDriverCount',
  })
}

export function useGetDriverStats(driverAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getDriverStats',
    args: [driverAddress],
    query: {
      enabled: !!driverAddress,
    }
  })
}

export function useDriverRating(driverAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'driverRating',
    args: [driverAddress],
    query: {
      enabled: !!driverAddress,
    }
  })
}

export function useTotalDeliveries(driverAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalDeliveries',
    args: [driverAddress],
    query: {
      enabled: !!driverAddress,
    }
  })
}

// Write Hooks
export function useRegisterDriver() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const registerDriver = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'registerDriver',
      args: [],
    } as any)
  }

  return {
    registerDriver,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useSetDriverAvailability() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const setDriverAvailability = (available: boolean) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'setDriverAvailability',
      args: [available],
    } as any)
  }

  return {
    setDriverAvailability,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useUpdateDriverStats() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const updateDriverStats = (driverAddress: `0x${string}`, rating: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'updateDriverStats',
      args: [driverAddress, rating],
    } as any)
  }

  return {
    updateDriverStats,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}
