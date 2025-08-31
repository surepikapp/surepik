import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, DollarSign, Clock, User, CheckCircle, Truck } from "lucide-react";
import { useGetActiveRequests, useRequest, useGetAssignedDriver, useGetConfirmationStatus, useConfirmDeliveryAsDriver } from "@/hooks/contracts";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";

interface DriverAcceptedRequestsProps {
  className?: string;
}

export const DriverAcceptedRequests: React.FC<DriverAcceptedRequestsProps> = ({ className }) => {
  const { address } = useAccount();
  const { toast } = useToast();
  const { data: activeRequestIds, isLoading: requestsLoading, refetch } = useGetActiveRequests();

  // Filter requests assigned to this driver
  const driverRequests = React.useMemo(() => {
    if (!activeRequestIds || !address) return [];
    return activeRequestIds.filter((requestId: bigint) => {
      // We'll check in the individual card component if this driver is assigned
      return true; // For now, we'll filter in the individual cards
    });
  }, [activeRequestIds, address]);

  if (requestsLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your accepted requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Your Accepted Deliveries</h2>
          <p className="text-slate-600">Complete deliveries to earn rewards</p>
        </div>
      </div>

      <div className="grid gap-4">
        {driverRequests.map((requestId: bigint) => (
          <DriverRequestCard
            key={requestId.toString()}
            requestId={requestId}
            driverAddress={address}
          />
        ))}
      </div>
    </div>
  );
};

interface DriverRequestCardProps {
  requestId: bigint;
  driverAddress?: string;
}

const DriverRequestCard: React.FC<DriverRequestCardProps> = ({ requestId, driverAddress }) => {
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
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
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
  let cardClasses = 'border-orange-200 bg-orange-50';
  let actionButtonText = 'Mark as Delivered';
  let showActionButton = !driverConfirmed && !isCompleted;

  if (isCompleted) {
    status = 'Completed & Paid';
    cardClasses = 'border-emerald-200 bg-emerald-50';
    showActionButton = false;
  } else if (userConfirmed && driverConfirmed) {
    status = 'Payment Processing';
    cardClasses = 'border-emerald-200 bg-emerald-50';
    showActionButton = false;
  } else if (driverConfirmed && !userConfirmed) {
    status = 'Waiting for Customer Confirmation';
    cardClasses = 'border-blue-200 bg-blue-50';
    showActionButton = false;
  } else if (userConfirmed && !driverConfirmed) {
    status = 'Customer Confirmed - Mark as Delivered';
    cardClasses = 'border-yellow-200 bg-yellow-50';
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
    <Card className={`hover:shadow-lg transition-shadow ${cardClasses}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="w-5 h-5" />
              {request.description}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4" />
              <span>Customer: {request.user.slice(0, 6)}...{request.user.slice(-4)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold text-green-600">
              <DollarSign className="w-5 h-5" />
              {formatAmount(request.amount)} mUSDC
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {new Date(Number(request.createdAt) * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="text-sm">
                <span className="font-medium text-slate-700">Pickup:</span>
                <span className="ml-2 text-slate-600">{request.pickupLocation}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-slate-700">Dropoff:</span>
                <span className="ml-2 text-slate-600">{request.dropoffLocation}</span>
              </div>
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

          <div className="flex items-center justify-between pt-4 border-t">
            <Badge variant={isCompleted ? "default" : "secondary"} className="flex items-center gap-1">
              {isCompleted ? <CheckCircle className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
              {status}
            </Badge>
            
            {showActionButton && (
              <Button
                onClick={handleConfirmDelivery}
                disabled={isConfirming}
                className="bg-emerald-500 hover:bg-emerald-600"
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
