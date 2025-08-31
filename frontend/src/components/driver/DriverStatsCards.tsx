import { 
  Package, 
  Award, 
  Star, 
  DollarSign,
  TrendingUp,
  Target
} from "lucide-react";

interface DriverStats {
  totalDeliveries: number;
  totalEarnings: number;
  nftBadges: number;
  nextBadgeIn: number;
  rating: number;
}

interface DriverStatsCardsProps {
  stats: DriverStats;
}

export const DriverStatsCards = ({ stats }: DriverStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Deliveries */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <TrendingUp className="w-4 h-4 text-orange-200" />
        </div>
        <div>
          <p className="text-2xl font-bold mb-1">{stats.totalDeliveries}</p>
          <p className="text-orange-100 text-sm">Total Deliveries</p>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="w-12 h-12 bg-emerald-400/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-200" />
        </div>
        <div>
          <p className="text-2xl font-bold mb-1">${stats.totalEarnings}</p>
          <p className="text-emerald-100 text-sm">Total Earnings</p>
        </div>
      </div>

      {/* NFT Badges */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex">
            {Array.from({ length: stats.nftBadges }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold mb-1">{stats.nftBadges}</p>
          <p className="text-yellow-100 text-sm">NFT Badges</p>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <Target className="w-4 h-4 text-blue-200" />
        </div>
        <div>
          <p className="text-2xl font-bold mb-1">{stats.rating}</p>
          <p className="text-blue-100 text-sm">Average Rating</p>
        </div>
      </div>
    </div>
  );
};
