import React, { useEffect, useState } from "react";
import {
  Package,
  CheckCircle,
  Truck,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  formatAmount,
  useGetActiveRequests,
  useAcceptRequest,
  useConfirmDeliveryAsDriver,
} from "@/hooks/contracts";
import { useGetDeliveries, useMintNft, useRecordDeliveryAndMaybeMint } from "@/hooks/reputationNFT";
import { useIsDriverRegistered, useRegisterDriver, useSetDriverAvailability } from "@/hooks/driverRegistry";
import { AvailableRequestsPool } from "@/components/driver/AvailableRequestsPool";
import { DriverAvailableDeliveries } from "@/components/driver/DriverAvailableDeliveries";
import { useAccount } from "wagmi";
import { WalletConnect } from "./WalletConnect";
import { WalletConnectionPrompt } from "./driver/WalletConnectionPrompt";
import { DriverStatsCards } from "./driver/DriverStatsCards";
import { NextBadgeProgress } from "./driver/NextBadgeProgress";
import { DeliveryRequestsList } from "./driver/DeliveryRequestsList";
import { PerformanceMetrics } from "./driver/PerformanceMetrics";
import { DriverTips } from "./driver/DriverTips";
import { LoadingState } from "./driver/LoadingState";
import { analytics } from "../utils/analytics";

interface DeliveryRequest {
  id: number;
  requestId?: bigint;
  user: string;
  description?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  amount: string;
  isCompleted: boolean;
  completed?: boolean;
  cancelled?: boolean;
  createdAt?: bigint;
  timestamp: string;
}

