import '@/styles/globals.css'
import Layout from '@/layout/Layout'
import NextProgress from "nextjs-progressbar";
import { ContextProvider } from '@/context/ContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0); // Scroll to the top of the page
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <div>
      <ContextProvider>
        <NextProgress
          startPosition={0.1}
          stopDelayMs={100}
          height={3}
          color="rgb(225 29 72)"
          options={{ "showSpinner": false, 'easing': 'ease', 'speed': 500 }}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContextProvider>
    </div>
  )
}
