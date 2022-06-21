import * as React from 'react';
import { Connector, useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';
import { Dialog, DialogHeading, DisclosureState } from 'ariakit';

// OWN
import { useIsMounted } from '../../hooks';
import { WalletProfile } from './WalletProfile';
interface Props {
  dialog: DisclosureState;
}

export const WalletSelector = ({ dialog }: Props) => {
  const { data: account } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  const isMounted = useIsMounted();
  
  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      await connect(connector);
      dialog.toggle();
    },
    [connect, dialog]
  );
  
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_SAFE === 'true' && typeof window !== 'undefined') {
      connect(connectors[0]);
    }
  }, [connect, connectors]);

  return (
    // Display Connected Wallet 
    <Dialog state={dialog} className="dialog">
      {account ? (
        <>
          <DialogHeading className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
            <span> Account </span>
            
            <button
              className="absolute top-[18px] right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
              onClick={dialog.toggle}
            >
              <span className="sr-only">Close</span>
            </button>
          </DialogHeading>
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-sm font-thin"> Connected to {account.connector?.name}</p>
            <p className="flex items-center gap-4 break-words">
              <div>
                {ensName ? `${ensName} (${account.address})` : account.address}
              </div>
            </p>
            <button
              className="nav-button mt-5 dark:border-[#1BDBAD] dark:bg-[#23BD8F] dark:text-white"
              onClick={() => {
                disconnect();
                dialog.toggle();
              }}
            >
              Disconnect
            </button>
          </div>
        </>
      ) : 
      // Connect Wallet
      (
        <>
          <DialogHeading className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
            <span>Connect Wallet</span>
            <button
              className="absolute top-[18px] right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
              onClick={dialog.toggle}
            >
              <span className="sr-only">Close</span>
            </button>
          </DialogHeading>
          {/* choose profile */}
          <WalletProfile/> 
        </>
      )}
    </Dialog>
  );
};