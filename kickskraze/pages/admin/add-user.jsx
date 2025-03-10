import Admin_page_layout from '@/components/admin_pages/layout/Admin_page_layout'
import Add_user from '@/components/admin_pages/Add_user'
import Admin_navbar from '@/components/utilities/Admin_navbar'
import Head from 'next/head'
import axios from 'axios'
import { get_cookie } from '@/utils/functions/cookie'
import jwt from "jsonwebtoken";


export default function Home() {
    return (
        <>
            <Head>
                <title>Kickskraze | Admin | Add User</title>
                <meta name="description" content="Admin / Add User Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Admin_navbar />
                <div className='w-full mt-[70px]' >
                    <Admin_page_layout admin_children={<Add_user axios={axios} />} />
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