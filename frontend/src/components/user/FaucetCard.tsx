import { DollarSign } from "lucide-react";

interface FaucetCardProps {
  onClaimFaucet: () => void;
  isLoading: boolean;
  balance: string;
}

export const FaucetCard = ({ onClaimFaucet, isLoading, balance }: FaucetCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Get Test Tokens</h2>
          <p className="text-slate-600 text-sm">Claim free mUSDC for testing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-emerald-700">Current Balance</span>
            <span className="text-lg font-bold text-emerald-800">{balance} mUSDC</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((parseFloat(balance) / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={onClaimFaucet}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Claiming...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4" />
              Claim 100 mUSDC
            </>
          )}
        </button>

        <div className="text-xs text-slate-500 space-y-1">
          <p>• Free testnet tokens for development</p>
          <p>• 24-hour cooldown between claims</p>
          <p>• Use these tokens to test delivery requests</p>
        </div>
      </div>
    </div>
  );
};
