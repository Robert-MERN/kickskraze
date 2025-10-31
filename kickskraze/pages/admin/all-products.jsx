import Admin_page_layout from '@/components/admin_pages/layout/Admin_page_layout'
import All_products from '@/components/admin_pages/All_products'
import Admin_navbar from '@/components/utilities/Admin_navbar'
import Head from 'next/head'
import axios from 'axios'
import { get_cookie } from '@/utils/functions/cookie'
import jwt from "jsonwebtoken";
import Users from '@/models/user_model'
import connect_mongo from '@/utils/functions/connect_mongo'
import { useEffect } from 'react'
import useStateContext from '@/context/ContextProvider'


export default function Home({ fullUrl, logoUrl, user }) {
    const { set_user } = useStateContext();
    // setting user in context
    useEffect(() => {
        if (user) {
            set_user(user);
        }
    }, [user]);

    return (
        <>
            <Head>
                <title>Kickskraze | Admin | All Products</title>
                <meta property="og:title" content="Kickskraze | Admin | All Products" />
                <meta property="og:description" content="Admin / All Products Page" />
                <meta property="og:image" content={logoUrl} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="admin - all products" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Admin_navbar />
                <div className='w-full mt-[70px]' >
                    <Admin_page_layout admin_children={<All_products axios={axios} />} />
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

        console.log("Connecting with DB")
        try {
            // connecting with monogDB
            await connect_mongo();
            console.log("Successfuly conneted with DB");

            const user = jwt.verify(user_account_token, process.env.JWT_KEY);
            const user_db = await Users.findOne({ email: user.email });

            if (user.password_update_count !== user_db.password_update_count) {
                return {
                    redirect: {
                        destination: "/login",
                        permanent: true,
                    },
                }
            }
            return { props: { user, fullUrl, logoUrl } }

        } catch (err) {
            console.error(err);
            return {
                redirect: {
                    destination: "/login",
                    permanent: true,
                },
            }
        }


    }


    return {
        redirect: {
            destination: "/login",
            permanent: true,
        },
    }
}