import { ethers } from "ethers";
import { TREASURY_ABI } from "abis";
import { getTokenSymbol } from "utils/blockchains";
import { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";
import { provider } from "components/Web3";
import { getExchangeRate } from "utils/cryptocompare";

export async function getTreasuryOwnerAddress(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId }) as BaseProvider;
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, baseProvider);
    return await treasury.owner();
}

export async function getTreasuryBalance(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId }) as BaseProvider;
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, baseProvider);

    const ethBalance = +ethers.utils.formatEther(await baseProvider.getBalance(treasury.address));
    // console.log(ethBalance);

    const exchangeRate = await getExchangeRate(getTokenSymbol(chainId), "USD");
    // console.log(x);

    return ethBalance * exchangeRate;
}