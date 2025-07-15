import Head from 'next/head'
import Backup_page from '@/components/Backup_page'

const product = () => {
    return (
        <>
            <Head>
                <title>Kickskraze | Product</title>
                <meta name="description" content="Product Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Backup_page />
            </div>
        </>
    )
}

export default product