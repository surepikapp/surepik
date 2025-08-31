import { Wallet, ShoppingBag } from "lucide-react";

interface UserStatsCardsProps {
  balance: string;
  totalRequests: number;
}

export const UserStatsCards = ({ balance, totalRequests }: UserStatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Balance Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-400/20 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-emerald-100 text-sm">mUSDC Balance</p>
            <p className="text-2xl font-bold">{balance}</p>
          </div>
        </div>
      </div>

      {/* Total Requests Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-orange-100 text-sm">Total Requests</p>
            <p className="text-2xl font-bold">{totalRequests}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
