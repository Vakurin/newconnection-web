import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { Signer } from "ethers";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import Image from "next/image";
import basicAvatar from "assets/basic_avatar.jpg";
import discordLogo from "assets/social/discord.png";
import twitterLogo from "assets/social/twitter.png";
import { Box } from "@mui/system";
import { Tab, Tabs } from "@mui/material";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import { IDAOPageForm } from "types/forms";
import { getChainScanner } from "utils/network";
import NFTExample from "assets/nft-example.png";
import { ExternalLinkIcon, GlobeAltIcon } from "@heroicons/react/solid";
import BlockchainExample from "assets/chains/Polygon.png";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { NFTDetailDialog } from "components/Dialog";
import classNames from "classnames";
import { mintClick } from "contract-interactions/useMintFunctions";
import { useSigner } from "wagmi";
import { useMoralis } from "react-moralis";
import { loadImage } from "../../utils/ipfsUpload";

interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
}

interface DAOPageProps {
    address: string;
}

export const getServerSideProps: GetServerSideProps<DAOPageProps, QueryUrlParams> = async (
    context
) => {
    const { address } = context.params as QueryUrlParams;

    const result: DAOPageProps = {
        address: address.toString()
    };
    return {
        props: result
    };
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const DAOPage: NextPage<DAOPageProps> = ({ address }) => {
    const [tabState, setTabState] = React.useState(0);
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [buttonState, setButtonState] = useState(false);
    const detailNFTDialog = useDialogState();
    const { data: signer_data } = useSigner();
    const { isInitialized } = useMoralis();

    const { fetch } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("contractAddress", address),
        [],
        {
            autoFetch: false
        }
    );

    const fetchDB = async () => {
        if (isInitialized) {
            await fetch({
                onSuccess: async (results) => {
                    const moralisInstance = results[0];
                    console.log("Parse Instance", moralisInstance);
                    const newDao: IDAOPageForm = {
                        name: moralisInstance.get("name"),
                        description: moralisInstance.get("description"),
                        goals: moralisInstance.get("goals"),
                        profileImage: await loadImage(moralisInstance.get("profileImage")),
                        coverImage: await loadImage(moralisInstance.get("coverImage")),
                        tokenAddress: moralisInstance.get("tokenAddress"),
                        votingPeriod: moralisInstance.get("votingPeriod"),
                        quorumPercentage: moralisInstance.get("quorumPercentage"),
                        type: moralisInstance.get("type"),
                        blockchain: moralisInstance.get("blockchain"),
                        contractAddress: moralisInstance.get("contractAddress"),
                        chainId: moralisInstance.get("chainId"),
                        //todo: parse below values
                        discordURL: moralisInstance.get("discordURL"),
                        twitterURL: moralisInstance.get("twitterURL"),
                        websiteURL: moralisInstance.get("websiteURL"),
                        scanURL: getChainScanner(
                            moralisInstance.get("chainId"),
                            moralisInstance.get("contractAddress")
                        ),
                        totalVotes: 0,
                        totalMembers: 0,
                        totalProposals: 0,
                        activeProposals: 0
                    };
                    setDAO(() => newDao);
                },
                onError: (error) => {
                    console.log("Error fetching db query" + error);
                }
            });
        }
    };

    useEffect(() => {
        fetchDB();
    }, [isInitialized]);

    const handleTabStateChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabState(newValue);
    };

    const StatisticCard = ({ label, counter }) => {
        return (
            <div
                className="group flex flex-col justify-between border-2 border-[#CECECE] rounded-lg w-1/4 h-36 pt-2 pl-4 pr-4 pb-3 hover:bg-[#7343DF] cursor-pointer">
                <div className={"text-gray-400 group-hover:text-white"}>{label}</div>
                <div className={"flex justify-end text-black text-5xl group-hover:text-white"}>
                    {counter || 0}
                </div>
            </div>
        );
    };

    const MockupTextCard = ({ label, text }) => {
        return (
            <div className="text-center my-32">
                <div className="font-semibold">{label}</div>
                <p className={"text-gray-400"}>{text}</p>
            </div>
        );
    };

    const ImageLink = ({ url, image }) => {
        return (
            <a href={url} target={"_blank"}>
                <Image height={"25"} width={"25"} src={image} />
            </a>
        );
    };

    const DetailsInfo = ["Blockchain", "Type", "Collection"];

    function detailNFT() {
        console.log("Press Button");
        detailNFTDialog.toggle();
    }

    interface INFTImage {
        image?: string;
        className?: string;
    }

    const NFTImage = ({ className }: INFTImage) => {
        return (
            <div className="flex justify-center">
                <Image
                    src={NFTExample}
                    className={classNames("rounded-t-md", className)}
                    objectFit="contain"
                />
            </div>
        );
    };

    const NFTCard = ({ tokenAddress, chainId, daoTitle }) => {
        return (
            <button className="nft-card" onClick={detailNFT}>
                {/* <a href={getChainScanner(chainId, tokenAddress)} target={"_blank"} className="nft-card"> */}
                {/* //Wrap to div for center elements */}
                <NFTImage />

                <div className="p-4 gap-y-6">
                    <p className="text-start">{daoTitle}: Membership </p>
                    <div className="flex pt-4 justify-between">
                        <p className="font-light text-sm text-[#AAAAAA]">Type: Art</p>
                        <Image src={BlockchainExample} height="24" width="24" />
                    </div>
                </div>
                {/* </a> */}
            </button>
        );
    };

    const LoadingSpinner = () => {
        return (
            <button
                disabled
                type="button"
                className="secondary-button w-full text-center h-12 text-gray-900 border pr-10"
            >
                <svg
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin text-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#E5E7EB"
                    />
                </svg>
                Loading...
            </button>
        );
    };

    async function mint() {
        if (!DAO) return null;
        setButtonState(true);
        try {
            const tx = await mintClick(DAO.tokenAddress, signer_data as Signer);
            // window.setTimeout(slowAlert, 4000);// 2 sec
            setButtonState(true);
            console.log("Congratulation your nft is minted");
        } catch (e) {
            setButtonState(false);
            console.log("Transaction canceled");
        }

        console.log("TX Succes");
    }

    return DAO ? (
        <div>
            <Head>
                <title>{DAO.name}</title>
            </Head>
            <Layout className="layout-base mt-0">
                <div className="cover h-36 w-full relative justify-center">
                    <Image
                        src={DAO.coverImage ? DAO.coverImage : basicAvatar}
                        layout={"fill"}
                    />
                </div>

                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-info flex justify-between">
                        <div className="flex">
                            <div className="mt-[-50px] ">
                                <Image
                                    src={DAO.profileImage ? DAO.profileImage : basicAvatar}
                                    height={"150px"}
                                    width={"150px"}
                                    className="rounded-xl"
                                />
                            </div>
                            <h1 className="dao-label">{DAO.name}</h1>
                        </div>
                        <Link
                            href={{
                                pathname: "/daos/add-new-member",
                                query: { daoName: DAO.name, nftAddress: DAO.tokenAddress }
                            }}
                        >
                            <button className="secondary-button mt-6">Become a member</button>
                        </Link>
                    </div>
                    <div className="flex justify-between gap-10 w-full">
                        <div className="flex w-1/2 justify-between">
                            <a
                                href={DAO.websiteURL}
                                target={"_blank"}
                                className={"hover:text-[#7343DF]"}
                            >
                                About DAO
                            </a>
                            <a
                                href={DAO.scanURL}
                                target={"_blank"}
                                className="hover:text-[#7343DF] flex gap-3"
                            >
                                Smart Contract
                                <ExternalLinkIcon className="h-6 w-5" />
                            </a>
                            <a
                                href={DAO.websiteURL}
                                target={"_blank"}
                                className="hover:text-[#7343DF]"
                            >
                                DAO Blockchains
                            </a>
                        </div>
                        <div className="flex w-1/3 justify-end gap-7">
                            {DAO.discordURL ? (
                                <ImageLink url={DAO.discordURL} image={discordLogo} />
                            ) : null}
                            {DAO.twitterURL ? (
                                <ImageLink url={DAO.twitterURL} image={twitterLogo} />
                            ) : null}

                            {DAO.websiteURL ? (
                                <a href={DAO.websiteURL}>
                                    <GlobeAltIcon className="h-6 w-6" />
                                </a>
                            ) : null}
                        </div>
                    </div>

                    <div className="dao-statistics flex flex-row justify-between">
                        <StatisticCard label={"Total votes"} counter={DAO.totalVotes} />
                        <StatisticCard label={"Total proposals"} counter={DAO.totalProposals} />
                        <StatisticCard label={"Total members"} counter={DAO.totalMembers} />
                    </div>

                    <div className="dao-proposals-members">
                        <div className="flex justify-between">
                            <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                                <Tabs
                                    textColor={"inherit"}
                                    TabIndicatorProps={{
                                        sx: {
                                            backgroundColor: "#6858CB"
                                        }
                                    }}
                                    value={tabState}
                                    onChange={handleTabStateChange}
                                    aria-label="tabs"
                                >
                                    <Tab
                                        label={`Proposals`}
                                        className={"font-semibold text-lg capitalize"}
                                    />
                                    <Tab
                                        label={`Members`}
                                        className={"font-semibold text-lg capitalize"}
                                    />
                                </Tabs>
                            </Box>

                            <Link
                                href={{
                                    pathname: "/create-proposal",
                                    query: { governorAddress: DAO.contractAddress }
                                }}
                            >
                                <button className="secondary-button">Add new proposal</button>
                            </Link>
                        </div>
                        <TabPanel value={tabState} index={0}>
                            {DAO.totalProposals ? (
                                DAO.totalProposals
                            ) : (
                                <MockupTextCard
                                    label={"No proposals here yet"}
                                    text={
                                        "You should first add NFTs so that members can vote " +
                                        "then click the button “Add new proposal” and initiate a proposal"
                                    }
                                />
                            )}
                        </TabPanel>
                        <TabPanel value={tabState} index={1}>
                            {DAO.totalMembers ? (
                                DAO.totalMembers
                            ) : (
                                <MockupTextCard
                                    label="No members here yet"
                                    text="You should first add NFTs for members"
                                />
                            )}
                        </TabPanel>
                    </div>

                    <>
                        <div className="flex flex-row justify-between mb-4 ">
                            <h3 className="text-black font-normal text-2xl">Membership NFTs</h3>
                            <button className="settings-button cursor-not-allowed">Add NFT</button>
                        </div>
                        {DAO.tokenAddress ? (
                            <div className="flex justify-between">
                                <NFTCard
                                    chainId={DAO.chainId}
                                    tokenAddress={DAO.tokenAddress}
                                    daoTitle={DAO.name}
                                />
                            </div>
                        ) : (
                            <MockupTextCard
                                label={"No NFT membership"}
                                text={
                                    "You should first add NFTs so that members can vote " +
                                    "then click the button “Add new proposal” and initiate a proposal"
                                }
                            />
                        )}
                    </>
                </section>
                <NFTDetailDialog
                    dialog={detailNFTDialog}
                    className="h-full items-center text-center "
                >
                    <NFTImage className="rounded-lg h-14 w-14" />
                    <p className="mt-4 text-black">Membership NFT</p>

                    <button
                        className="secondary-button w-full h-12 mt-4 mb-2 gradient-btn-color cursor-not-allowed transition delay-150 hover:reverse-gradient-btn-color ">
                        Transfer
                    </button>
                    <p className="text-gray2 font-light text-sm">
                        Try to transfer your NFT to another network
                    </p>

                    <p className="w-full mt-12 text-start text-black">Details</p>
                    <ul className="py-6 divide-y divide-slate-200">
                        {DetailsInfo.map((element) => (
                            <li key={element} className="flex py-4 justify-between">
                                <p className="font-light text-gray2">{element}</p>
                                <p className="font-normal text-black">{element}</p>
                            </li>
                        ))}
                    </ul>
                    {buttonState ? (
                        <LoadingSpinner />
                    ) : (
                        <button className="secondary-button w-full h-12 mt-4 mb-6" onClick={mint}>
                            Mint NFT
                        </button>
                    )}
                </NFTDetailDialog>
            </Layout>
        </div>
    ) : (
        <div>
            <Head>
                <title>Not found</title>
            </Head>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <MockupTextCard
                        label={"DAO not found"}
                        text={"Sorry, DAO not fount. Please try to reload page"}
                    />
                </section>
            </Layout>
        </div>
    );
};

export default DAOPage;
