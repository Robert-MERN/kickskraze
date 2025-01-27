import React from 'react'
import Login_page from '@/components/Login_page'
import Head from 'next/head'
import axios from 'axios'
import { get_cookie } from '@/utils/functions/cookie';


const login = () => {
    return (
        <div className={`w-screen bg-slate-100 lg:bg-[#1F2822] h-fit relative`} >
            <Head>
                <title>KicksKraze - Login</title>
                <meta name="description" content="Pizza Buddies - Login Page" />
                <link rel="icon" href="/images/logo.png" />
            </Head>
            <Login_page axios={axios} />
        </div>
    )
}

export default login


export const getServerSideProps = async ({ req, res }) => {

    const user_account_token = get_cookie("user_account_token", { req });

    if (user_account_token) {
        return {
            redirect: {
                destination: "/admin",
                permanent: true,
            }
        }
    }

    return { props: { message: "Not signed in" } }
}