import { Clock, CheckCircle, DollarSign, Package, User, MapPin } from "lucide-react";
import { useConfirmDeliveryAsUser, useRequest, useGetAssignedDriver, useGetConfirmationStatus } from "@/hooks/contracts";

interface UserRequestsListProps {
  requestIds: bigint[];
}

// Individual Request Card Component that fetches its own data
function RequestCard({ requestId }: { requestId: bigint }) {
  const { data: request } = useRequest(requestId);
  const { data: assignedDriver } = useGetAssignedDriver(requestId);
  const { data: confirmationStatus } = useGetConfirmationStatus(requestId);
  const { confirmDeliveryAsUser, isPending: confirmPending, isConfirmed: confirmConfirmed, error: confirmError } = useConfirmDeliveryAsUser();

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  
  const formatAmount = (amount: bigint) => {
    if (!amount || isNaN(Number(amount))) return '0.00';
    return (Number(amount) / 1e18).toFixed(2);
  };

  const formatAddress = (address?: string) => {
    if (!address || typeof address !== 'string' || address === ZERO_ADDRESS) return 'Not accepted yet';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!request) {
    return (
      <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  const isCompleted = request.completed;
  const isCancelled = request.cancelled;
  const hasDriver = assignedDriver && assignedDriver !== ZERO_ADDRESS;
  const userConfirmed = confirmationStatus?.[0] || false;
  const driverConfirmed = confirmationStatus?.[1] || false;
  
  // Determine status and get proper classes
  let status = 'Waiting for Driver';
  let statusColor = 'orange';
  let actionButtonText = '';
  let showActionButton = false;
  
  if (isCancelled) {
    status = 'Cancelled';
    statusColor = 'red';
  } else if (isCompleted) {
    status = 'Completed & Paid ✓';
    statusColor = 'emerald';
  } else if (hasDriver) {
    if (userConfirmed && driverConfirmed) {
      status = 'Payment Processing...';
      statusColor = 'emerald';
    } else if (userConfirmed && !driverConfirmed) {
      status = 'Pending Payment Release';
      statusColor = 'blue';
    } else if (!userConfirmed && driverConfirmed) {
      status = 'Driver Completed - Confirm?';
      statusColor = 'yellow';
      actionButtonText = 'Confirm & Release Payment';
      showActionButton = true;
    } else {
      status = 'Waiting to be Delivered';
      statusColor = 'purple';
    }
  }  return (
    <div className={`border border-${statusColor}-200 bg-${statusColor}-50 rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-${statusColor}-500 rounded-full flex items-center justify-center`}>
              {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-white" />}
            </div>
            <div>
              <span className="font-medium text-slate-800">Request #{Number(request.id)}</span>
              <p className="text-xs text-slate-500">Created: {new Date(Number(request.createdAt) * 1000).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-600 font-medium">Description:</p>
              <p className="text-slate-800">{request.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className={`w-4 h-4 text-${statusColor}-600`} />
              <span className={`font-bold text-${statusColor}-700 text-lg`}>{formatAmount(request.amount)} mUSDC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <p className="text-slate-600 font-medium">Pickup:</p>
                <p className="text-slate-800">{request.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <p className="text-slate-600 font-medium">Dropoff:</p>
                <p className="text-slate-800">{request.dropoffLocation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Driver: </span>
            <span className="font-mono text-slate-800">{formatAddress(assignedDriver)}</span>
          </div>

          {/* Confirmation Status */}
          {hasDriver && !isCompleted && !isCancelled && (
            <div className="bg-white/50 rounded p-2 text-xs">
              <p className="font-medium text-slate-700 mb-1">Confirmation Status:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className={`flex items-center gap-1 ${userConfirmed ? 'text-green-600' : 'text-gray-500'}`}>
                  {userConfirmed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>You: {userConfirmed ? 'Confirmed' : 'Pending'}</span>
                </div>
                <div className={`flex items-center gap-1 ${driverConfirmed ? 'text-green-600' : 'text-gray-500'}`}>
                  {driverConfirmed ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>Driver: {driverConfirmed ? 'Confirmed' : 'Pending'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showActionButton && (
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                onClick={() => confirmDeliveryAsUser(request.id)}
                disabled={confirmPending}
              >
                {confirmPending ? 'Processing Payment...' : actionButtonText}
              </button>
            )}
            
            {confirmError && (
              <div className="text-red-500 text-xs">{confirmError.message}</div>
            )}
            
            {confirmConfirmed && (
              <div className="text-green-600 text-xs">✓ Payment released to driver!</div>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-1 bg-${statusColor}-100 px-3 py-1 rounded-full ml-4`}>
          {isCompleted ? <CheckCircle className={`w-3 h-3 text-${statusColor}-600`} /> : <Clock className={`w-3 h-3 text-${statusColor}-600`} />}
          <span className={`text-xs font-medium text-${statusColor}-700`}>{status}</span>
        </div>
      </div>
    </div>
  );
}

export const UserRequestsList = ({ requestIds }: UserRequestsListProps) => {

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Your Delivery Requests</h2>
          <p className="text-slate-600 text-sm">Track your orders and delivery status</p>
        </div>
      </div>

      {requestIds.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium mb-2">No delivery requests yet</p>
          <p className="text-slate-400 text-sm">Create your first delivery request to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requestIds.map((requestId) => (
            <RequestCard key={Number(requestId)} requestId={requestId} />
          ))}
        </div>
      )}
    </div>
  );
};
