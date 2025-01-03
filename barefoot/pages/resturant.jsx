import Cart_page from '@/components/Cart_page';
import App_footer from '@/components/utilities/App_footer';
import Footer from '@/components/utilities/Footer';
import Food_navbar from '@/components/utilities/Food_navbar';
import Head from 'next/head';
import Resturant_page from '@/components/Resturant_page';

// filter.v.option.size=42&filter.v.option.condition=Average&filter.p.vendor=Hugo+Boss&filter.v.price.gte=&filter.v.price.lte=&sort_by=created-descending

export default function Home() {
    return (
        <>
            <Head>
                <title>Pizza Buddies | Home</title>
                <meta name="description" content="Home Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Food_navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]'>
                    <Resturant_page />
                </div>
            </div>
        </>
    )
}
