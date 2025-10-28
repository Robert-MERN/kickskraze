import Link from 'next/link'
import Head from 'next/head'

export default function FourOhFour() {
    return (
        <div className={`w-screen h-[95vh] text-stone-700 justify-center flex items-center flex-col gap-16`} >
            <Head>
                <title>Kickskraze | 404</title>
                <meta property="og:title" content="Kickskraze | 404" />
                <meta property="og:description" content="404 Not Found Page. You have entered in the wrong page" />
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

