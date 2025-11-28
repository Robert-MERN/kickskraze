import '@/styles/globals.css'
import Layout from '@/layout/Layout'
import NextProgress from "nextjs-progressbar";
import { ContextProvider } from '@/context/ContextProvider';
import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { MetaPixel } from '@/lib/fpixel';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!url.includes("/admin") && !url.includes("/login") && !url.includes("/404")) {
        MetaPixel.pageView()
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (

    <>
      {/* Meta Pixel Script */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: (!router.pathname.includes("/admin") && !router.pathname.includes("/login") && !router.pathname.includes("/404")) ?
            `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
             
            // Initialize first pixel
         
            fbq('init', ${process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_1});
            fbq('track', 'PageView');
            
            // Initialize second pixel
            fbq('init', ${process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT});
            fbq('track', 'PageView');`
            : ``,
        }}
      />
      {(!router.pathname.includes("/admin") && !router.pathname.includes("/login") && !router.pathname.includes("/404")) &&
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_1}&ev=PageView&noscript=1`}
          />
          <img height="1" width="1" style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT}&ev=PageView&noscript=1`}
          />
        </noscript>
      }

      <div id=''>
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
    </>
  )
}
