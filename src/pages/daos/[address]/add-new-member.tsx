import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import toast from "react-hot-toast";
import Layout from "components/Layout/Layout";
import { Button, InputText, InputTextArea, RadioSelectorMulti } from "components/Form";
import BackButton from "components/Button/backButton";
import { validateForm } from "utils/validate";
import { IAddNewMember } from "types/forms";
import {
    handleTextChangeAddNewMember,
    handleChangeBasicArray,
    handleChangeBasic,
    handleAddArray,
} from "utils/handlers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";

interface QueryUrlParams extends ParsedUrlQuery {
    daoName: string;
    nftAddress: string;
    governorAddress: string;
    blockchains: string[];
    tokenAddress: string[];
}

const AddNewMember: NextPage = () => {
    const [formData, setFormData] = useState<IAddNewMember>({
        daoName: "",
        walletAddress: "",
        daoAddress: "",
        tokenAddress: [],
        tokenNames: [],
        votingTokenAddress: "",
        votingTokenName: "",
        blockchainSelected: [],
        note: "",
    });
    const router = useRouter();

    // console.log(formData)
    console.log(formData.tokenNames)
    console.log(formData.tokenAddress)

    useEffect(() => {
        const query = router.query as QueryUrlParams;
        // console.log(query.tokenAddress);

        handleChangeBasic(query.governorAddress, setFormData, "daoAddress");
        handleChangeBasic(query.daoName, setFormData, "daoName");
        handleChangeBasicArray(query.blockchains, setFormData, "blockchainSelected");
        handleAddArray(query.tokenAddress, setFormData, "tokenAddress");
        const saved = localStorage.getItem(query.daoName + " NFTs");
        const initialValue = JSON.parse(saved);
        const tokenNames = [];
        console.log("saved", saved);
        initialValue.map((object) => {
            tokenNames.push(object.title);
        });
        handleAddArray(tokenNames, setFormData, "tokenNames");
        // console.log("token address", formData.tokenNames);
    }, [router]);

    async function sendSignatureRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (!validateForm(formData, ["note"])) {
            return;
        }

        try {
            const moralisProposal = getMoralisInstance(MoralisClassEnum.WHITELIST);
            setFieldsIntoMoralisInstance(moralisProposal, formData);
            await saveMoralisInstance(moralisProposal);
            toast.success("Wallet was saved", {
                duration: 4000,
                className: "bg-red",
                position: "bottom-center",
            });
            form.reset();
        } catch (error) {
            toast.error("Couldn't save your . Please try again");
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <BackButton />
                    <form
                        className="mx-auto flex max-w-4xl flex-col gap-4"
                        onSubmit={sendSignatureRequest}
                    >
                        <h1 className="text-highlighter">Become a member of</h1>
                        <h1 className="text-highlighter mt-0 text-purple">{formData.daoName}</h1>
                        <InputText
                            label="Wallet"
                            name="walletAddress"
                            placeholder="Your wallet address"
                            labelTitle="Your wallet address"
                            maxLength={42}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <label>
                            <div className="input-label">Choose voting token</div>
                        </label>
                        {formData.tokenAddress ? (
                            <RadioSelectorMulti
                                name="votingTokenAddress"
                                labels={[...formData.tokenNames]}
                                handleChange={(event) => {
                                    // setting tokenName
                                    const currentTokenName =
                                        event.currentTarget.nextSibling.textContent.slice(1);
                                    handleChangeBasic(
                                        currentTokenName,
                                        setFormData,
                                        "votingTokenName"
                                    );

                                    // setting tokenAddress
                                    handleTextChangeAddNewMember(event, setFormData);
                                }}
                                values={formData.tokenAddress}
                            />
                        ) : (
                            <></>
                        )}
                        <InputTextArea
                            name="note"
                            label="Note (optional)"
                            placeholder="You can add note and type something for DAO’s admin"
                            maxLength={2000}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <Button className="mt-5 w-full">Send a request</Button>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default AddNewMember;