export const DriverDashboard = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { toast } = useToast();
  const [walletConnectionState, setWalletConnectionState] = useState({
    isConnected: false,
    address: undefined as string | undefined
  });

  // Contract hooks - only call when wallet is connected
  const { data: deliveries, refetch: refetchDeliveries, isLoading: deliveriesLoading } = useGetDeliveries(address as `0x${string}`);
  const { data: activeRequests, refetch: refetchActiveRequests, isLoading: requestsLoading } = useGetActiveRequests();
  const { data: isRegistered, isLoading: registrationLoading } = useIsDriverRegistered(address as `0x${string}`);
  const { registerDriver, isPending: isRegistering, isConfirmed: registrationConfirmed } = useRegisterDriver();
  const { setDriverAvailability, isPending: isSettingAvailability } = useSetDriverAvailability();
  const { acceptRequest, isPending: isAccepting, isConfirmed: requestAccepted } = useAcceptRequest();
  const { confirmDeliveryAsDriver, isPending: isConfirming, isConfirmed: requestCompleted, error: completeError } = useConfirmDeliveryAsDriver();
  const { mintNft, isPending: isMinting, isConfirmed } = useMintNft();
  const { recordDeliveryAndMaybeMint, isPending: isRecordingDelivery, isConfirmed: deliveryRecorded } = useRecordDeliveryAndMaybeMint();

  // Handle wallet connection state changes
  const handleWalletConnectionChange = (connected: boolean, walletAddress?: string) => {
    setWalletConnectionState({
      isConnected: connected,
      address: walletAddress
    });

    // Track wallet connection events
    if (connected && walletAddress) {
      analytics.trackWalletConnection(walletAddress, true);
      analytics.trackPageView('driver_dashboard', walletAddress);
    } else if (!connected) {
      analytics.trackWalletDisconnection(walletAddress);
    }
  };

  // Process real contract data
  const processedRequests = React.useMemo(() => {
    if (!activeRequests || !Array.isArray(activeRequests)) return [];

    return activeRequests.map((requestId: bigint) => ({
      id: Number(requestId),
      requestId: requestId,
      // Note: We would need to fetch individual request details using useRequest hook
      // For now, we'll show basic info
      user: "Loading...",
      description: "Loading...",
      pickupLocation: "Loading...",
      dropoffLocation: "Loading...",
      amount: "0.00",
      isCompleted: false,
      completed: false,
      cancelled: false,
      timestamp: "Recently"
    }));
  }, [activeRequests]);

  const [driverStats, setDriverStats] = useState({
    totalDeliveries: Number(deliveries) || 0,
    totalEarnings: processedRequests.reduce((acc, req) => acc + parseFloat(req.amount), 0),
    nftBadges: Number(deliveries) >= 5 ? Math.floor(Number(deliveries) / 5) : 0,
    nextBadgeIn: 5 - (Number(deliveries) % 5) || 0,
    rating: 0
  });

  const handleAcceptRequest = async (requestId: number) => {
    try {
      // Track transaction initiation
      analytics.trackTransaction('request_acceptance', 'initiated', { requestId });

      // Show transaction pending toast
      toast({
        title: "🔄 Accepting Request",
        description: "Please confirm the transaction in your wallet...",
        duration: 5000,
      });

      // Call smart contract
      acceptRequest(requestId);

      // Track transaction submission
      analytics.trackTransaction('request_acceptance', 'pending', { requestId });

      // Show transaction submitted toast
      toast({
        title: "⏳ Transaction Submitted",
        description: "Request acceptance submitted. Waiting for confirmation...",
        duration: 5000,
      });
    } catch (error: any) {
      analytics.trackError(error, 'request_acceptance', address);
      console.error("Error accepting request:", error);

      toast({
        title: "❌ Transaction Failed",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
        duration: 8000,
      });
    }
  };

  const handleCompleteDelivery = async (requestId: number) => {
    try {
      // Track transaction initiation
      analytics.trackTransaction('delivery_completion', 'initiated', { requestId });

      // Show transaction pending toast
      toast({
        title: "🔄 Confirming Delivery",
        description: "Please confirm the transaction in your wallet...",
        duration: 5000,
      });

      // Call smart contract
      confirmDeliveryAsDriver(requestId);

      // Track transaction submission
      analytics.trackTransaction('delivery_completion', 'pending', { requestId });

      // Show transaction submitted toast
      toast({
        title: "⏳ Transaction Submitted",
        description: "Your transaction has been submitted to the blockchain. Waiting for confirmation...",
        duration: 5000,
      });

      // Refresh data
      await refetchActiveRequests();
      await refetchDeliveries();

      // Update stats
      const newDeliveries = driverStats.totalDeliveries + 1;
      const newEarnings = driverStats.totalEarnings; // We don't have amount here anymore
      const newNextBadgeIn = 5 - (newDeliveries % 5);
      const newBadges = Math.floor(newDeliveries / 5);

      setDriverStats(prev => ({
        ...prev,
        totalDeliveries: newDeliveries,
        totalEarnings: newEarnings,
        nftBadges: newBadges,
        nextBadgeIn: newNextBadgeIn === 5 ? 0 : newNextBadgeIn,
      }));

      // Track successful delivery completion
      analytics.trackDeliveryCompletion(requestId, true);
      analytics.trackTransaction('delivery_completion', 'confirmed', { requestId });

      // Record delivery and potentially mint NFT badge automatically
      try {
        await recordDeliveryAndMaybeMint(address as `0x${string}`);

        // Check if this was the 5th delivery (NFT badge earned)
        if (newDeliveries % 5 === 0) {
          analytics.trackNFTMinting(address as string, true, newDeliveries);
          toast({
            title: "🎉 New NFT Badge Earned!",
            description: `Congratulations! You've earned a new reputation badge for completing ${newDeliveries} deliveries.`,
            duration: 8000,
          });
        } else {
          toast({
            title: "💰 Delivery Completed!",
            description: `Delivery confirmed successfully. ${5 - (newDeliveries % 5)} more deliveries until next NFT badge!`,
            duration: 6000,
          });
        }
      } catch (nftError) {
        analytics.trackNFTMinting(address as string, false, newDeliveries);
        analytics.trackError(nftError as Error, 'record_delivery_and_mint', address);
        console.error("Error recording delivery and minting NFT:", nftError);

        // Still show success for delivery completion even if NFT recording failed
        toast({
          title: "💰 Delivery Completed!",
          description: `Delivery confirmed successfully. NFT badge recording failed - please contact support.`,
          duration: 6000,
        });
      }
    } catch (error: any) {
      // Track failed delivery completion
      analytics.trackDeliveryCompletion(requestId, false, error?.message);
      analytics.trackTransaction('delivery_completion', 'failed', { requestId, error: error?.message });
      analytics.trackError(error, 'delivery_completion', address);

      console.error("Error completing delivery:", error);

      let errorMessage = "Failed to complete delivery. Please try again.";

      // Handle specific error types
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds to complete the transaction.";
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      toast({
        title: "❌ Transaction Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    }
  };

  const completedRequests = processedRequests.filter((r) => r.isCompleted);
  const pendingRequests = processedRequests.filter((r) => !r.isCompleted);

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "🌟 NFT Badge Minted!",
        description: "Your new reputation badge has been successfully minted to your wallet.",
      });
    }
  }, [isConfirmed]);

  // Loading state when connecting or fetching data
  if (isConnecting || (isConnected && (deliveriesLoading || requestsLoading))) {
    return (
      <LoadingState
        message="Connecting to wallet and loading your delivery data..."
        onBack={() => window.history.back()}
      />
    );
  }

  // Wallet not connected state
  if (!isConnected) {
    return (
      <WalletConnectionPrompt
        onConnectionChange={handleWalletConnectionChange}
        onBack={() => window.history.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-emerald-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Driver Dashboard</h1>
            <p className="text-orange-100">Manage your deliveries and track earnings</p>
          </div>
          <div className="flex items-center gap-4">
            <WalletConnect
              variant="compact"
              onConnectionChange={handleWalletConnectionChange}
            />
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-orange-200 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <DriverStatsCards stats={driverStats} />

        {/* Next Badge Progress */}
        <NextBadgeProgress nextBadgeIn={driverStats.nextBadgeIn} />

        {/* Available Requests Pool */}
        <AvailableRequestsPool className="mb-8" />

        {/* Driver's Available Deliveries (Consolidated) */}
        <DriverAvailableDeliveries className="mb-8" />

        {/* Performance Metrics */}
        <PerformanceMetrics rating={driverStats.rating} />

        {/* Tips Section */}
        <DriverTips />
      </div>
    </div>
  );
};