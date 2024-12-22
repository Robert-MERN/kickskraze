import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Product_page from '@/components/Product_page'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { products } from '@/models/product_schema'

const product = () => {
    const router = useRouter();
    const [product, set_product] = useState(null);
    useEffect(() => {
        const find_product = products.find(e => e._id.toString().includes(router.query.id.toString()))
        set_product(find_product);
    }, [])
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
                    <Product_page product={product} />
                </div>
                <Footer />
                <App_footer />
            </div>
        </>
    )
}

export default product