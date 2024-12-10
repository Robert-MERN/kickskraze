import React from 'react'
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { IoMailSharp } from "react-icons/io5";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {

    const copyright_year = new Date().getFullYear();

    return (
        <div className='w-full bg-[#F7F7F7] flex flex-col items-center mt-8 mb-[70px] lg:mb-0'>
            <div className='w-full 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] flex flex-col md:flex-row md:flex-wrap gap-14 md:gap-4  justify-between py-[40px] text-stone-700 lg:px-[60px] px-[20px] tracking-wider transition-all' >
                <div className='' >
                    <p className='text-[17px] font-black pb-2' >Get in Touch</p>
                    <ul className='flex flex-col gap-3'>
                        <li className='cursor-pointer flex items-center gap-3 text-[17px] hover:underline w-fit transition-all'>
                            <IoChatboxEllipsesSharp className='text-[21px] text-stone-800' />
                            Call: 0310 2223 511
                        </li>
                        <li className='cursor-pointer flex items-center gap-3 text-[17px] hover:underline w-fit transition-all'>
                            <IoMailSharp className='text-[21px] text-stone-800' />
                            kickskraze@gmail.com
                        </li>
                    </ul>

                </div >

                <div className='' >
                    <p className='text-[17px] font-black pb-4' >Shop By</p>
                    <ul className='flex flex-col gap-3'>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Collections
                        </li>

                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Men
                        </li>

                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Women
                        </li>

                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Kids
                        </li>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Exclusive
                        </li>
                    </ul>
                </div>

                <div className='' >
                    <p className='text-[17px] font-black pb-4' >Information</p>
                    <ul className='flex flex-col gap-3'>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            About
                        </li>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Contact
                        </li>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Size Chart
                        </li>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Condition Guide
                        </li>
                    </ul>

                </div>

                <div className='' >
                    <p className='text-[17px] font-black pb-4' >Customer Service</p>
                    <ul className='flex flex-col gap-3'>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Shipping Policy
                        </li>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Return Policy
                        </li>
                        <li className='cursor-pointer text-[17px] hover:underline w-fit transition-all'>
                            Terms & Conditions
                        </li>
                    </ul>

                </div>

                <div className='' >
                    <p className='text-[17px] font-black pb-4' >Follow Us</p>
                    <div className='flex items-center gap-6 pb-4'>
                        <button className=''>
                            <FaSquareInstagram className='text-[26px] text-stone-800 hover:opacity-75 active:opacity-50 transition-all' />
                        </button>
                        <button className=''>
                            <FaFacebookF className='text-[26px] text-stone-800 hover:opacity-75 active:opacity-50 transition-all' />
                        </button>
                    </div>
                    <p className='text-[17px] font-black pb-4 pt-2'>Newsletter Sign Up</p>
                    <p className='text-[17px] w-fit transition-all pb-4'>
                        Receive our latest updates about our products and promotions.
                    </p>
                    <div className='flex items-center gap-1'>
                        <input type="text" className='p-[10px] border-stone-500 border flex-[3] text-[17px] outline-none' placeholder='enter your email address' />
                        <button className='flex-[1] bg-stone-800 text-white text-[17px] p-[10px] font-black hover:bg-transparent hover:text-stone-800 transition-all border-stone-500 border'>Submit</button>
                    </div>
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