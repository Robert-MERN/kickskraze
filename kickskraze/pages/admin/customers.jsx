import Admin_page from '@/components/Admin_page'
import Customers from '@/components/admin_pages/Customers'
import Admin_navbar from '@/components/utilities/Admin_navbar'
import Head from 'next/head'
import axios from 'axios'

export default function Home() {
    return (
        <>
            <Head>
                <title>Kickskraze | Admin</title>
                <meta name="description" content="Admin Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Admin_navbar />
                <div className='w-full mt-[70px]' >
                    <Admin_page admin_children={<Customers axios={axios} />} />
                </div>
            </div>
        </>
    )
}
