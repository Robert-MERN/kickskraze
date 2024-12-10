import React from 'react'
import Backup_page from "@/components/Backup_page";
import Head from 'next/head';


const collection = () => {
    return (
        <>
            <Head>

            </Head>
            <div className='w-screen flex flex-col items-center'>

                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Backup_page />
                </div>
            </div>
        </>
    )
}

export default collection