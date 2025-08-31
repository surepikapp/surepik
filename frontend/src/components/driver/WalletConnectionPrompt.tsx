import { CheckCircle, Wallet, ArrowLeft } from "lucide-react";
import { WalletConnect } from "../WalletConnect";

interface WalletConnectionPromptProps {
  onConnectionChange: (isConnected: boolean, address?: string) => void;
  onBack?: () => void;
}

export const WalletConnectionPrompt = ({ 
  onConnectionChange, 
  onBack 
}: WalletConnectionPromptProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-emerald-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Driver Dashboard</h1>
            <p className="text-orange-100">Connect your wallet to get started</p>
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

        {/* Wallet Connection Prompt */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-orange-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Connect Your Wallet</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            To access your driver dashboard and manage deliveries, please connect your wallet. 
            Your earnings will be paid instantly in mUSDC stablecoins.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-700">Instant stablecoin payouts after delivery completion</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-700">Earn reputation NFT badges every 5 deliveries</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-700">Secure escrow-protected transactions</span>
            </div>
          </div>

          <div className="flex justify-center">
            <WalletConnect 
              variant="button-only" 
              onConnectionChange={onConnectionChange}
            />
          </div>

          <p className="text-sm text-slate-500 mt-6">
            Supported on Morph Holesky testnet. Make sure your wallet is connected to the correct network.
          </p>
        </div>
      </div>
    </div>
  );
};
