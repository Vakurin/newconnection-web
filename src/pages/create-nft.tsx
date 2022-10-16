import React, { useState } from "react";
import Layout, {
    BackButton,
    Button,
    CreateNftDialog,
    DragAndDropImage,
    handleNext,
    handleReset,
    InputAmount,
    InputSupplyOfNFT,
    InputText,
    InputTextArea,
} from "components";
import { Signer } from "ethers";
import { useSigner, useSwitchNetwork } from "wagmi";
import { NextPage } from "next";
import { ICreateNFT } from "types";
import {
    handleChangeBasic,
    handleContractError,
    handleImageChange,
    handleNftSupplyChange,
    handleTextChange,
    storeNFT,
    validateForm,
} from "utils";
import { useDialogState } from "ariakit";
import {
    chainIds,
    checkCorrectNetwork,
    deployNFTContract,
    getChain,
    getChainNames,
    getLogoURI,
    layerzeroEndpoints,
} from "interactions/contract";

const CreateNFT: NextPage = () => {
    const [formData, setFormData] = useState<ICreateNFT>({
        name: "",
        description: "",
        file: {},
        symbol: "",
        price: 0,
        contractAddress: "",
        ipfsAddress: "",
        blockchain: "",
    });
    const { data: signerData } = useSigner();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const { switchNetwork } = useSwitchNetwork();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateForm(formData, ["ipfsAddress", "contractAddress", "price"])) {
            return;
        }

        if (!(await checkCorrectNetwork(signerData, getChain(formData.blockchain).id, switchNetwork))) {
            return;
        }

        handleReset(setActiveStep);

        // SHOW DIALOG
        confirmDialog.toggle();

        const calculateSupply = () => {
            return formData[
                getChainNames().find((chain) => {
                    const supply = formData[chain];
                    return supply !== 0 && supply !== "" && supply !== undefined;
                })
                ];
        };

        try {
            const path = await storeNFT(formData.file as File);
            console.log("path " + path);
            handleChangeBasic(path, setFormData, "ipfsAddress");

            const chainId = await signerData.getChainId();
            const endpoint: string = layerzeroEndpoints[chainIds[chainId]] || layerzeroEndpoints["not-supported"];

            const contract = await deployNFTContract(signerData as Signer, {
                name: formData.name,
                symbol: formData.symbol,
                baseURI: path,
                price: formData.price ? formData.price.toString() : "0",
                layerzeroEndpoint: endpoint,
                //todo: need to calculate when few blockchains
                startMintId: 0,
                endMintId: calculateSupply(),
            });
            handleNext(setActiveStep);
            await contract.deployed();
            console.log(`Deployment successful! Contract Address: ${contract.address}`);
            handleNext(setActiveStep);
            handleNext(setActiveStep);
            handleChangeBasic(contract.address, setFormData, "contractAddress");
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            handleReset(setActiveStep);
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <BackButton />
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <h1 className="text-highlighter">Add NFT</h1>
                        <div className="w-full lg:flex">
                            <div className="lg:w-2/3 w-full">
                                <InputText
                                    label="Name"
                                    name="name"
                                    placeholder="NFT Name"
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <InputTextArea
                                    label="Description"
                                    name="description"
                                    placeholder="A short description about NFT collection(Max. 250 words)"
                                    maxLength={2000}
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <div className="flex justify-between gap-10">
                                    <InputText
                                        label="Symbol"
                                        name="symbol"
                                        placeholder="Short NFT name"
                                        handleChange={(event) => {
                                            handleTextChange(event, setFormData);
                                        }}
                                        className="w-1/2"
                                    />
                                    <InputAmount
                                        label="Price"
                                        placeholder="Price in ETH"
                                        name="price"
                                        handleChange={(event) => handleTextChange(event, setFormData)}
                                        className="w-full"
                                        min={0}
                                        step={0.0001}
                                        max={10}
                                    />
                                </div>

                                <label>
                                    <div className="input-label"> NFT Supply</div>
                                </label>
                                <div className="grid w-full grid-cols-4 gap-4">
                                    {getChainNames().map((chain) => (
                                        // chain === "Polygon" ? (
                                        <InputSupplyOfNFT
                                            key={chain}
                                            label={chain}
                                            name={chain}
                                            image={getLogoURI(chain)}
                                            handleChange={(event) => {
                                                handleNftSupplyChange(event, setFormData, chain, "blockchain");
                                            }}
                                            isDisabled={chain !== formData.blockchain && formData.blockchain !== ""}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-1/3 lg:ml-10">
                                <DragAndDropImage
                                    label="Image"
                                    name="file"
                                    handleChange={(file) => handleImageChange(file, setFormData, "file")}
                                />
                            </div>
                        </div>
                        <Button className="mt-5 w-2/3">Create Contract</Button>
                    </form>
                </section>

                <CreateNftDialog formData={formData} activeStep={activeStep} dialog={confirmDialog} />
            </Layout>
        </div>
    );
};

export default CreateNFT;
