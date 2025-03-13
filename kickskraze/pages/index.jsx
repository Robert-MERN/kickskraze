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
        <title>Kickskraze | Home</title>
        <meta property="og:title" content="Kickskraze | Home" />
        <meta property="og:description" content="Home Page" />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="home" />
        <link rel="icon" href="/images/icon.png" />
      </Head>
      <div className='w-screen flex flex-col items-center'>
        <Navbar />
        <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
          <Landing_page axios={axios} />
        </div>
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