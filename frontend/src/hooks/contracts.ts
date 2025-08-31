import { parseEther } from "viem"
import { useWatchContractEvent } from "wagmi"
import { useWaitForTransactionReceipt } from "wagmi"
import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES, DELIVERY_SERVICE_ABI as ABI} from "@/config/contracts"

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.DELIVERY_SERVICE as `0x${string}`

// Utility function
export function parseAmount(amount: string): bigint {
  return parseEther(amount);
}

// Read Hooks
export function useRequestCounter() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'requestCounter',
  })
}

export function useStablecoin() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'stablecoin',
  })
}

export function useDriverRegistry() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'driverRegistry',
  })
}

export function useRequest(requestId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getRequest',
    args: [requestId],
  })
}

export function useGetActiveRequests() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getActiveRequests',
  })
}

export function useGetAssignedDriver(requestId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAssignedDriver',
    args: [requestId],
    query: {
      enabled: !!requestId,
    }
  })
}

export function useGetConfirmationStatus(requestId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getConfirmationStatus',
    args: [requestId],
    query: {
      enabled: !!requestId,
    }
  })
}

// Write Hooks
export function useCreateRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const createRequest = (
    description: string,
    pickupLocation: string,
    dropoffLocation: string,
    amount: bigint
  ) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'createRequest',
      args: [description, pickupLocation, dropoffLocation, amount],
    } as any)
  }

  return {
    createRequest,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useAcceptRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const acceptRequest = (requestId: bigint | number) => {
    const id = typeof requestId === 'number' ? BigInt(requestId) : requestId;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'acceptRequest',
      args: [id],
    } as any)
  }

  return {
    acceptRequest,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useCancelRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const cancelRequest = (requestId: bigint | number) => {
    const id = typeof requestId === 'number' ? BigInt(requestId) : requestId;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'cancelRequest',
      args: [id],
    } as any)
  }

  return {
    cancelRequest,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useConfirmDeliveryAsUser() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const confirmDeliveryAsUser = (requestId: bigint | number) => {
    const id = typeof requestId === 'number' ? BigInt(requestId) : requestId;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'confirmDeliveryAsUser',
      args: [id],
    } as any)
  }

  return {
    confirmDeliveryAsUser,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useConfirmDeliveryAsDriver() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const confirmDeliveryAsDriver = (requestId: bigint | number) => {
    const id = typeof requestId === 'number' ? BigInt(requestId) : requestId;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'confirmDeliveryAsDriver',
      args: [id],
    } as any)
  }

  return {
    confirmDeliveryAsDriver,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useUpdateRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const updateRequest = (
    requestId: bigint | number,
    description: string,
    pickupLocation: string,
    dropoffLocation: string,
    newAmount: bigint
  ) => {
    const id = typeof requestId === 'number' ? BigInt(requestId) : requestId;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'updateRequest',
      args: [id, description, pickupLocation, dropoffLocation, newAmount],
    } as any)
  }

  return {
    updateRequest,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Event Hooks
export function useWatchRequestCreated() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RequestCreated',
  })
}

export function useWatchRequestAccepted() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RequestAccepted',
  })
}

export function useWatchRequestCancelled() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RequestCancelled',
  })
}

export function useWatchDeliveryCompleted() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'DeliveryCompleted',
  })
}

export function useWatchDeliveryConfirmed() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'DeliveryConfirmed',
  })
}

export function useWatchRequestUpdated() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RequestUpdated',
  })
}

// Utility Functions
export function formatAmount(amount: bigint | string | number): string {
  if (typeof amount === 'string') {
    amount = BigInt(amount);
  } else if (typeof amount === 'number') {
    amount = BigInt(amount);
  }

  // Convert from wei to ether (18 decimals)
  const ether = Number(amount) / 1e18;
  return ether.toFixed(2);
}

export function useWatchRequestCompleted() {
  return useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RequestCompleted',
  })
}

// Helper Functions
export const formatAddress = (address: string) => address as `0x${string}`

// Legacy exports for backward compatibility
export const useCompleteRequest = useConfirmDeliveryAsDriver;
export const useGetUserRequests = useGetActiveRequests;
export const useGetDriverRequests = useGetActiveRequests;