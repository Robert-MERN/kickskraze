import Collection_page from "@/components/Collection_page";
import Head from 'next/head';
import Navbar from '@/components/utilities/Navbar';
import Footer from "@/components/utilities/Footer";
import axios from "axios"


const collection = () => {
    return (
        <>
            <Head>
                <title>Kickskraze | Collection</title>
                <meta name="description" content="Collection Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Collection_page axios={axios} />
                </div>
                <Footer />
            </div>
        </>
    )
}

export default collection