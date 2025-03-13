import Link from 'next/link'
import Head from 'next/head'

export default function FourOhFour({ logoUrl, fullUrl }) {
    return (
        <div className={`w-screen h-[95vh] text-stone-700 justify-center flex items-center flex-col gap-16`} >
            <Head>
                <title>Kickskraze | 404</title>
                <meta property="og:title" content="Kickskraze | 404" />
                <meta property="og:description" content="404 Not Found Page. You have entered in the wrong page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="404" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='flex items-center' >

                <h1 className='text-[26px] md:text-[46px] font-bold px-[15px] mr-[15px] md:px-[25px] md:mr-[25px] border-r-2 border-stone-300' >404</h1>
                <p className='text-[13px] md:text-[16px] font-medium' >This page could not be found.</p>
            </div>
            <Link href="/">
                <button className={`text-white text-[14px] md:text-[16px] font-medium px-[13px] md:px-[30px] py-[6px] md:py-[8px] cursor-pointer transition-all bg-black hover:opacity-75 duration-300`}>Go back to home</button>
            </Link>
        </div>
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