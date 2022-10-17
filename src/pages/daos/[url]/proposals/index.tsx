import { NextPage } from "next";
import Link from "next/link";
import Layout, { BackButton, MockupLoadingProposals, ProposalCard } from "components";
import * as React from "react";
import { useEffect, useState } from "react";
import { IDAOPageForm, IProposalPageForm, IProposalsQuery } from "types";
import { useRouter } from "next/router";

const ProposalsPage: NextPage = () => {
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const router = useRouter();

    useEffect(() => {
        const fetchQuery = () => {
            const query = router.query as IProposalsQuery;

            setDAO(JSON.parse(localStorage.getItem(query.url)));
            setProposals(JSON.parse(localStorage.getItem(query.url + " Proposals")));
        };

        fetchQuery();
    }, [router]);

    return (
        proposals &&
        DAO && (
            <div>
                <Layout className="layout-base">
                    <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                        <BackButton />
                        <div className="text-highlighter items-center flex flex-col md:flex-row">
                            Proposals for
                            <div className={"text-highlighter text-primary capitalize md:ml-4"}>{`${DAO.url}`}</div>
                        </div>

                        {proposals && proposals.length !== 0 ? (
                            <ul className={"mt-4 flex flex-col gap-4"}>
                                {proposals.map((proposal) => {
                                    const proposalId = proposal.proposalId;
                                    return (
                                        <Link href={`../${DAO.url}/proposals/${proposalId}`} key={proposalId}>
                                            <li
                                                key={proposalId}
                                                className="rounded-2xl last:pb-0 bg-base-200 cursor-pointer active:bg-base-300"
                                            >
                                                <ProposalCard
                                                    title={proposal.name}
                                                    description={proposal.description}
                                                    shortDescription={proposal.shortDescription}
                                                    tokenName={proposal.tokenName}
                                                    // governorName={DAO?.name}
                                                    chainId={DAO.chainId}
                                                    isActive={proposal.isActive}
                                                    forVotes={proposal.forVotes}
                                                    againstVotes={proposal.againstVotes}
                                                    deadline={proposal.endDateTimestamp}
                                                />
                                            </li>
                                        </Link>
                                    );
                                })}
                            </ul>
                        ) : (
                            <MockupLoadingProposals chain={DAO.chainId} />
                        )}
                    </section>
                </Layout>
            </div>
        )
    );
};

export default ProposalsPage;
