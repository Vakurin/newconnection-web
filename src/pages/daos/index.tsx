import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import Moralis from "moralis";
import Image from "next/image";
import basicAvatar from "assets/basic_avatar.jpg";
import { useMoralis } from "react-moralis";

const DAOsPage: NextPage = () => {
    const [DAOs, setDAOs] = useState<Moralis.Object<Moralis.Attributes>[]>();

    const { fetch } = useMoralisQuery("DAO", (query) => query.notEqualTo("objectId", ""), [], {
        autoFetch: false,
    });
    const { isInitialized } = useMoralis();

    const fetchDB = async () => {
        if (isInitialized) {
            await fetch({
                onSuccess: (results) => {
                    setDAOs(() => results);
                },
                onError: (error) => {
                    console.log("Error fetching db query" + error);
                },
            });
        }
    };

    // if we use isInitialized we call fetch only once when reload page or move to new page
    useEffect(() => {
        fetchDB();
    }, [isInitialized]);

    const DAOCard = ({ name, description, profileImage, address, isActive, proposals, votes }) => {
        return (
            <Link href={`/daos/${address}`}>
                <div
                    className={
                        "flex justify-between w-full h-36 p-3 mt-3 border-b-2 border-gray cursor-pointer"
                    }
                >
                    <div className={"flex gap-10 w-10/12"}>
                        <div className="w-28 h-28">
                            <Image className={"w-28 h-28 rounded-2xl"} src={basicAvatar} />
                        </div>
                        <div className="w-5/6 grid grid-cols-1 content-between">
                            <div className="w-full">
                                <p className="text-lg uppercase font-semibold cursor-pointer">
                                    {name}
                                </p>
                                <div className="text-gray-500 line-clamp-2">{description}</div>
                            </div>

                            <p
                                className={
                                    "text-gray2 text-sm cursor-pointer mb-1.5 hover:text-gray3 active:text-gray2"
                                }
                            >
                                View more
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col w-32 text-center text-xs">
                        {isActive ? (
                            <div className={"badge-active"}>Active voting now</div>
                        ) : (
                            <div className={"badge-active text-black"}>No active voting</div>
                        )}
                        <div className={"flex flex-col gap-3 mt-4"}>
                            <div className={"flex justify-between"}>
                                <p className={"text-gray2"}>Proposals:</p>
                                <p>{proposals}</p>
                            </div>
                            <div className={"flex justify-between"}>
                                <p className={"text-gray2"}>Votes:</p>
                                <p className="text-black">{votes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div>
            <Head>
                <title>DAOs</title>
            </Head>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className={"flex justify-between items-center"}>
                        <h1 className={"text-highlighter"}>DAOs</h1>
                        <Link href="./create-new-dao">
                            <button className={"secondary-button h-10 "}>Create DAO</button>
                        </Link>
                    </div>

                    <ul>
                        {DAOs &&
                            DAOs.map((dao) => {
                                const address = dao.get("contractAddress");
                                const name = dao.get("name");
                                const description = dao.get("description");
                                const profileImage = dao.get("profileImage");

                                //TODO: write to db
                                const isActive = true;
                                const proposals = 0;
                                const votes = 0;
                                return (
                                    <li key={address}>
                                        <DAOCard
                                            name={name}
                                            description={description}
                                            address={address}
                                            profileImage={profileImage}
                                            isActive={isActive}
                                            proposals={proposals}
                                            votes={votes}
                                        />
                                    </li>
                                );
                            })}
                    </ul>
                </section>
            </Layout>
        </div>
    );
};

export default DAOsPage;
