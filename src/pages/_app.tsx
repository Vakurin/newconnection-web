import React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { WagmiConfig } from "wagmi";
import "styles/globals.css";
import { CustomToast, WagmiClient } from "components";
import Script from "next/script";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <Script strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>

            <ThemeProvider defaultTheme="system" attribute="class">
                <WagmiConfig client={WagmiClient}>
                    <QueryClientProvider client={queryClient}>
                        <Component {...pageProps} />
                    </QueryClientProvider>
                </WagmiConfig>
            </ThemeProvider>
            <CustomToast />
        </>
    );
}

export default App;
