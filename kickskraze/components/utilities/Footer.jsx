import React from 'react'
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { IoMailSharp } from "react-icons/io5";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import Link from 'next/link';
import useStateContext from '@/context/ContextProvider';

const Footer = () => {

    const copyright_year = new Date().getFullYear();
    const { set_snackbar_alert } = useStateContext()

    const email_regex = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$"
    const submit_newsletter = (e) => {
        e.preventDefault();
        set_snackbar_alert({
            open: true,
            message: "You've successfully subscribed our Newsletter",
            severity: "success"
        });
        e.target.reset();
    }

    return (
        <div className='w-full bg-[#F7F7F7] flex flex-col items-center mt-8 mb-[70px] lg:mb-0'>
            <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] flex flex-col md:flex-row md:flex-wrap gap-14 md:gap-4  justify-between py-[40px] text-stone-700 lg:px-[60px] px-[20px]  transition-all' >
                <div className='' >
                    <p className='text-[17px] font-bold pb-2' >Get in Touch</p>
                    <ul className='flex flex-col gap-3'>
                        <a href="tel:+923102223511">
                            <li className='cursor-pointer flex items-center gap-3 text-[17px] hover:underline w-fit transition-all'>
                                <IoChatboxEllipsesSharp className='text-[21px] text-stone-800' />
                                Call: 0310 2223 511
                            </li>
                        </a>
                        <a href="mailto:kickskraze@gmail.com">
                            <li className='cursor-pointer flex items-center gap-3 text-[17px] hover:underline w-fit transition-all'>
                                <IoMailSharp className='text-[21px] text-stone-800' />
                                kickskraze@gmail.com
                            </li>
                        </a>
                    </ul>

                </div >

                <div className='' >
                    <p className='text-[17px] font-bold pb-4' >Shop By</p>
                    <ul className='flex flex-col gap-3'>
                        <Link href="/collection">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Collections
                            </li>
                        </Link>

                        <Link href="/collection?category=men">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Men
                            </li>
                        </Link>

                        <Link href="/collection?category=women">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Women
                            </li>
                        </Link>

                        <Link href="/collection?category=kids">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Kids
                            </li>
                        </Link>
                    </ul>
                </div>

                <div className='' >
                    <p className='text-[17px] font-bold pb-4' >Information</p>
                    <ul className='flex flex-col gap-3'>
                        <Link href="/about">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                About
                            </li>
                        </Link>

                        <Link href="contact">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Contact
                            </li>
                        </Link>

                        <Link href="size-chart">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Size Chart
                            </li>
                        </Link>

                        <Link href="/condition-guide">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Condition Guide
                            </li>
                        </Link>
                    </ul>

                </div>

                <div className='' >
                    <p className='text-[17px] font-bold pb-4' >Customer Service</p>
                    <ul className='flex flex-col gap-3'>
                        <Link href="/shipping-policy">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Shipping Policy
                            </li>
                        </Link>

                        <Link href="/return-policy">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Return Policy
                            </li>
                        </Link>

                        <Link href="/terms-conditions">
                            <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                                Terms & Conditions
                            </li>
                        </Link>
                    </ul>

                </div>

                <div className='' >
                    <p className='text-[17px] font-bold pb-4' >Follow Us</p>
                    <div className='flex items-center gap-6 pb-4'>
                        <Link className='' href="https://www.instagram.com/kickskraze.pk?igsh=Z3dvcDk3eXRlN3Z1&utm_source=qr" target='_blank'>
                            <FaSquareInstagram className='text-[26px] text-stone-800 hover:opacity-75 active:opacity-50 transition-all' />
                        </Link>
                        <Link className='' href="https://www.facebook.com/share/152nJBR4YZ/?mibextid=wwXIfr">
                            <FaFacebookF className='text-[26px] text-stone-800 hover:opacity-75 active:opacity-50 transition-all' />
                        </Link>
                    </div>
                    <p className='text-[17px] font-bold pb-4 pt-2'>Newsletter Sign Up</p>
                    <p className='text-[17px] w-fit transition-all pb-4'>
                        Receive our latest updates about our products and promotions.
                    </p>
                    <form onSubmit={submit_newsletter} className='flex flex-col md:flex-row items-center gap-4 md:gap-1'>
                        <input
                            pattern={email_regex}
                            required
                            type="email"
                            className='p-[10px] border-stone-500 border w-full md:w-fit md:flex-[3] text-[17px] outline-none' placeholder='enter your email address'
                        />
                        <button type='submit' className='w-full md:w-fit md:flex-[1] bg-stone-800 text-white text-[17px] p-[10px] font-bold hover:bg-transparent hover:text-stone-800 transition-all border-stone-500 border'>Submit</button>
                    </form>
                </div>



            </div>
            {/* Copyright statement */}
            <div className='w-full pt-[20px] pb-[40px] flex justify-center items-center text-center bg-white' >

                <p className='text-[17px] text-stone-600' >Copyright © {copyright_year} kickskraze.shop All rights reserved.</p>

            </div>
        </div >
    )
}

export default Footer