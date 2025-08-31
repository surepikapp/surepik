import { Package, CheckCircle, Truck } from "lucide-react";
import { DeliveryRequestCard } from "./DeliveryRequestCard";

interface DeliveryRequest {
  id: number;
  user: string;
  amount: string;
  isCompleted: boolean;
  timestamp: string;
  rawAmount?: bigint;
}

interface DeliveryRequestsListProps {
  requests: DeliveryRequest[];
  onCompleteDelivery?: (requestId: number) => void;
  isCompleting?: boolean;
  variant: 'pending' | 'completed';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  emptyStateIcon: React.ReactNode;
}

export const DeliveryRequestsList = ({
  requests,
  onCompleteDelivery,
  isCompleting = false,
  variant,
  title,
  subtitle,
  icon,
  emptyStateTitle,
  emptyStateSubtitle,
  emptyStateIcon
}: DeliveryRequestsListProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          variant === 'pending' ? 'bg-orange-100' : 'bg-emerald-100'
        }`}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-600 text-sm">{subtitle}</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 text-slate-300 mx-auto mb-4">
            {emptyStateIcon}
          </div>
          <p className="text-slate-500 text-lg font-medium mb-2">{emptyStateTitle}</p>
          <p className="text-slate-400 text-sm">{emptyStateSubtitle}</p>
        </div>
      ) : (
        <div className={`space-y-4 ${variant === 'completed' ? 'max-h-96 overflow-y-auto' : ''}`}>
          {requests.map((request) => (
            <DeliveryRequestCard
              key={request.id}
              request={request}
              onComplete={variant === 'pending' ? onCompleteDelivery : undefined}
              isCompleting={isCompleting}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
};
