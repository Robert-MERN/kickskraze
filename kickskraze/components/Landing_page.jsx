import React, { useEffect, useState } from 'react'
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
import Link from 'next/link';
import useStateContext from '@/context/ContextProvider';
import { CircularProgress, Skeleton } from '@mui/material';
import { Fade } from 'react-reveal';
import { calculate_discount_precentage, calculate_product_stock, select_thumbnail_from_media } from '@/utils/functions/produc_fn';
import { convert_to_query_string } from '@/utils/functions/filter_function';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { IoBagCheckOutline } from "react-icons/io5";
import { BsCash } from "react-icons/bs";



const Landing_page = ({ axios }) => {


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
            category: "ASICS",
            src: asics,
        },
    ]

    const {
        get_all_products_api,
        fetched_products_for_landing: products,
        set_fetched_products_for_landing: set_products,
        products_for_landing_loading: is_loading,
        set_products_for_landing_loading: set_is_loading,
    } = useStateContext();


    const [show_more_loading, set_show_more_loading] = useState(false);
    const [query, set_query] = useState("");
    const [is_action_loading, set_is_action_loading] = useState(false);


    const [show_more_payload, set_show_more_payload] = useState({
        limit: 50,
        page: 1,
        hasMore: false,
        count: 0,
    });

    useEffect(() => {
        if (!products.length) {
            get_all_products_api(axios, "", set_products, set_show_more_payload, set_is_loading);
        }
    }, []);

    const category_change_btn = (category) => {
        set_query(category);
        get_all_products_api(axios, `category=${category}`, set_products, set_show_more_payload, set_is_action_loading);
    };

    const show_more_payload_func = () => {
        set_show_more_payload(prev => ({ ...prev, page: prev.page + 1 }));
    };

    useEffect(() => {
        const { page, limit } = show_more_payload;
        if (page > 1) {
            get_all_products_api(axios, `category=${query}`, set_products, set_show_more_payload, set_show_more_loading, convert_to_query_string([{ page }, { limit }]));
        }
    }, [show_more_payload.page]);





    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] '>
            {/* Offer */}
            <div className='w-full flex flex-col md:flex-row px-[10px] py-[10px] md:py-[25px] h-auto md:h-[100px] bg-[#F9EDE1] justify-between items-center' >
                <div className='w-full border-b md:border-b-0 md:border-r-2 border-stone-300 flex flex-col justify-center items-center pb-2 md:pb-0' >
                    <h2 className='text-[13px] md:text-[24px] font-bold  text-stone-800' >100% AUTHENTIC IMPORTED THRIFTED SHOES*</h2>
                    <p className='text-stone-800 text-[12px] md:text-[17px]' >Plus, four-day delivery on thousands of items.</p>
                </div>
                <div className='w-full flex flex-col justify-center items-center mt-2 md:mt-0' >
                    <h2 className='text-[13px] md:text-[24px]  font-bold   text-stone-800' >AMAZING VALUE EVERY DAY</h2>
                    <p className='text-stone-800 text-[12px] md:text-[17px]' >Items you love at prices that fit your budget.</p>
                </div>
            </div>

            {/* Offer 2 */}
            <div className='w-full h-auto md:h-[60px] bg-[#F8F8F8] grid grid-cols-2 md:flex text-[10px]  gap-x-4 gap-y-2 md:gap-0 xl:text-[19px] font-bold text-stone-800  py-[12px] md:py-[15px] mt-[15px] px-[10px] md:px-0' >
                <div className='flex gap-2 xl:gap-3 border-b md:border-b-0 md:border-r-2 border-stone-400 w-full md:justify-center items-center px-1 pb-2 md:p-0' >
                    <PublishedWithChangesIcon className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >EASY EXCHANGE</p>
                </div>
                <div className='flex gap-2 xl:gap-3 border-b md:border-b-0 md:border-r-2 w-full border-stone-400 md:justify-center items-center px-1 pb-2 md:p-0' >
                    <MdOutlineVerifiedUser className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >100% SECURE SHOPPING</p>
                </div>
                <div className='flex gap-2 xl:gap-3 md:border-r-2 w-full border-stone-400 md:justify-center items-center px-1 md:p-0' >
                    <IoBagCheckOutline className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >INSPECTED BEFORE DISPATCH</p>
                </div>
                <div className='flex gap-2 xl:gap-3  w-full border-stone-400 md:justify-center items-center px-1 md:p-0' >
                    <BsCash className='text-[16px] xl:text-[26px] text-stone-800' />
                    <p className='' >CASH ON DELIVERY</p>
                </div>

            </div>


            {/* Banner */}
            <div className='w-full flex justify-center items-center flex-col relative text-center text-white md:text-stone-800 ' >
                <div className='absolute text-center' >
                    <p className='w-[300px] md:w-[370px] text-center text-[45px] lg:text-[60px] font-medium leading-[1.1] ' >FASHION WITH A CONSCIENCE</p>
                    <p className='text-[17px] my-[30px]' >Shop pre-loved shoes today!</p>
                    <Link href="/collection">
                        <button className='font-bold text-[19px] px-[40px] py-[10px] md:bg-transparent hover:bg-teal-600 md:hover:text-white md:text-stone-800 transition-all text-stone-800 hover:text-white bg-white' >Shop Collection</button>
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
            <div className='w-full text-stone-900 text-center  my-12'>
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



            <div className='w-full text-stone-900 text-center flex flex-col items-center  my-12 gap-4'>

                {is_loading ?
                    <Fade>
                        <div className='w-full flex justify-center'>
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 w-[30%] h-[20px] md:h-[26px]'
                            />
                        </div>

                        <div className='hidden md:flex gap-3 items-center mt-[30px]'>
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 h-[45px] w-[220px]'
                            />
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 h-[45px] w-[220px]'
                            />
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 h-[45px] w-[220px]'
                            />
                        </div>
                    </Fade>
                    :
                    <>
                        <p className='text-[20px] md:text-[26px] font-medium hidden md:block' >NEW LIFE FOR OLD SOLES</p>
                        {/* Categories For Genders */}
                        <div className='hidden md:flex gap-3 items-center mt-[30px]'>
                            <button
                                onClick={() => category_change_btn("men")}
                                className={`text-[17px] w-[220px] py-[14px] font-semibold transition-all border border-stone-200 active:opacity-75 ${query === ("men") ? "bg-stone-800 text-white" : "bg-transparent text-stone-800 hover:bg-stone-800 hover:text-white"}`}
                            >
                                Men
                            </button>
                            <button
                                onClick={() => category_change_btn("women")}
                                className={`text-[17px] w-[220px] py-[14px] font-semibold transition-all border border-stone-200 active:opacity-75 ${query === ("women") ? "bg-stone-800 text-white" : "bg-transparent text-stone-800 hover:bg-stone-800 hover:text-white"}`}
                            >
                                Women
                            </button>
                            <button
                                onClick={() => category_change_btn("kids")}
                                className={`text-[17px] w-[220px] py-[14px] font-semibold transition-all border border-stone-200 active:opacity-75 ${query === ("kids") ? "bg-stone-800 text-white" : "bg-transparent text-stone-800 hover:bg-stone-800 hover:text-white"}`}
                            >
                                Kids
                            </button>
                        </div>
                    </>
                }

                {/* Products */}
                {is_loading || is_action_loading ?
                    <>

                        <Fade>
                            <div className='hidden md:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full' >
                                {[...Array(15)].map((_, i) => (
                                    <Fade key={i}>
                                        <div className={`p-2 md:p-4 flex gap-2 flex-col`}>
                                            <Skeleton
                                                variant='rounded'
                                                animation="wave"
                                                className={`w-full h-[450px] sm:h-[500px] md:h-[450px] lg:h-[330px] xl:h-[320px] cursor-progress`}
                                            />
                                            <div>
                                                <Skeleton
                                                    variant='text'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[140px] md:w-[160px]'
                                                />
                                                <div className='mt-4 flex flex-col gap-1' >
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[90px] md:w-[100px] h-[14px]'
                                                    />
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[70px] md:w-[80px] h-[14px]'
                                                    />
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[120px] md:w-[140px] h-[14px]'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Fade>
                                ))}
                            </div>
                        </Fade>
                    </>
                    : Boolean(products.length) ?
                        <>

                            <div className='hidden md:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 text-left w-ful' >
                                {products.map((product) => (
                                    <Fade key={product._id} >
                                        <Link href={`/product?product_id=${product._id}`} >
                                            <div
                                                className={`p-2 md:p-4 flex flex-col gap-2 cursor-pointer`}
                                            >
                                                <div className='relative'>
                                                    <div className={`"w-full overflow-hidden shadow-sm relative`}>

                                                        <img
                                                            alt="Product"
                                                            src={select_thumbnail_from_media(product.media)}
                                                            className={`w-full h-[450px] sm:h-[500px] md:h-[450px] lg:h-[330px] xl:h-[320px] lg:hover:scale-[1.1] object-cover transition-all duration-500`}
                                                            onError={(e) => e.target.src = "/images/logo_error.png"}
                                                        />

                                                        {calculate_product_stock(product) === 0 &&
                                                            <span className='absolute inset-0 text-center w-full h-full bg-[rgba(0,0,0,.6)] flex justify-center items-center text-gray-200 font-bold text-[17px]'>
                                                                SOLD OUT
                                                            </span>
                                                        }
                                                    </div>

                                                    {Boolean(calculate_discount_precentage(product.price, product.compare_price)) &&
                                                        <p className='w-[45px] h-[45px] text-center text-[13px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-23px] right-[2px] z-[10]' >
                                                            {`-${calculate_discount_precentage(product.price, product.compare_price)}%`}
                                                        </p>
                                                    }
                                                </div>


                                                <div className='flex flex-col gap-1'>
                                                    <p className='text-[16px] font-bold text-stone-600 line-clamp-1 overflow-hidden text-ellipsis' >{product.title}</p>
                                                    <p className='mt-2 line-clamp-1 overflow-hidden text-ellipsis' >
                                                        <span className='text-[15px] font-bold text-black'>
                                                            Rs. {product.price.toLocaleString("en-US")}
                                                        </span>
                                                        {" "}
                                                        {Boolean(product.compare_price) &&
                                                            <span className='text-[13px] line-through text-red-600'>
                                                                Rs. {product.compare_price.toLocaleString("en-US")}
                                                            </span>
                                                        }
                                                    </p>
                                                    {!product.has_variants &&
                                                        <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                                                    }
                                                    {product.condition !== "brand new" &&
                                                        <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                    </Fade>
                                ))}
                            </div>

                            {(show_more_payload.hasMore && !is_loading) &&
                                <Fade>

                                    <div className='w-full hidden md:flex justify-center my-8 '>
                                        <button
                                            onClick={show_more_payload_func}
                                            disabled={!show_more_payload.hasMore && is_loading && show_more_loading}
                                            className='hover:bg-stone-800 hover:text-white text-[17px] w-[275px] py-[10px] font-bold bg-transparent text-stone-800 transition-all border border-stone-500 active:opacity-75'
                                        >
                                            {show_more_loading ?
                                                <CircularProgress size={17} color='inherit' />
                                                :
                                                "Show More"}
                                        </button>
                                    </div>
                                </Fade>
                            }
                        </>
                        :
                        <></>
                }



                <h1 className='text-[20px] md:text-[26px] font-medium md:hidden' >NEW LIFE FOR OLD SOLES</h1>

                <div className="w-full text-center text-[44px] font-medium bg-contain relative md:hidden">
                    <div className='static' >
                        <Image alt="banner" style={{ width: "auto" }} src={sm_banner_1} className='object-contain w-[calc(100vh-20px)] sm:hidden block' />
                        <Image alt="banner" style={{ width: "auto" }} src={mid_banner} className='object-contain w-[calc(100vh-20px)] hidden sm:block' />
                    </div>

                    <div className='w-full inset-0 absolute flex flex-col justify-center items-center' >
                        <p className='text-white'>MEN</p>
                        <Link href="/collection?category=men">
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
                        <Link href="/collection?category=women">
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
                        <Link href="/collection?category=kids">
                            <button className='bg-white text-stone-800 text-[15px] px-[30px] py-[8px] font-bold hover:text-stone-800 transition-all border border-stone-200 active:opacity-85'>SHOP NOW</button>
                        </Link>
                    </div>

                </div>


            </div>




            {/* <App_footer /> */}

        </div>
    )
}

export default Landing_page