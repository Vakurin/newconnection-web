import { ParsedUrlQuery } from "querystring";

export interface IDaoQuery extends ParsedUrlQuery {
    url: string;
}

export interface IChatsQuery extends ParsedUrlQuery {
    daoName: string;
    nftAddress: string;
    governorAddress: string;
    blockchains: string[];
    tokenAddress: string[];
    chainId: string;
}

export interface IDetailProposalQuery extends ParsedUrlQuery {
    detailProposal: string;
}

export interface IProposals extends ParsedUrlQuery {
    name: string;
    governorAddress: string;
    chainId: string;
}

export interface IAddMemberQuery extends ParsedUrlQuery {
    daoName: string;
    nftAddress: string;
    governorAddress: string;
    blockchains: string[];
    tokenAddress: string[];
}

export interface IAddNftQuery extends ParsedUrlQuery {
    governorAddress: string;
    blockchain: string;
}

export interface ICreateProposalQuery extends ParsedUrlQuery {
    governorAddress: string;
    blockchains: string[];
    chainId: string;
}

export interface ICreateDaoQuery extends ParsedUrlQuery {
    tokenAddress: string;
    enabledBlockchains: string[];
}