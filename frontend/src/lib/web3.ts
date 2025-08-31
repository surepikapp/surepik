import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { liskSepolia } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [liskSepolia],
    //   transports: {
    //     [mainnet.id]: http(),
    //     [sepolia.id]: http(),
    //   },
    // transports: {
    //   // RPC URL for each chain
    //   [mainnet.id]: http(
    //     `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.NEXT_PUBLIC_ALCHEMY_ID}`
    //   ),
    // },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID,

    appName: "Morphride App",
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
