import Admin_page_layout from '@/components/admin_pages/layout/Admin_page_layout'
import Update_produtct from '@/components/admin_pages/Update_produtct'
import Admin_navbar from '@/components/utilities/Admin_navbar'
import Head from 'next/head'
import axios from 'axios'
import { get_cookie } from '@/utils/functions/cookie'
import jwt from "jsonwebtoken";



export default function Home() {
    return (
        <>
            <Head>
                <title>Kickskraze | Admin | Update Product</title>
                <meta name="description" content="Admin / Update Product Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Admin_navbar />
                <div className='w-full mt-[70px]' >
                    <Admin_page_layout admin_children={<Update_produtct axios={axios} />} />
                </div>
            </div>
        </>
    )
}


export const getServerSideProps = async ({ req, res }) => {


    // validating user from cookie
    const user_account_token = get_cookie("user_account_token", { req });

    if (user_account_token) {
        const user = jwt.verify(user_account_token, process.env.JWT_KEY);
        return { props: { user } }
    }


    return {
        redirect: {
            destination: "/login",
            permanent: true,
        },
    }
}
