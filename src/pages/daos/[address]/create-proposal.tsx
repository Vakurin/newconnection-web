import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import type { NextPage } from "next";
import toast from "react-hot-toast";
import { IMultiNFTVoting } from "types/forms";
import { useSigner, useSwitchNetwork } from "wagmi";
import Layout from "components/Layout/Layout";
import {
    handleTextChange,
    handleCheckboxChange,
    handleChangeBasic,
    handleTextChangeAddNewMember,
    handleAddArray,
    handleChangeBasicArray,
} from "utils/handlers";
import {
    CheckboxGroup,
    InputText,
    Button,
    InputTextArea,
    RadioSelectorMulti,
} from "components/Form";
import { ICreateProposal } from "types/forms";
import BackButton from "components/Button/backButton";
import { useDialogState } from "ariakit";
import { validateForm } from "utils/validate";
import { createProposal } from "contract-interactions/writeGovernorContract";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Signer } from "ethers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { handleNext, handleReset, StepperDialog } from "components/Dialog";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { getChainNames } from "../../../utils/blockchains";
import { formatAddress } from "../../../utils/address";
import { ClipboardCopyIcon } from "@heroicons/react/solid";

interface QueryUrlParams extends ParsedUrlQuery {
    governorAddress: string;
    blockchains: string[];
    chainId: string;
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CreateProposal: NextPage = () => {
    const [formData, setFormData] = useState<ICreateProposal>({
        governorAddress: "",
        name: "",
        shortDescription: "",
        tokenAddress: "",
        tokenName: "",
        description: "",
        options: [],
        blockchain: [],
        enabledBlockchains: [],
    });
    const router = useRouter();
    const [votingNFTs, setVotingNFTs] = useState<IMultiNFTVoting>();
    const { data: signer_data } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const { isInitialized } = useMoralis();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);
    const firstUpdate = useRef(true);

    const { fetch } = useMoralisQuery(
        "DAO",
        (query) => {
            return query.equalTo("governorAddress", formData.governorAddress);
        },
        [formData.governorAddress],
        {
            autoFetch: false,
        }
    );

    const fetchData = async () => {
        console.log("isInitialized: ", isInitialized);
        if (isInitialized) {
            await fetch({
                onSuccess: async (results) => {
                    const votingTokens = results[0];
                    const newVotingTokens: IMultiNFTVoting = {
                        daoAddress: await votingTokens.get("governorAddress"),
                        tokenAddress: await votingTokens.get("tokenAddress"),
                        daoName: await votingTokens.get("name"),
                    };
                    setVotingNFTs(() => newVotingTokens);

                    const saved = localStorage.getItem(newVotingTokens.daoName + " NFTs");
                    const initialValue = JSON.parse(saved);
                    // console.log("saved", initialValue);
                    let tokensNames = [];
                    initialValue.map((object) => {
                        tokensNames.push(object.title);
                    });
                    handleAddArray(tokensNames, setVotingNFTs, "tokenNames");
                },
                onError: (error) => {
                    console.log("Error fetching db query" + error);
                },
            });
        }
    };

    const setupData = async () => {
        const query = router.query as QueryUrlParams;
        // console.log(query)
        handleChangeBasic(query.governorAddress, setFormData, "governorAddress");
        handleChangeBasicArray(query.blockchains, setFormData, "enabledBlockchains");
        handleChangeBasic(query.chainId, setFormData, "chainId");
    };

    useEffect(() => {
        setupData();
    }, [router]);

    useIsomorphicLayoutEffect(() => {
        if (formData.governorAddress && firstUpdate.current) {
            console.log("IsomorphicLayout", formData.governorAddress);
            firstUpdate.current = false;
            fetchData();
        }
    });

    async function createProposalContract(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["options"])) {
            return;
        }

        switchNetwork(formData.chainId);

        handleReset(setActiveStep);
        confirmDialog.toggle();

        let proposalId;
        console.log("0", formData.tokenAddress);
        try {
            proposalId = await createProposal(
                formData.governorAddress,
                signer_data as Signer,
                formData.name,
                formData.tokenAddress
            );
            handleNext(setActiveStep);
            handleNext(setActiveStep);
            handleChangeBasic(proposalId, setFormData, "proposalId");
            handleNext(setActiveStep);
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            toast.error("Please approve transaction to create DAO");
            return;
        }

        try {
            const chainId = await signer_data.getChainId();
            handleChangeBasic(chainId.toString(), setFormData, "chainId");
            const moralisProposal = getMoralisInstance(MoralisClassEnum.PROPOSAL);
            setFieldsIntoMoralisInstance(moralisProposal, formData);
            moralisProposal.set("proposalId", proposalId);
            moralisProposal.set("chainId", chainId);
            await saveMoralisInstance(moralisProposal);
        } catch (error) {
            confirmDialog.toggle();
            toast.error("Сouldn't save your DAO. Please try again");
            return;
        }
    }

    //todo
    console.log(formData);
    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <BackButton />
                    <form
                        className="mx-auto flex max-w-4xl flex-col gap-4"
                        onSubmit={createProposalContract}
                    >
                        <h1 className="text-highlighter">New Proposal</h1>
                        <InputText
                            label="Title"
                            name="name"
                            placeholder="Title of purpose"
                            handleChange={(event) => {
                                handleTextChange(event, setFormData);
                            }}
                        />
                        <InputTextArea
                            label="Short Description"
                            name="shortDescription"
                            placeholder="A short description of your proposal"
                            maxLength={250}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputTextArea
                            label="Description"
                            name="description"
                            placeholder="A full description of your proposal"
                            maxLength={3000}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                            isRequired
                        />
                        <CheckboxGroup
                            label="Proposal Blockchain"
                            description="You can choose one or more blockchains"
                            images={true}
                            values={[...getChainNames()]}
                            enabledValues={formData.enabledBlockchains}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        <p>Choose voting token</p>
                        {votingNFTs ? (
                            <RadioSelectorMulti
                                name="tokenAddress"
                                labels={[...votingNFTs.tokenNames]}
                                handleChange={(event) => {
                                    // setting tokenName
                                    const currentTokenName =
                                        event.currentTarget.nextSibling.textContent.slice(1);
                                    handleChangeBasic(currentTokenName, setFormData, "tokenName");

                                    // setting tokenAddress
                                    handleTextChangeAddNewMember(event, setFormData);
                                }}
                                values={votingNFTs.tokenAddress}
                            />
                        ) : (
                            <></>
                        )}
                        <Button className="mt-5">Create Proposal</Button>
                    </form>
                </section>
                <StepperDialog dialog={confirmDialog} className="dialog" activeStep={activeStep}>
                    <p>Proposal created successful!</p>
                    <div className="flex mb-10">
                        Proposal Id:
                        <div
                            className={
                                "flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"
                            }
                            onClick={() => navigator.clipboard.writeText(formData.proposalId)}
                        >
                            {formatAddress(formData.proposalId)}
                            <ClipboardCopyIcon className="h-6 w-5" />
                        </div>
                    </div>
                    <button
                        className="form-submit-button"
                        onClick={() => {
                            confirmDialog.toggle();
                            router.back();
                        }}
                    >
                        Back to DAO
                    </button>
                </StepperDialog>
            </Layout>
        </div>
    );
};

export default CreateProposal;
