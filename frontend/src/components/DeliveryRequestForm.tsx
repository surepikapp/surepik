import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  parseAmount,
  useCreateRequest,
  useGetActiveRequests,
} from "@/hooks/contracts";
import { useApproveTokens, useTokenBalance } from "@/hooks/stableCoin";
import { useWaitForTransactionReceipt } from "wagmi";
import { useFaucet } from "@/hooks/faucet";
import { useAccount } from "wagmi";
import { WalletConnect } from "./WalletConnect";
import { UserWalletConnectionPrompt } from "./user/UserWalletConnectionPrompt";
import { UserStatsCards } from "./user/UserStatsCards";
import { FaucetCard } from "./user/FaucetCard";
import { CreateDeliveryRequestCard } from "./user/CreateDeliveryRequestCard";
import { UserRequestsList } from "./user/UserRequestsList";
import { UserLoadingState } from "./user/UserLoadingState";
import { analytics } from "../utils/analytics";

export const DeliveryRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAmount, setPendingAmount] = useState("");
  const [pendingDescription, setPendingDescription] = useState("");
  const [pendingPickupLocation, setPendingPickupLocation] = useState("");
  const [pendingDropoffLocation, setPendingDropoffLocation] = useState("");

  const { toast } = useToast();
  const { address, isConnected, isConnecting } = useAccount();

  // Contract hooks - only call when wallet is connected
  const { createRequest, isPending: createPending, isConfirmed: createConfirmed, error: createError } = useCreateRequest();
  const { approve, isPending: isApproving, hash: approveHash } = useApproveTokens();
  const { claimFaucet, isPending: isFaucetLoading, isConfirmed: faucetConfirmed } = useFaucet();
  const { data: balance, isLoading: balanceLoading } = useTokenBalance(address as `0x${string}`);
  const { data: activeRequestIds, isLoading: requestsLoading } = useGetActiveRequests() as { data: bigint[] | undefined; isLoading: boolean };

  // Wait for approval transaction confirmation
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash
  });

  // Handle wallet connection state changes
  const handleWalletConnectionChange = (connected: boolean, walletAddress?: string) => {
    // Track wallet connection events
    if (connected && walletAddress) {
      analytics.trackWalletConnection(walletAddress, true);
      analytics.trackPageView('user_dashboard', walletAddress);
    } else if (!connected) {
      analytics.trackWalletDisconnection(walletAddress);
    }
  };

  const handleFaucetClaim = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Track faucet claim attempt
      analytics.trackTransaction('faucet_claim', 'initiated', { address });

      // Show transaction pending toast
      toast({
        title: "🔄 Processing Faucet Claim",
        description: "Please confirm the transaction in your wallet...",
        duration: 5000,
      });

      // Call faucet contract
      claimFaucet();

      // Show transaction submitted toast
      toast({
        title: "⏳ Transaction Submitted",
        description: "Your faucet claim has been submitted to the blockchain. Waiting for confirmation...",
        duration: 5000,
      });

      // Wait for confirmation (this will be handled by the useEffect below)
    } catch (error: any) {
      analytics.trackError(error, 'faucet_claim', address);
      console.error("Faucet error:", error);

      let errorMessage = "Failed to claim faucet tokens. Please try again.";

      // Handle specific error types
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error?.message?.includes("Faucet cooldown active")) {
        errorMessage = "Faucet cooldown is active. Please wait 24 hours between claims.";
      } else if (error?.message?.includes("Insufficient tokens in contract")) {
        errorMessage = "Faucet is empty. Please contact support.";
      }

      toast({
        title: "❌ Faucet Claim Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    }
  };

  const handleSubmit = async (
    amount: string,
    description: string,
    pickupLocation: string,
    dropoffLocation: string
  ) => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !description || !pickupLocation || !dropoffLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedAmount = parseFloat(amount);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount greater than 0",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const amountBigInt = parseAmount(amount);
      const balanceNumber = balance ? Number(balance) / 1e18 : 0;

      // Check if user has sufficient balance
      if (parsedAmount > balanceNumber) {
        toast({
          title: "Insufficient Balance",
          description: `You need ${parsedAmount} mUSDC but only have ${balanceNumber.toFixed(2)} mUSDC.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Track transaction initiation
      analytics.trackTransaction('delivery_request', 'initiated', {
        amount: parsedAmount,
        description,
        pickupLocation,
        dropoffLocation
      });

      // Step 1: Approve tokens
      toast({
        title: "🔄 Step 1: Approving Tokens",
        description: "Please confirm the token approval transaction in your wallet...",
        duration: 5000,
      });

      // Store the request details for later use
      setPendingAmount(amount);
      setPendingDescription(description);
      setPendingPickupLocation(pickupLocation);
      setPendingDropoffLocation(dropoffLocation);

      approve(amountBigInt); // Approve the amount

      // Wait for approval confirmation
      toast({
        title: "⏳ Approval Submitted",
        description: "Token approval submitted. Waiting for confirmation...",
        duration: 5000,
      });

      // Step 2: Create request (this will be handled by useEffect when approval is confirmed)
    } catch (error: any) {
      analytics.trackError(error, 'delivery_request_creation', address);
      console.error("Error creating delivery request:", error);

      let errorMessage = "Failed to create delivery request. Please try again.";

      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds to complete the transaction.";
      }

      toast({
        title: "❌ Transaction Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
      setIsSubmitting(false);
    }
  // Show contract error if createRequest fails
  useEffect(() => {
    if (createError) {
      toast({
        title: "❌ Contract Error",
        description: createError?.message || "Failed to create delivery request. Please try again.",
        variant: "destructive",
        duration: 8000,
      });
      setIsSubmitting(false);
    }
  }, [createError, toast]);
  };

  // Handle faucet confirmation
  useEffect(() => {
    if (faucetConfirmed) {
      analytics.trackTransaction('faucet_claim', 'confirmed', { address });
      toast({
        title: "🎉 Faucet Claimed Successfully!",
        description: "100 mUSDC tokens have been added to your wallet.",
        duration: 6000,
      });
    }
  }, [faucetConfirmed, address, toast]);

  // Prevent repeated createRequest calls after approval
  const [requestCreated, setRequestCreated] = useState(false);
  useEffect(() => {
    if (
      approveConfirmed &&
      isSubmitting &&
      !requestCreated &&
      pendingAmount &&
      pendingDescription &&
      pendingPickupLocation &&
      pendingDropoffLocation
    ) {
      toast({
        title: "🔄 Step 2: Creating Request",
        description: "Please confirm the delivery request transaction in your wallet...",
        duration: 5000,
      });
      const amountBigInt = parseAmount(pendingAmount);
      createRequest(pendingDescription, pendingPickupLocation, pendingDropoffLocation, amountBigInt);
      setRequestCreated(true);
    }
  }, [approveConfirmed, isSubmitting, requestCreated, pendingAmount, pendingDescription, pendingPickupLocation, pendingDropoffLocation]);

  // Handle request creation confirmation and reset flag
  useEffect(() => {
    if (createConfirmed) {
      analytics.trackTransaction('delivery_request', 'confirmed', { address });
      toast({
        title: "🚚 Request Created Successfully!",
        description: "Delivery request created. Available drivers can now accept your request.",
        duration: 6000,
      });
      setIsSubmitting(false);
      setPendingAmount("");
      setPendingDescription("");
      setPendingPickupLocation("");
      setPendingDropoffLocation("");
      setRequestCreated(false);
    }
  }, [createConfirmed, address, toast]);

  const formatBalance = (balance: bigint) => {
    return (Number(balance) / 1e18).toFixed(2);
  };

  // Loading state when connecting or fetching data
  if (isConnecting || (isConnected && (balanceLoading || requestsLoading))) {
    return (
      <UserLoadingState
        message="Connecting to wallet and loading your data..."
        onBack={() => window.history.back()}
      />
    );
  }

  // Wallet not connected state
  if (!isConnected) {
    return (
      <UserWalletConnectionPrompt
        onConnectionChange={handleWalletConnectionChange}
        onBack={() => window.history.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-orange-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
            <p className="text-emerald-100">
              Manage your deliveries and tokens
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <WalletConnect
              variant="compact"
              onConnectionChange={handleWalletConnectionChange}
            />
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-emerald-200 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <UserStatsCards
          balance={balance ? formatBalance(balance as bigint) : "0.00"}
          totalRequests={activeRequestIds?.length || 0}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Faucet Card */}
          <FaucetCard
            onClaimFaucet={handleFaucetClaim}
            isLoading={isFaucetLoading}
            balance={balance ? formatBalance(balance as bigint) : "0.00"}
          />

          {/* Create Delivery Request */}
          <CreateDeliveryRequestCard
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || createPending || isApproving}
            balance={balance ? formatBalance(balance as bigint) : "0.00"}
          />
        </div>

        {/* User Requests List */}
        <div className="mt-8">
          <UserRequestsList requestIds={activeRequestIds || []} />
        </div>
      </div>
    </div>
  );
};

// Export as UserDashboard for backward compatibility
export const UserDashboard = DeliveryRequestForm;
