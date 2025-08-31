import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, DollarSign, Clock, User, CheckCircle, Truck } from "lucide-react";
import { useGetActiveRequests, useRequest, useGetAssignedDriver, useGetConfirmationStatus, useConfirmDeliveryAsDriver } from "@/hooks/contracts";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";

interface DriverAvailableDeliveriesProps {
  className?: string;
}

export const DriverAvailableDeliveries: React.FC<DriverAvailableDeliveriesProps> = ({ className }) => {
  const { address } = useAccount();
  const { toast } = useToast();
  const { data: activeRequestIds, isLoading: requestsLoading, refetch } = useGetActiveRequests();

  // Filter requests assigned to this driver
  const driverRequests = React.useMemo(() => {
    if (!activeRequestIds || !address || !Array.isArray(activeRequestIds)) return [];
    return activeRequestIds.filter((requestId: bigint) => {
      // We'll check in the individual card component if this driver is assigned
      return true; // For now, we'll filter in the individual cards
    });
  }, [activeRequestIds, address]);

  if (requestsLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Available Deliveries</h2>
            <p className="text-slate-600 text-sm">Complete deliveries to earn rewards</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your deliveries...</p>
        </div>
      </div>
    );
  }

  const assignedRequests = driverRequests.filter((requestId: bigint) => {
    // This will be filtered in the individual cards, but we need a count
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Truck className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Available Deliveries</h2>
          <p className="text-slate-600 text-sm">Complete deliveries to earn rewards</p>
        </div>
      </div>

      <div className="space-y-4">
        {driverRequests.map((requestId: bigint) => (
          <DriverDeliveryCard
            key={requestId.toString()}
            requestId={requestId}
            driverAddress={address}
          />
        ))}
      </div>
    </div>
  );
};

interface DriverDeliveryCardProps {
  requestId: bigint;
  driverAddress?: string;
}

const DriverDeliveryCard: React.FC<DriverDeliveryCardProps> = ({ requestId, driverAddress }) => {
  const { data: requestData, isLoading } = useRequest(requestId);
  const { data: assignedDriver } = useGetAssignedDriver(requestId);
  const { data: confirmationStatus } = useGetConfirmationStatus(requestId);
  const { confirmDeliveryAsDriver, isPending: isConfirming, isConfirmed, error } = useConfirmDeliveryAsDriver();
  const { toast } = useToast();

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const isAssignedToMe = assignedDriver && assignedDriver === driverAddress;

  // Don't show if not assigned to this driver
  if (!isAssignedToMe) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-orange-200 rounded w-3/4"></div>
          <div className="h-4 bg-orange-200 rounded w-1/2"></div>
          <div className="h-4 bg-orange-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!requestData) {
    return null;
  }

  const request = requestData as any;
  const userConfirmed = confirmationStatus?.[0] || false;
  const driverConfirmed = confirmationStatus?.[1] || false;
  const isCompleted = request.completed;

  // Determine status and styling
  let status = 'Ready for Pickup';
  let actionButtonText = 'Mark as Delivered';
  let showActionButton = !driverConfirmed && !isCompleted;

  if (isCompleted) {
    status = 'Completed & Paid ✓';
    showActionButton = false;
  } else if (userConfirmed && driverConfirmed) {
    status = 'Payment Processing...';
    showActionButton = false;
  } else if (driverConfirmed && !userConfirmed) {
    status = 'Waiting for Customer Confirmation';
    showActionButton = false;
  } else if (userConfirmed && !driverConfirmed) {
    status = 'Customer Confirmed - Mark as Delivered';
    actionButtonText = 'Confirm Delivery Complete';
    showActionButton = true;
  }

  const handleConfirmDelivery = () => {
    try {
      toast({
        title: "🔄 Confirming Delivery",
        description: "Please confirm the transaction in your wallet...",
        duration: 5000,
      });

      confirmDeliveryAsDriver(requestId);
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast({
        title: "❌ Transaction Failed",
        description: "Failed to confirm delivery. Please try again.",
        variant: "destructive",
        duration: 8000,
      });
    }
  };

  React.useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "✅ Delivery Confirmed!",
        description: "You have successfully confirmed the delivery completion.",
        duration: 6000,
      });
    }
  }, [isConfirmed, toast]);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "❌ Confirmation Failed",
        description: error.message || "Failed to confirm delivery. Please try again.",
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [error, toast]);

  const formatAmount = (amount: bigint) => {
    if (!amount || isNaN(Number(amount))) return '0.00';
    return (Number(amount) / 1e18).toFixed(2);
  };

  return (
    <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 transition-colors hover:bg-orange-100">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-medium text-slate-800">{request.description}</span>
              <p className="text-xs text-slate-500">Request #{Number(request.id)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
              <div>
                <p className="text-slate-600 font-medium">Pickup:</p>
                <p className="text-slate-800">{request.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
              <div>
                <p className="text-slate-600 font-medium">Dropoff:</p>
                <p className="text-slate-800">{request.dropoffLocation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 text-sm">Customer: </span>
              <span className="font-mono text-slate-800 text-sm">{request.user.slice(0, 6)}...{request.user.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-orange-700 text-lg">{formatAmount(request.amount)} mUSDC</span>
            </div>
          </div>

          {/* Confirmation Status */}
          <div className="bg-white/70 rounded p-3 text-xs">
            <p className="font-medium text-slate-700 mb-2">Delivery Status:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex items-center gap-1 ${userConfirmed ? 'text-green-600' : 'text-gray-500'}`}>
                {userConfirmed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                <span>Customer: {userConfirmed ? 'Confirmed' : 'Pending'}</span>
              </div>
              <div className={`flex items-center gap-1 ${driverConfirmed ? 'text-green-600' : 'text-gray-500'}`}>
                {driverConfirmed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                <span>You: {driverConfirmed ? 'Confirmed' : 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {showActionButton && (
            <div className="pt-2">
              <Button
                onClick={handleConfirmDelivery}
                disabled={isConfirming}
                className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto"
              >
                {isConfirming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {actionButtonText}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full ml-4">
          {isCompleted ? <CheckCircle className="w-3 h-3 text-orange-600" /> : <Clock className="w-3 h-3 text-orange-600" />}
          <span className="text-xs font-medium text-orange-700">{status}</span>
        </div>
      </div>
    </div>
  );
};
