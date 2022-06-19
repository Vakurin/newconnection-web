import { useRouter } from 'next/router';
import * as React from 'react';
import { networkDetails } from '../utils/constants';
import { useNetwork } from 'wagmi';

export const useChainExplorer = () => {
  const network = useNetwork()
  const { pathname, query } = useRouter();

  const { name, url } = React.useMemo(() => {
    if (pathname === '/streams' && !Number.isNaN(query.chainId)) {
      const details = networkDetails[Number(query.chainId)];

      return details
        ? { name: details.blockExplorerName, url: details.blockExplorerURL?.slice(0, -1) ?? null }
        : { name: null, url: null };
    }

    if (pathname === '/salaries/[chain]/[address]' || pathname === '/vesting/[chain]/[address]') {
      const chainParam = query.chain;

      const isParamChainId = Number.isNaN(Number(chainParam));

      let chain = null;

      // handle routes like /salaries/ethereum/0x1234... & /salaries/1/0x1234
      // if (isParamChainId) {
      //   chain = typeof chainParam === 'string';
      // } else {
      //   chain = typeof chainParam === 'string';
      // }

      // const details = chain && networkDetails[chain.id];
      const details = {name: null, url: null}
      // return details
      //   ? { name: details.blockExplorerName, url: details.blockExplorerURL?.slice(0, -1) ?? null }
      //   : { name: null, url: null };
      return details
    }

    const explorers = network?.data?.blockExplorers;

    return { name: explorers ? explorers[0]?.name ?? null : null, url: explorers ? explorers[0]?.url ?? null : null };
  }, [network, pathname, query]);

  return { name, url };
};