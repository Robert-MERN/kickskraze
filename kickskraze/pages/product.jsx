import App_footer from '@/components/utilities/App_footer'
import Footer from '@/components/utilities/Footer'
import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Product_page from '@/components/Product_page'
import axios from 'axios'
import Products from '@/models/product_model'
import connect_mongo from '@/utils/functions/connect_mongo'
import { select_thumbnail_from_media } from '@/utils/functions/product_fn'

const product = ({ fullUrl, ogImage }) => {
    return (
        <>
            <Head>
                <title>Kickskraze | Product</title>
                <meta property="og:title" content="Kickskraze | Product" />
                <meta property="og:description" content="Shop authentic footwear at Kickskraze" />
                <meta property="og:image" content={ogImage} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="product" />

                {/* For WhatsApp / iMessage */}
                <meta name="twitter:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />

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


export async function getServerSideProps({ req, query }) {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const fullUrl = `${protocol}://${host}${req.url}`;

    // 🔥 FETCH PRODUCT IMAGE FOR OG TAGS
    await connect_mongo();
    const product = await Products.findById(query.product_id).lean();

    // Fallback placeholder if no product found or no media
    const ogImage = select_thumbnail_from_media(product.media)
        || `${protocol}://${host}/images/og_logo.png`;

    return {
        props: { fullUrl, ogImage },
    };
}