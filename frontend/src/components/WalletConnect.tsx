import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, AlertCircle, CheckCircle } from 'lucide-react';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '../utils/analytics';

interface WalletConnectProps {
  showFullAddress?: boolean;
  variant?: 'default' | 'compact' | 'button-only';
  onConnectionChange?: (isConnected: boolean, address?: string) => void;
}

export const WalletConnect = ({
  showFullAddress = false,
  variant = 'default',
  onConnectionChange
}: WalletConnectProps) => {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  // Notify parent component of connection changes
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(isConnected, address);
    }
  }, [isConnected, address, onConnectionChange]);

  // Show connection success toast
  useEffect(() => {
    if (isConnected && address) {
      toast({
        title: "🎉 Wallet Connected!",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        duration: 3000,
      });
    }
  }, [isConnected, address, toast]);

  const handleDisconnect = async () => {
    try {
      disconnect();
      analytics.trackWalletDisconnection(address);
      toast({
        title: "👋 Wallet Disconnected",
        description: "Your wallet has been safely disconnected.",
        duration: 3000,
      });
    } catch (error) {
      analytics.trackError(error as Error, 'wallet_disconnect', address);
      console.error('Disconnect error:', error);
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading state during connection
  if (isConnecting || isReconnecting) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-muted-foreground">
          {isReconnecting ? 'Reconnecting...' : 'Connecting...'}
        </span>
      </div>
    );
  }

  // Connected state
  if (isConnected && address) {
    const displayAddress = showFullAddress
      ? address
      : `${address.slice(0, 6)}...${address.slice(-4)}`;

    // if (variant === 'compact') {
    //   return (
    //     <div className="flex items-center gap-2">
    //       <CheckCircle className="w-4 h-4 text-emerald-500" />
    //       <span className="text-sm font-mono text-muted-foreground">
    //         {displayAddress}
    //       </span>
    //     </div>
    //   );
    // }

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-mono text-muted-foreground">
            {displayAddress}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  // Disconnected state
  if (variant === 'button-only') {
    return <ConnectKitButton />;
  }

  return (
    <div className="flex items-center gap-2">
      <AlertCircle className="w-4 h-4 text-amber-500" />
      <ConnectKitButton />
    </div>
  );
};