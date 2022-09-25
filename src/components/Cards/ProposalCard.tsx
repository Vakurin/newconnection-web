import Image from "next/image";
import { timestampToDate } from "utils/basic";
import { getLogoURI } from "../../utils/blockchains";

interface IProposalCard {
    title: string;
    shortDescription: string;
    chainId?: number;
    tokenName?: string;
    description?: string;
    daoName?: string;
    blockchain?: string[];
    isActive?: boolean;
    forVotes?: string;
    againstVotes?: string;
    deadline?: number;
}

const ProposalCard = (
    {
        title,
        shortDescription,
        tokenName,
        isActive,
        chainId,
        forVotes,
        againstVotes,
        deadline,

    }: IProposalCard) => {
    const againstV = +againstVotes! ?? 0;
    const forV = +forVotes! ?? 0;
    return (
        <div className="h-52 py-5 justify-between">
            <div className="flex justify-between pb-6">
                <p className="font-medium text-xl">{title}</p>
                <div>
                    {isActive ? (
                        <div className="flex gap-5">
                            <p className="font-light text-sm mt-1">
                                Ends {timestampToDate(deadline || 0)}
                            </p>
                            <p className="text-green bg-gray px-5 py-0.5 rounded-full">Active</p>
                        </div>
                    ) : (
                        <p className="text-red bg-gray px-5 py-0.5 rounded-full">Closed</p>
                    )}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-3/4 grid grid-cols-1 content-between">
                    <p className="w-full font-normal line-clamp-3 pr-4">{shortDescription}</p>
                    <div className="flex gap-5 pb-2">
                        <div className="flex gap-5">
                            <p className="text-gray3">For</p>
                            <p className="font-medium">{tokenName}</p>
                        </div>
                        <Image src={getLogoURI(chainId)} height={12} width={23}/>
                    </div>
                </div>

                <div className="w-1/5 flex gap-10 items-left justify-between">
                    <div className="text-center">
                        <div className="relative px-5 py-3 text-black">
                            <p className="text-2xl font-light">{forV}</p>
                            <span
                                className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-green rounded-full text-xs text-white"></span>
                        </div>
                        <p>{"In favor"}</p>
                    </div>
                    <div className="text-center">
                        <div className="relative px-5 py-3 text-black">
                            <p className="text-2xl font-light">{againstV}</p>
                            <span
                                className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-red rounded-full text-xs text-white"></span>
                        </div>
                        <p>{"Against"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalCard;
