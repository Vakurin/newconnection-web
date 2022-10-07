import * as React from "react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import { Dialog, DisclosureState } from "ariakit";
import { useIsMounted } from "hooks";
import { formatAddress } from "utils";
import { DialogHeader } from "components";
import ASSETS from "assets/index";

interface Props {
    dialog: DisclosureState;
}

export const WalletSelector = ({ dialog }: Props) => {
    const { address, connector, isConnected } = useAccount();
    const ensName = null;
    // const { data: ensName } = useEnsName({ address: address });

    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();

    const isMounted = useIsMounted();

    const imageID = {
        MetaMask: ASSETS.metamask,
        WalletConnect: ASSETS.walletConnect,
    };

    const handleConnect = React.useCallback(
        async (x: Connector) => {
            await connect({ connector: x });
            dialog.toggle();
        },
        [connect, dialog]
    );

    const handlerDisconect = React.useCallback(async () => {
        await disconnect();
        dialog.toggle();
    }, [disconnect, dialog]);

    React.useEffect(() => {
        if (process.env.NEXT_PUBLIC_SAFE === "true" && typeof window !== "undefined") {
            connect({ connector: connectors[0] });
            console.log(connectors[0]);
        }
    }, [connect, connectors]);

    const formattedAddress = address && formatAddress(address);
    return (
        // Display Connected Wallet
        <Dialog state={dialog} className="dialog" hideOnInteractOutside={false} hideOnEscape={false}>
            {isMounted && isConnected ? (
                <div className={"p-5"}>
                    <DialogHeader title="Account" dialog={dialog} />
                    <div className="mt-3 flex flex-col gap-2">
                        <p className="text-sm text-gray2 font-light">Connected to {connector?.name}</p>
                        <p className="flex items-center gap-4 break-words text-gray2">
                            {ensName ? `${ensName} (${formattedAddress})` : address}
                        </p>
                        <button className="nav-button mt-5 items-center" onClick={() => handlerDisconect()}>
                            Disconnect
                        </button>
                    </div>
                </div>
            ) : (
                // Connect Wallet
                <div className={"p-5"}>
                    <DialogHeader title="Connect Wallet" dialog={dialog} />
                    {/* choose profile: metamask, wallet connect  */}
                    <div className="mt-4 flex flex-col gap-4">
                        {connectors.map((x) => (
                            <button
                                key={x?.id}
                                onClick={() => {
                                    handleConnect(x).then();
                                }}
                                className="flex gap-4 btn-connect-wallets text-purple justify-center pr-12 rounded-full"
                            >
                                <img alt={"wallet"} src={imageID[x.name]["src"]} className="w-8 h-8" />
                                {x?.name}
                                {isLoading && x.id === pendingConnector?.id && " (connecting)"}
                            </button>
                        ))}
                        {error && <div>{error.message}</div>}
                    </div>
                </div>
            )}
        </Dialog>
    );
};
