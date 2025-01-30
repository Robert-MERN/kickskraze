import '@/styles/globals.css'
import Layout from '@/layout/Layout'
import NextProgress from "nextjs-progressbar";
import { ContextProvider } from '@/context/ContextProvider';


export default function App({ Component, pageProps }) {

  return (
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
  )
}
