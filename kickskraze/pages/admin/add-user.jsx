import Admin_page_layout from '@/components/admin_pages/layout/Admin_page_layout'
import Add_user from '@/components/admin_pages/Add_user'
import Admin_navbar from '@/components/utilities/Admin_navbar'
import Head from 'next/head'
import axios from 'axios'
import { get_cookie } from '@/utils/functions/cookie'
import jwt from "jsonwebtoken";


export default function Home({ fullUrl, logoUrl }) {
    return (
        <>
            <Head>
                <title>Kickskraze | Admin | Add User</title>
                <meta property="og:title" content="Kickskraze | Admin | Add User" />
                <meta property="og:description" content="Admin / Add User Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="admin - add user" />
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

    const protocol = req.headers["x-forwarded-proto"] || "http"; // Detect HTTP or HTTPS
    const host = req.headers.host; // Get the domain (localhost:3000 or production domain)
    const fullUrl = `${protocol}://${host}${req.url}`; // Fully dynamic URL
    const logoUrl = `${protocol}://${host}/images/og_logo.png`; // Fully dynamic URL

    if (user_account_token) {
        const user = jwt.verify(user_account_token, process.env.JWT_KEY);
        return { props: { user, fullUrl, logoUrl } }
    }


    return {
        redirect: {
            destination: "/login",
            permanent: true,
        },
    }
}