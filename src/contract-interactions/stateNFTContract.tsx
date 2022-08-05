import { ethers, Signer } from "ethers";
import { GOVERNANCE_NFT_ABI } from "../abis";

interface IAddToWhitelist {
    addressNFT: string;
    walletAddress?: string;
    signer?: Signer;
}

export async function AddToWhitelist({ addressNFT, walletAddress, signer }: IAddToWhitelist) {
    const erc721_rw = new ethers.Contract(addressNFT, GOVERNANCE_NFT_ABI, signer);
    try {
        const tx = await erc721_rw.setAllowList([walletAddress], 1);
        console.log("Transaction add to WL", tx);
        return true;
    } catch (e) {
        console.log("[ERROR] add to whitelist", e);
        return false;
    }
}

export async function setURI(contractAddress: string, signer: Signer, URI: string) {
    const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, signer);

    return await nft.setBaseURI(URI);
}
