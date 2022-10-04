import * as React from "react";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

import Layout from "components/Layout/Layout";
import { BackButton } from "components/Button/";
import { handleAddArray, handleChangeBasic, handleChangeBasicArray } from "utils/handlers";
import { IAddNewMember } from "types/forms";
import { formatAddress } from "utils/address";
import { LockIcon } from "components/Icons";
import { getNumberOfTokenInOwnerAddress } from "contract-interactions/viewNftContract";
import { IChatsQuery } from "types/queryInterfaces";

const ChatsPage: NextPage = () => {
    const [chatActiveIndex, setChatActive] = useState(null);
    const { address } = useAccount();

    const [isChatOpen, setChatOpen] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState<IAddNewMember>();

    const [indexOfOpenChatsForUser, setIndexOpenChat] = useState([]);

    useEffect(() => {
        const query = router.query as IChatsQuery;
        handleChangeBasic(query.governorAddress, setFormData, "daoAddress");
        handleChangeBasic(query.daoName, setFormData, "daoName");
        handleChangeBasic(query.chainId, setFormData, "chainId");
        handleChangeBasicArray(query.blockchains, setFormData, "blockchainSelected");
        handleAddArray(query.tokenAddress, setFormData, "tokenAddress");
        const saved = localStorage.getItem(query.daoName + " NFTs");
        const initialValue = JSON.parse(saved);
        const tokenNames = [];
        initialValue.map((object) => {
            tokenNames.push(object.title);
        });
        console.log("query token address", query.tokenAddress);
        handleAddArray(tokenNames, setFormData, "tokenNames");
        query.tokenAddress ? checkNFTs(query.tokenAddress, address, +query.chainId) : console.log("don't have token");
    }, [router]);

    async function checkNFTs(tokenAddresses: string[], walletAddress: string, chainId: number) {
        console.log("Start check NFTs process");
        console.log(tokenAddresses);
        // Only one token
        if (typeof tokenAddresses === "string") {
            const numberOfTokens = +(await getNumberOfTokenInOwnerAddress(walletAddress, tokenAddresses, chainId));
            console.log("Number of tokens", numberOfTokens);
            if (numberOfTokens > 0) {
                setIndexOpenChat([...indexOfOpenChatsForUser, 0]);
            }
        } else {
            tokenAddresses.map(async (token, index) => {
                console.log(index);
                const numberOfTokens = +(await getNumberOfTokenInOwnerAddress(walletAddress, token, chainId));
                console.log("Number of tokens", numberOfTokens);
                if (numberOfTokens > 0) {
                    setIndexOpenChat(() => [...indexOfOpenChatsForUser, index]);
                }
            });
        }
    }

    console.log("Index of Open chats for user", indexOfOpenChatsForUser);

    return (
        <div>
            <Layout className="layout-base max-w-full" isMinHeightTurnOff={true}>
                <section className="relative w-full">
                    <BackButton />
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-highlighter">Membership chats</h1>
                        </div>
                        <div className="container mx-auto rounded-lg border-t border-[#ccc]">
                            <div className="flex flex-row justify-between bg-white">
                                {/* User chat*/}
                                <div className="flex flex-col w-2/5 overflow-y-auto border-r-2 border-gray pb-4">
                                    {formData ? (
                                        formData.tokenNames.map((chatName, index) => (
                                            <button
                                                className={
                                                    chatActiveIndex === index
                                                        ? "flex flex-row py-4 px-2 justify-center items-center border-l-4 border-purple"
                                                        : "flex flex-row py-4 px-2 justify-center items-center cursor-pointer disabled:cursor-not-allowed"
                                                }
                                                key={index}
                                                type={"button"}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setChatActive(index);
                                                    setChatOpen(true);
                                                    console.log("Index", index);
                                                }}
                                                //TODO change condition
                                                disabled={!indexOfOpenChatsForUser.includes(index)}
                                            >
                                                <div className="w-full">
                                                    <div className="text-lg font-semibold">{chatName}</div>
                                                    <span className="text-gray-500">DAO members</span>
                                                </div>
                                                {indexOfOpenChatsForUser.includes(index) ? <></> : <LockIcon />}
                                            </button>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {/* Messanger IFRAME */}
                                {isChatOpen && formData ? (
                                    <div className="w-full flex flex-col justify-between h-[calc(100vh-190px-165px)]">
                                        <iframe
                                            src={`https://newconnection.click/${
                                                formData.tokenAddress[chatActiveIndex]
                                            }/${formatAddress(address)}`}
                                            width="100"
                                            height="100"
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="w-full px-5 flex flex-col justify-between">
                                        <div className="flex flex-col mt-5 items-center content-center">
                                            <p>Join to one of DAOs and get NFT-membership to get access</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default ChatsPage;