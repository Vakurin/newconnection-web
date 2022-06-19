import Head from 'next/head';
import * as React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
// import '../../index.css';

import Hero from '../Hero';
// import OnboardDialog from 'components/Onboard';
import Header from './Header';
import CustomToast from '../CustomToast';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
  noBanner?: boolean;
}

export default function Layout({ children, className, noBanner = false, ...props }: ILayoutProps) {
  
  const onboardDialog = useDialogState();

  const Loading = () =>  {
    toast.success('I Love U');
  }

  return (
    <>
      {/* <button onClick={Loading}>SONYA, CLICK PLEASE</button> */}
      <Header/>
      {/* {router.pathname === '/' && <Hero noBanner={noBanner} onboardDialog={onboardDialog} />}

      <main className={classNames('flex-1', className)} {...props}>
        {children}
      </main> */}
      {/* <OnboardDialog dialog={onboardDialog} /> */}
      <CustomToast />
    </>
  );
}