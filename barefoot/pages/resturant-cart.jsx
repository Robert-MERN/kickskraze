import Resturant_cart_page from '@/components/Resturant_cart_page'
import Food_navbar from '@/components/utilities/Food_navbar'
import Head from 'next/head'

// filter.v.option.size=42&filter.v.option.condition=Average&filter.p.vendor=Hugo+Boss&filter.v.price.gte=&filter.v.price.lte=&sort_by=created-descending

export default function Home() {
    return (
        <>
            <Head>
                <title>Pizza Buddies | Cart</title>
                <meta name="description" content="Cart Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Food_navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Resturant_cart_page />
                </div>
            </div>
        </>
    )
}
