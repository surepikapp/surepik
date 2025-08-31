import { Award } from "lucide-react";

export const DriverTips = () => {
  const tips = [
    "Complete deliveries quickly to earn higher ratings and more NFT badges",
    "Every 5 completed deliveries earns you a reputation NFT badge",
    "Higher NFT badge counts unlock premium delivery requests",
    "Payments are instant in mUSDC stablecoins via smart contracts"
  ];

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-600" />
        Driver Tips
      </h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
