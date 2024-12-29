import Food_navbar from '@/components/utilities/Food_navbar'
import Head from 'next/head'
import Food_item_page from '@/components/Food_item_page'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { products } from '@/models/product_schema'

const food_item = () => {
    const router = useRouter();
    const [product, set_product] = useState(null);
    useEffect(() => {
        if (router.query.id) {
            const find_product = products.find(e => e._id.toString().includes(router.query.id.toString()))
            set_product(find_product);
        }
    }, [router.query])
    return (
        <>
            <Head>
                <title>Kickskraze | Food</title>
                <meta name="description" content="Food Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Food_navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Food_item_page product={product} />
                </div>
            </div>
        </>
    )
}

export default food_item