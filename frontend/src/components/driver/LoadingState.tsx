import { ArrowLeft } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  onBack?: () => void;
}

export const LoadingState = ({ 
  message = "Loading your dashboard...", 
  onBack 
}: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-emerald-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Driver Dashboard</h1>
            <p className="text-orange-100">Loading your data...</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-white hover:text-orange-200 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>

        {/* Loading Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Loading Dashboard</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            {message}
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Fetching delivery data...</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-200"></div>
              <span className="text-sm text-slate-600">Loading reputation badges...</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-400"></div>
              <span className="text-sm text-slate-600">Syncing with blockchain...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
