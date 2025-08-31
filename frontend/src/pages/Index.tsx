import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/WalletConnect';
import { DeliveryRequestForm } from '@/components/DeliveryRequestForm';
import { DriverDashboard } from '@/components/DriverDashboard';
import { Truck, Package, Award } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">DeliverChain</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Decentralized Delivery Service</h2>
          <p className="text-muted-foreground">
            Create delivery requests with crypto payments and build driver reputation with NFT badges
          </p>
        </div>

        <Tabs defaultValue="request" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Request Delivery
            </TabsTrigger>
            <TabsTrigger value="driver" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Driver Dashboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="mt-6">
            <DeliveryRequestForm />
          </TabsContent>
          
          <TabsContent value="driver" className="mt-6">
            <DriverDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
