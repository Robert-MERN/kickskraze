import Backup_page from "@/components/Backup_page";
import Head from 'next/head';

const collection = () => {
    return (
        <>
            <Head>
                <title>Kickskraze | Backup</title>
                <meta name="description" content="Collection Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <div className='w-full min-h-[calc(100vh-70px)] xl:w-[1300px] lg:w-[1100px] lg:px-[40px]' >
                    <Backup_page />
                </div>
            </div>
        </>
    )
}

export default collection