import { CheckCircle, DollarSign } from "lucide-react";

interface DeliveryRequest {
  id: number;
  user: string;
  amount: string;
  isCompleted: boolean;
  timestamp: string;
  rawAmount?: bigint;
}

interface DeliveryRequestCardProps {
  request: DeliveryRequest;
  onComplete?: (requestId: number) => void;
  isCompleting?: boolean;
  variant?: 'pending' | 'completed';
}

export const DeliveryRequestCard = ({ 
  request, 
  onComplete, 
  isCompleting = false,
  variant = 'pending'
}: DeliveryRequestCardProps) => {
  const isPending = variant === 'pending';
  
  return (
    <div className={`border rounded-lg p-4 transition-colors ${
      isPending 
        ? 'border-slate-200 hover:bg-slate-50' 
        : 'border-emerald-200 bg-emerald-50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isPending 
                ? 'bg-orange-100' 
                : 'bg-emerald-500'
            }`}>
              {isPending ? (
                <span className="text-orange-600 font-semibold text-sm">#{request.id}</span>
              ) : (
                <CheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="font-medium text-slate-800">
              {isPending ? 'Delivery Request' : `Request #${request.id}`}
            </span>
          </div>
          
          <p className="text-sm text-slate-600">
            From: <span className="font-mono">{request.user.slice(0, 8)}...{request.user.slice(-6)}</span>
          </p>
          
          <p className="text-sm text-slate-500">{request.timestamp}</p>
          
          <div className="flex items-center gap-2">
            <DollarSign className={`w-4 h-4 ${isPending ? 'text-emerald-500' : 'text-emerald-600'}`} />
            <span className={`font-bold text-lg ${
              isPending ? 'text-emerald-600' : 'text-emerald-700'
            }`}>
              {request.amount} mUSDC
            </span>
          </div>
        </div>

        {isPending && onComplete ? (
          <button
            onClick={() => onComplete(request.id)}
            disabled={isCompleting}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            {isCompleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete
              </>
            )}
          </button>
        ) : !isPending ? (
          <div className="flex items-center gap-1 bg-emerald-100 px-3 py-1 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Completed</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
