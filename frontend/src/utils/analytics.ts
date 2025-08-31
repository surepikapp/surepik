// Simple analytics utility for tracking wallet interactions and user events

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
  userAddress?: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;

  // Track wallet connection events
  trackWalletConnection(address: string, success: boolean) {
    this.track('wallet_connection', {
      address: address.slice(0, 6) + '...' + address.slice(-4), // Anonymize address
      success,
      network: 'morph-holesky'
    });
  }

  // Track wallet disconnection
  trackWalletDisconnection(address?: string) {
    this.track('wallet_disconnection', {
      address: address ? address.slice(0, 6) + '...' + address.slice(-4) : 'unknown'
    });
  }

  // Track transaction events
  trackTransaction(type: string, status: 'initiated' | 'pending' | 'confirmed' | 'failed', details?: Record<string, any>) {
    this.track('transaction', {
      type,
      status,
      ...details
    });
  }

  // Track delivery completion attempts
  trackDeliveryCompletion(requestId: number, success: boolean, error?: string) {
    this.track('delivery_completion', {
      requestId,
      success,
      error: error ? this.sanitizeError(error) : undefined
    });
  }

  // Track NFT minting events
  trackNFTMinting(address: string, success: boolean, deliveryCount: number) {
    this.track('nft_minting', {
      address: address.slice(0, 6) + '...' + address.slice(-4),
      success,
      deliveryCount
    });
  }

  // Track page views and navigation
  trackPageView(page: string, userAddress?: string) {
    this.track('page_view', {
      page,
      userAddress: userAddress ? userAddress.slice(0, 6) + '...' + userAddress.slice(-4) : undefined
    });
  }

  // Track errors for debugging
  trackError(error: Error | string, context?: string, userAddress?: string) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'object' ? error.stack : undefined;
    
    this.track('error', {
      message: this.sanitizeError(errorMessage),
      context,
      stack: errorStack ? this.sanitizeError(errorStack) : undefined,
      userAddress: userAddress ? userAddress.slice(0, 6) + '...' + userAddress.slice(-4) : undefined
    });

    // Also log to console for development
    console.error(`[Analytics Error] ${context || 'Unknown context'}:`, error);
  }

  // Generic track method
  private track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${event}:`, properties);
    }

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // Sanitize error messages to remove sensitive information
  private sanitizeError(error: string): string {
    return error
      .replace(/0x[a-fA-F0-9]{40}/g, '0x...') // Replace full addresses
      .replace(/\b\d{4,}\b/g, '***') // Replace long numbers
      .substring(0, 500); // Limit length
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const summary = {
      totalEvents: this.events.length,
      walletConnections: this.events.filter(e => e.event === 'wallet_connection').length,
      transactions: this.events.filter(e => e.event === 'transaction').length,
      deliveryCompletions: this.events.filter(e => e.event === 'delivery_completion').length,
      errors: this.events.filter(e => e.event === 'error').length,
      successRate: 0
    };

    const successfulDeliveries = this.events.filter(e => 
      e.event === 'delivery_completion' && e.properties?.success === true
    ).length;

    if (summary.deliveryCompletions > 0) {
      summary.successRate = (successfulDeliveries / summary.deliveryCompletions) * 100;
    }

    return summary;
  }

  // Export events for debugging or external analytics
  exportEvents() {
    return [...this.events];
  }

  // Clear all events
  clearEvents() {
    this.events = [];
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export types for use in components
export type { AnalyticsEvent };
