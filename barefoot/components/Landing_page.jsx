import React from 'react'
import Image from 'next/image'
import { LuBadgePercent } from "react-icons/lu";
import { PiGift } from "react-icons/pi";
import { GoInbox } from "react-icons/go";
import { MdOutlineVerifiedUser } from "react-icons/md";
import banner from "@/public/images/web_banner.webp"
import banner_2 from "@/public/images/web_banner_2.jpg"
import adidas from "@/public/images/adidas.webp";
import converse from "@/public/images/converse.webp";
import new_balance from "@/public/images/new-balance.webp";
import nike from "@/public/images/nike.webp";
import asics from "@/public/images/asics.webp";
import vans from "@/public/images/vans.webp";
import mid_banner from "@/public/images/home_banner_mid_1.webp"
import mid_banner_2 from "@/public/images/home_banner_mid_2.webp"
import sm_banner_1 from "@/public/images/sm_banner_1.jpg"
import sm_banner_2 from "@/public/images/sm_banner_2.jpg"
import sm_banner_3 from "@/public/images/sm_banner_3.jpg"
// import App_footer from '@/components/utilities/App_footer';
import product_image from "@/public/images/product_image.webp"
import Link from 'next/link';


const Landing_page = () => {


    const top_categories = [
        {
            category: "Adidas",
            src: adidas,
        },
        {
            category: "Nike",
            src: nike,
        },
        {
            category: "Converse",
            src: converse,
        },
        {
            category: "Vans",
            src: vans,
        },
        {
            category: "New Balance",
            src: new_balance,
        },
        {
            category: "Asics",
            src: asics,
        },
    ]





    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] tracking-wider'>
            {/* Offer */}
            <div className='w-full flex flex-col md:flex-row px-[10px] py-[10px] md:py-[25px] h-auto md:h-[100px] bg-[#F9EDE1] justify-between items-center' >
                <div className='w-full border-b md:border-b-0 md:border-r-2 border-stone-300 flex flex-col justify-center items-center pb-2 md:pb-0' >
                    <h2 className='text-[13px] md:text-[24px] font-bold tracking-wider text-stone-800' >FREE SHIPPING OVER 3999*</h2>
                    <p className='text-stone-800 text-[12px] md:text-[17px]' >Plus, four-day delivery on thousands of items.</p>
                </div>
                <div className='w-full flex flex-col justify-center items-center mt-2 md:mt-0' >
                    <h2 className='text-[13px] md:text-[24px]  font-black  tracking-wider text-stone-800' >AMAZING VALUE EVERY DAY</h2>
                    <p className='text-stone-800 text-[12px] md:text-[17px]' >Items you love at prices that fit your budget.</p>
                </div>
            </div>

            {/* Offer 2 */}
            <div className='w-full h-auto md:h-[60px] bg-[#F8F8F8] grid grid-cols-2 md:flex text-[10px]  gap-x-4 gap-y-2 md:gap-0 xl:text-[19px] font-black text-stone-800 tracking-wider py-[12px] md:py-[15px] mt-[15px] px-[10px] md:px-0' >
                <div className='flex gap-2 xl:gap-3 border-b md:border-b-0 md:border-r-2 border-stone-400 w-full md:justify-center items-center px-1 pb-2 md:p-0' >
                    <GoInbox className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >EASY & FREE RETURNS</p>
                </div>
                <div className='flex gap-2 xl:gap-3 border-b md:border-b-0 md:border-r-2 w-full border-stone-400 md:justify-center items-center px-1 pb-2 md:p-0' >
                    <MdOutlineVerifiedUser className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >100% SECURE SHOPPING</p>
                </div>
                <div className='flex gap-2 xl:gap-3 md:border-r-2 w-full border-stone-400 md:justify-center items-center px-1 md:p-0' >
                    <PiGift className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >FREE GIFT WRAPPING</p>
                </div>
                <div className='flex gap-2 xl:gap-3  w-full border-stone-400 md:justify-center items-center px-1 md:p-0' >
                    <LuBadgePercent className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >STUDENT DISCOUNT</p>
                </div>

            </div>


            {/* Banner */}
            <div className='w-full flex justify-center items-center flex-col relative text-center text-white md:text-stone-800 tracking-wider' >
                <div className='absolute text-center' >
                    <p className='w-[300px] md:w-[370px] text-center text-[45px] lg:text-[60px] font-medium leading-[1.1] tracking-wide' >FASHION WITH A CONSCIENCE</p>
                    <p className='text-[17px] my-[30px]' >Shop pre-loved shoes today!</p>
                    <Link href="/collection">
                        <button className='font-extrabold text-[19px] px-[40px] py-[10px] md:bg-transparent hover:bg-teal-600 md:hover:text-white md:text-stone-800 transition-all text-stone-800 hover:text-white bg-white' >Shop Collection</button>
                    </Link>
                </div>
                <Link className='w-full' href="/collection">
                    <Image alt="banner_1" src={banner} className='w-full object-contain  md:block hidden' />
                </Link>
                <Link className='w-full' href="/collection">
                    <Image priority={true} alt="banner_2" src={banner_2} className='w-full object-cover block md:hidden' />
                </Link>


            </div>


            {/* Top Categories For Shoes */}
            <div className='w-full text-stone-900 text-center tracking-wider my-12'>
                <p className='text-[26px] font-medium' >TOP CATEGORIES</p>
                <div className='w-full grid grid-cols-2 md:flex justify-center items-center mt-[30px] gap-5'>
                    {top_categories.map((val, index) => (
                        <Link key={index + val.category} href={`/collection?brand=${val.category}`}>
                            <div className='flex flex-col xl:flex-row items-center rounded-md bg-[#F7F7F7] py-[15px] px-[25px] w-full xl:gap-4 justify-between cursor-pointer  hover:shadow-2xl transition-all duration-300 h-[130px] xl:h-auto active:bg-white active:shadow-none' >
                                <Image src={val.src} alt="shoes" className='w-[70px] object-contain hover:scale-110 transition-all duration-500' />
                                <p className='text-[15px] md:text-[14px] xl:text-[16px] font-bold' >{val.category}</p>
                            </div>
                        </Link>
                    ))
                    }

                </div>
            </div>



            {/* Categories For Genders */}
            <div className='w-full text-stone-900 text-center flex flex-col items-center tracking-wider my-12 gap-4'>
                <p className='text-[20px] md:text-[26px] font-medium' >NEW LIFE FOR OLD SOLES</p>

                <div className='hidden md:flex gap-3 items-center mt-[30px]'>
                    <button className='hover:bg-stone-800 hover:text-white text-[17px] w-[220px] py-[14px] font-semibold bg-transparent text-stone-800 transition-all border border-stone-200 active:opacity-75'>Men</button>
                    <button className='hover:bg-stone-800 hover:text-white text-[17px] w-[220px] py-[14px] font-semibold bg-transparent text-stone-800 transition-all border border-stone-200 active:opacity-75'>Women</button>
                    <button className='hover:bg-stone-800 hover:text-white text-[17px] w-[220px] py-[14px] font-semibold bg-transparent text-stone-800 transition-all border border-stone-200 active:opacity-75'>Kids</button>
                </div>


                {/* Products */}
                <div className='hidden md:grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' >
                    {[...Array(20)].map((_, i) => (
                        <Link href={"/product"} key={i}>
                            <div
                                className={`p-4 flex gap-2 cursor-pointer overflow-hidden flex-col`}
                            >
                                <div className='overflow-hidden shadow-sm'>
                                    <Image alt="Product" src={product_image} className={`w-full hover:scale-[1.1] transition-all duration-500 object-contain`} />
                                </div>
                                <div className='flex flex-col gap-1 items-start'>
                                    <p className='text-[16px] font-bold text-stone-600' >Product {i + 1}</p>
                                    <p className='text-[14px] font-bold text-black mt-2' >Rs. {((i + 1) * 10000).toLocaleString("en-US")}</p>
                                    <p className='text-[14px] text-black' >Size: {"42"}</p>
                                    <p className='text-[14px] text-black' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{"Excelllent"}</span></p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>




                <div className="w-full text-center text-[44px] font-medium bg-contain relative md:hidden">
                    <div className='static' >
                        <Image alt="banner" src={sm_banner_1} className='object-contain w-[calc(100vh-20px)] sm:hidden block' />
                        <Image alt="banner" src={mid_banner} className='object-contain w-[calc(100vh-20px)] hidden sm:block' />
                    </div>

                    <div className='w-full inset-0 absolute flex flex-col justify-center items-center' >
                        <p className='text-white'>MEN</p>
                        <Link href="/collection">
                            <button className='bg-white text-stone-800 text-[15px] px-[30px] py-[8px] font-bold hover:text-stone-800 transition-all border border-stone-200 active:opacity-85'>SHOP NOW</button>
                        </Link>
                    </div>

                </div>

                <p className='text-[20px] font-medium md:hidden' >FIND YOUR SOLE MATE HERE</p>
                <div className="w-full text-center text-[44px] font-medium bg-contain relative md:hidden">
                    <div className='static' >
                        <Image alt="banner" src={sm_banner_2} className='object-contain w-[calc(100vh-20px)] sm:hidden block' />
                        <Image alt="banner" src={mid_banner_2} className='object-contain w-[calc(100vh-20px)] hidden sm:block' />
                    </div>

                    <div className='w-full inset-0 absolute flex flex-col justify-center items-center' >
                        <p className='text-white'>WOMEN</p>
                        <Link href="/collection">
                            <button className='bg-white text-stone-800 text-[15px] px-[30px] py-[8px] font-bold hover:text-stone-800 transition-all border border-stone-200 active:opacity-85'>SHOP NOW</button>
                        </Link>
                    </div>

                </div>

                <p className='text-[20px] font-medium md:hidden' >FROM ONE KID TO ANOTHER KID</p>
                <div className="w-full text-center text-[44px] font-medium bg-contain relative md:hidden">
                    <div className='static ' >
                        <Image alt="banner" src={sm_banner_3} className='object-contain w-[calc(100vh-20px)] sm:hidden block' />
                        <Image alt="banner" src={mid_banner_2} className='object-contain w-[calc(100vh-20px)] hidden sm:block' />
                    </div>

                    <div className='w-full inset-0 absolute flex flex-col justify-center items-center' >
                        <p className='text-white'>KIDS</p>
                        <Link href="/collection">
                            <button className='bg-white text-stone-800 text-[15px] px-[30px] py-[8px] font-bold hover:text-stone-800 transition-all border border-stone-200 active:opacity-85'>SHOP NOW</button>
                        </Link>
                    </div>

                </div>


            </div>


            <div className='w-full hidden md:flex justify-center my-8 tracking-wider'>
                <button className='hover:bg-stone-800 hover:text-white text-[17px] w-[275px] py-[10px] font-black bg-transparent text-stone-800 transition-all border border-stone-500 active:opacity-75'>SHOW MORE</button>
            </div>

            {/* <App_footer /> */}

        </div>
    )
}

export default Landing_page