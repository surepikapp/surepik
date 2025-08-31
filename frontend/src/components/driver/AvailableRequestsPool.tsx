import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, DollarSign, Clock, User } from "lucide-react";
import { useGetActiveRequests, useRequest, formatAmount } from "@/hooks/contracts";
import { useAcceptRequest } from "@/hooks/contracts";
import { useToast } from "@/hooks/use-toast";

interface RequestData {
  id: bigint;
  user: string;
  description: string;
  pickupLocation: string;
  dropoffLocation: string;
  amount: bigint;
  completed: boolean;
  cancelled: boolean;
  createdAt: bigint;
}

interface AvailableRequestsPoolProps {
  className?: string;
}

export const AvailableRequestsPool: React.FC<AvailableRequestsPoolProps> = ({ className }) => {
  const { toast } = useToast();
  const { data: activeRequestIds, isLoading: requestsLoading, refetch } = useGetActiveRequests();
  const { acceptRequest, isPending: isAccepting, isConfirmed: requestAccepted } = useAcceptRequest();

  // Handle request acceptance
  const handleAcceptRequest = async (requestId: bigint) => {
    try {
      toast({
        title: "🔄 Accepting Request",
        description: "Please confirm the transaction in your wallet...",
        duration: 5000,
      });

      acceptRequest(Number(requestId));
    } catch (error: any) {
      console.error("Error accepting request:", error);
      toast({
        title: "❌ Transaction Failed",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
        duration: 8000,
      });
    }
  };

  // Handle successful request acceptance
  React.useEffect(() => {
    if (requestAccepted) {
      toast({
        title: "✅ Request Accepted!",
        description: "You have successfully accepted the delivery request.",
        duration: 6000,
      });
      refetch(); // Refresh the list
    }
  }, [requestAccepted, toast, refetch]);

  if (requestsLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading available requests...</p>
        </div>
      </div>
    );
  }

  if (!activeRequestIds || activeRequestIds.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Available Requests</h3>
            <p className="text-slate-600">
              There are currently no delivery requests available. Check back later!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Available Delivery Requests</h2>
          <p className="text-slate-600">Accept requests to start earning</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {activeRequestIds.length} available
        </Badge>
      </div>

      <div className="grid gap-4">
        {activeRequestIds.map((requestId: bigint) => (
          <RequestCard
            key={requestId.toString()}
            requestId={requestId}
            onAccept={handleAcceptRequest}
            isAccepting={isAccepting}
          />
        ))}
      </div>
    </div>
  );
};

interface RequestCardProps {
  requestId: bigint;
  onAccept: (requestId: bigint) => void;
  isAccepting: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ requestId, onAccept, isAccepting }) => {
  const { data: requestData, isLoading } = useRequest(requestId);

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

  const request = requestData as RequestData;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{request.description}</CardTitle>
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
        <div className="space-y-3">
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

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge variant={request.completed ? "default" : "secondary"}>
                {request.completed ? "Completed" : "Active"}
              </Badge>
              {request.cancelled && (
                <Badge variant="destructive">Cancelled</Badge>
              )}
            </div>
            
            <Button
              onClick={() => onAccept(requestId)}
              disabled={isAccepting || request.completed || request.cancelled}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isAccepting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Accepting...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Accept Request
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
