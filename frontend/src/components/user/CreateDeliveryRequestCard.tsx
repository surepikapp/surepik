import { useState } from "react";
import { ShoppingBag, DollarSign, MapPin, FileText } from "lucide-react";

interface CreateDeliveryRequestCardProps {
  onSubmit: (amount: string, description: string, pickupLocation: string, dropoffLocation: string) => void;
  isSubmitting: boolean;
  balance: string;
}

export const CreateDeliveryRequestCard = ({
  onSubmit,
  isSubmitting,
  balance
}: CreateDeliveryRequestCardProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(amount, description, pickupLocation, dropoffLocation);
    setAmount("");
    setDescription("");
    setPickupLocation("");
    setDropoffLocation("");
  };

  const balanceNumber = parseFloat(balance);
  const amountNumber = parseFloat(amount) || 0;
  const hasInsufficientBalance = amountNumber > balanceNumber;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Create Delivery Request</h2>
          <p className="text-slate-600 text-sm">Request a delivery with escrow protection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Delivery Description
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe what needs to be delivered..."
              rows={3}
              required
            />
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Provide details about the delivery
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter pickup address..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Dropoff Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter delivery address..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Delivery Amount (mUSDC)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                hasInsufficientBalance ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="0.00"
              required
            />
          </div>
          {hasInsufficientBalance && (
            <p className="text-red-500 text-sm mt-1">
              Insufficient balance. You have {balance} mUSDC available.
            </p>
          )}
          <p className="text-slate-500 text-sm mt-1">
            Available balance: {balance} mUSDC
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || hasInsufficientBalance || !amount || !description || !pickupLocation || !dropoffLocation}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Request...
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Create Delivery Request
            </>
          )}
        </button>
      </form>

      <div className="mt-6 bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-2">How it works:</h4>
        <ol className="text-sm text-slate-600 space-y-1 pl-4">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">1.</span>
            Enter delivery details, locations, and payment amount
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">2.</span>
            Your mUSDC tokens are held in smart contract escrow
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">3.</span>
            Available drivers can accept your delivery request
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">4.</span>
            Funds are automatically released upon delivery completion
          </li>
        </ol>
      </div>
    </div>
  );
};
