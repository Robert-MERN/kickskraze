import Cart_page from '@/components/Cart_page'
import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'

export default function Home() {
    return (
        <>
            <Head>
                <title>Kickskraze | Cart</title>
                <meta name="description" content="Cart Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Cart_page />
                </div>
                <Footer />
                <App_footer />
            </div>
        </>
    )
}
