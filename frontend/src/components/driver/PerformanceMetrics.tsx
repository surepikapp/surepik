import { TrendingUp, Target, Clock, Star } from "lucide-react";

interface PerformanceMetricsProps {
  rating: number;
}

export const PerformanceMetrics = ({ rating }: PerformanceMetricsProps) => {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Performance Metrics
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mb-1">98.5%</p>
          <p className="text-sm text-slate-600">Success Rate</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mb-1">12 min</p>
          <p className="text-sm text-slate-600">Avg. Delivery Time</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mb-1">{rating}/5.0</p>
          <p className="text-sm text-slate-600">Customer Rating</p>
        </div>
      </div>
    </div>
  );
};
