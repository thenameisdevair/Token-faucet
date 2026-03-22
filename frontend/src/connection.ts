import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { liskSepolia as rawLisk, type AppKitNetwork } from "@reown/appkit/networks";


// get Project id
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

export const liskTestnet:AppKitNetwork = {
    ...rawLisk,
    id: 4202, 
    chainNamespace: "eip155",
    caipNetworkId: "eip155:4202",
};

// 2. set the networks
const networks:[AppKitNetwork, ...AppKitNetwork[]] = [
    liskTestnet,
];

// 3. create a meta data object

const metadata = {
  name: "ERCASSIGN",
  description: "A token Faucet",
  url: "https://your-app.vercel.app", // update after deploy
  icons: ["https://your-app.vercel.app/favicon.svg"],
};

//4. create a appkit instance
export const appkit = createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    allowUnsupportedChain: false,
    allWallets: "SHOW",
    defaultNetwork: liskTestnet,
    enableEIP6963: true, 
    features: {
        analytics: true,
        allWallets: true, 
        email: false,
        socials: [],
    },
});

appkit.switchNetwork(liskTestnet);