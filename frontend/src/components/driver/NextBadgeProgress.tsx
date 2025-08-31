import { Award } from "lucide-react";

interface NextBadgeProgressProps {
  nextBadgeIn: number;
}

export const NextBadgeProgress = ({ nextBadgeIn }: NextBadgeProgressProps) => {
  if (nextBadgeIn <= 0) return null;

  const progressPercentage = ((5 - nextBadgeIn) / 5) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Next NFT Badge</h3>
            <p className="text-white/70 text-sm">{nextBadgeIn} more deliveries to go!</p>
          </div>
        </div>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
