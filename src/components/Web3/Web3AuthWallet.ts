import {
    Chain,
    Wallet,
} from "@rainbow-me/rainbowkit";
import { Web3AuthConnector } from "./connector";
import ASSETS from "assets";
export interface IWalletOptions {
    chains: Chain[];
}

export const web3AuthWallet = ({ chains }: IWalletOptions): Wallet => ({
    id: "web3auth",
    name: "Web3Auth",
    iconUrl: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
    iconBackground: "#fff",

    createConnector: () => {
        const connector = new Web3AuthConnector({
            chains: chains,
            options: {
                socialLoginConfig: { mfaLevel: "default" },
                enableLogging: false,
                clientId: "BONXAIAsHEXSHuEpA5kGei87cF8CXcvZIyRQuVgveMEEatHhJe7MeQTWcsq-kylSTBRuYiJkdu3fZcG4fv-O8OI",
                network: "mainnet",
                chainId: '0x89',
                uiConfig: {
                    appLogo: ASSETS.discord.src,
                    loginMethodsOrder: ["twitter", "google", "facebook"]
                }
            },
        });
        return {
            connector,
        };
    },
});