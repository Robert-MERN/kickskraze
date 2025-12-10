import Landing_page from '@/components/Landing_page'
import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import axios from 'axios'
import Head from 'next/head'

export default function Home({ logoUrl, fullUrl }) {
  return (
    <>
      <Head>
        <title>Kickskraze | Step into Style</title>
        <meta
          property="og:title"
          content="Kickskraze | Footwear, Thrift, Jewellery & Fashion"
        />
        <meta
          property="og:description"
          content="Discover curated new footwear, thrifted shoes, stainless steel jewellery, apparel and accessories — all in one place."
        />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:url" content={fullUrl} />
        <link rel="icon" href="/images/icon.png" />
      </Head>

      <div className='w-screen flex flex-col items-center'>
        <Navbar />
        <Landing_page axios={axios} />
        <App_footer />
        <Footer />
      </div>
    </>
  )
}


export async function getServerSideProps({ req }) {
  const protocol = req.headers["x-forwarded-proto"] || "http"; // Detect HTTP or HTTPS
  const host = req.headers.host; // Get the domain (localhost:3000 or production domain)
  const fullUrl = `${protocol}://${host}${req.url}`; // Fully dynamic URL
  const logoUrl = `${protocol}://${host}/images/og_logo.png`; // Fully dynamic URL

  return {
    props: { fullUrl, logoUrl },
  };
}