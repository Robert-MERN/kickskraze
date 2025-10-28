import Collection_page from "@/components/Collection_page";
import Head from 'next/head';
import Navbar from '@/components/utilities/Navbar';
import Footer from "@/components/utilities/Footer";
import axios from "axios"
import App_footer from "@/components/utilities/App_footer";


const collection = ({ logoUrl, fullUrl }) => {
    return (
        <>
            <Head>
                <title>Kickskraze | Collection</title>
                <meta property="og:title" content="Kickskraze | Collection" />
                <meta property="og:description" content="Collection Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="collection" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar axios={axios} />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Collection_page axios={axios} />
                </div>
                <App_footer />
                <Footer />
            </div>
        </>
    )
}

export default collection


export async function getServerSideProps({ req }) {
    const protocol = req.headers["x-forwarded-proto"] || "http"; // Detect HTTP or HTTPS
    const host = req.headers.host; // Get the domain (localhost:3000 or production domain)
    const fullUrl = `${protocol}://${host}${req.url}`; // Fully dynamic URL
    const logoUrl = `${protocol}://${host}/images/og_logo.png`; // Fully dynamic URL

    return {
        props: { fullUrl, logoUrl },
    };
}