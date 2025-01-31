import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Product_page from '@/components/Product_page'
import axios from 'axios'

const product = () => {
    return (
        <>
            <Head>
                <title>Kickskraze | Product</title>
                <meta name="description" content="Product Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Product_page axios={axios} />
                </div>
                <App_footer />
                <Footer />
            </div>
        </>
    )
}

export default product