import * as React from "react";
import Image from "next/image";
import ASSETS from "assets/index";
import Link from "next/link";
import { isIpfsAddress } from "utils/ipfsUpload";

export const DAOCard = ({ name, description, profileImage, url, isActive, proposals }) => {
    return (
        <Link href={`/daos/${url}`}>
            <div
                className={
                    "flex justify-between w-full h-50 p-3 border-b border-gray cursor-pointer active:bg-gray"
                }
            >
                <div className="flex gap-6 w-10/12 pt-3 pb-3">
                    <div className="w-28 h-28">
                        {!isIpfsAddress(profileImage) ? (
                            <Image
                                width={"115"}
                                height={"115"}
                                layout={"fixed"}
                                priority={true}
                                src={profileImage || ASSETS.daoLogoMock}
                                className="rounded-2xl"
                            />
                        ) : (
                            <div className="w-28 h-28 bg-gray2 rounded-2xl animate-pulse"></div>
                        )}
                    </div>
                    <div className="w-5/6 grid grid-cols-1 content-between">
                        <div className="w-full">
                            <p className="lg:text-lg text-base uppercase font-medium cursor-pointer">
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

                <div className="flex flex-col lg:w-32 w-28 text-center text-xs pt-3 pb-3">
                    {isActive ? (
                        <span className="badge-active">Active voting now</span>
                    ) : (
                        <span className="badge-active text-black ">No active voting</span>
                    )}
                    <div className={"flex flex-col gap-3 mt-4"}>
                        <div className={"flex justify-between"}>
                            <p className={"text-gray2"}>Proposals:</p>
                            <p>
                                {proposals ? (
                                    proposals || 0
                                ) : (
                                    //MOCK UP FOR LOADING
                                    <div className="bg-gray2 text-gray2 animate-pulse rounded-md">
                                        000
                                    </div>
                                )}
                            </p>
                        </div>
                        {/* <div className={"flex justify-between"}>
                            <p className={"text-gray2"}>Votes:</p>
                            <p className="text-black">{votes || 0}</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </Link>
    );
};
