import { configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { getChains } from "interactions/contract";
import { INFURA_ID } from "utils";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";

export const { chains, provider, webSocketProvider } = configureChains(getChains(), [
    infuraProvider({ priority: 0, apiKey: INFURA_ID }),
    // alchemyProvider({ priority: 1, apiKey: alchemyId }),
    jsonRpcProvider({
        priority: 2,
        rpc: (chain) => {
            return { http: chain.rpcUrls.default };
        },
    }),
    publicProvider({ priority: 3 }),
]);

const connectors = connectorsForWallets([
    {
        groupName: "Wallets",
        wallets: [
            metaMaskWallet({ chains }),
            walletConnectWallet({ chains }),
        ],
    },
]);

export const wagmiClient = createClient({
    autoConnect: true,
    webSocketProvider,
    connectors,
    provider,
});
