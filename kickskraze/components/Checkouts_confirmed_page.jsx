import React, { useEffect, useState } from 'react'
import Badge from "@mui/material/Badge";
import CheckIcon from '@mui/icons-material/Check';
import { Skeleton } from '@mui/material';
import mongoose from 'mongoose';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Link from 'next/link';
import useStateContext from '@/context/ContextProvider';
import { select_thumbnail_from_media } from '@/utils/functions/produc_fn';


const Checkouts_page = ({ axios, order_id }) => {


    useEffect(() => {
        if (document.querySelector(".MuiCheckbox-root")) {
            document.querySelector(".MuiCheckbox-root").style = "color: #292524";
        }

        if (document.querySelectorAll(".MuiBadge-colorInfo")) {
            document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: rgb(120 113 108)");
        }

    }, []);


    // Calculator
    const calc_total_amount = (arr) => {
        return arr.reduce((prev, next) => prev + (next.price * next.quantity), 0);
    }

    const calc_total_items = (arr) => {
        return arr.reduce((prev, next) => prev + next.quantity, 0);
    }

    const calc_gross_total_amount = (obj) => {
        return obj.purchase.reduce((prev, next) => prev + (next.price * next.quantity), 0) + Number(obj.delivery_charges);
    }

    // Payment Methods
    const payment_method = {
        cod: "Cash on Delivery (COD)",
        jazzcash: "Paid with JazzCash (JazzCash)",
        easypaisa: "Paid with EasyPaisa (EasyPaisa)",
        sadapay: "Paid with SadaPay (SadaPay)",
        nayapay: "Paid with NayaPay (NayaPay)",
        bank: "Bank Transfer (Bank)",
    };

    // validate Order ID
    const isValidObjectId = (id) => {
        try {
            return new mongoose.Types.ObjectId(id); // If valid, it returns the ObjectId
        } catch (error) {
            return false; // Invalid ID
        }
    };

    const { get_order_api } = useStateContext();



    // Handle Confirm Order API [SUBMIT BUTTON]
    const [confirmed_order, set_confirmed_order] = useState(null);


    const [is_loading, set_is_loading] = useState(true);

    // getting confirmed order
    useEffect(() => {
        if (order_id) {
            get_order_api(axios, order_id, set_confirmed_order, set_is_loading);
        }
    }, [order_id]);




    return (
        <div className='w-full px-[20px] flex flex-col lg:flex-row'>


            {/* Main Content Section */}

            {isValidObjectId(order_id) ?
                <>

                    {(is_loading) ?
                        <>
                            {/* Skeleton */}
                            <div className="flex-[1] lg:h-[calc(100vh-80px)] md:px-[40px] py-[40px] flex flex-col gap-4 lg:border-r  border-stone-200 ">

                                <div className='flex items-center gap-4 mb-6' >
                                    <Skeleton
                                        variant='circular'
                                        animation="wave"
                                        className='w-[50px] h-[50px] '

                                    />

                                    <div>
                                        <Skeleton
                                            variant='text'
                                            animation="wave"
                                            className='w-[160px] md:w-[200px]'

                                        />

                                        <Skeleton
                                            variant='rounded'
                                            animation="wave"
                                            className='w-[200px] md:w-[240px] h-[30px]'

                                        />
                                    </div>
                                </div>

                                <div className='p-4 border border-stone-200 rounded-md flex flex-col gap-4'>
                                    <Skeleton
                                        variant='rounded'
                                        animation="wave"
                                        className='w-[160px] md:w-[200px] h-[25px]'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[220px] md:w-[300px]'

                                    />

                                </div>

                                <div className='p-4 border border-stone-200 rounded-md'>
                                    <Skeleton
                                        variant='rounded'
                                        animation="wave"
                                        className='w-[130px] md:w-[170px] h-[30px]'

                                    />

                                    <Skeleton
                                        variant='rounded'
                                        animation="wave"
                                        className='w-[120px] md:w-[160px] h-[25px] mt-8'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[160px] md:w-[200px]'

                                    />

                                    <Skeleton
                                        variant='rounded'
                                        animation="wave"
                                        className='w-[135px] md:w-[175px] h-[25px] mt-4'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[100px] md:w-[130px]'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[120px] md:w-[140px]'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[130px] md:w-[150px]'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[140px] md:w-[165px]'

                                    />

                                    <Skeleton
                                        variant='rounded'
                                        animation="wave"
                                        className='w-[160px] md:w-[190px] h-[25px] mt-4'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[160px] md:w-[200px]'

                                    />



                                    <Skeleton
                                        variant='rounded'
                                        animation="wave"
                                        className='w-[150px] md:w-[190px] h-[25px] mt-4'

                                    />
                                    <Skeleton
                                        variant='text'
                                        animation="wave"
                                        className='w-[220px] md:w-[300px]'

                                    />




                                </div>
                            </div>


                            {/* Sticky Sidebar Order Information Skeleton*/}
                            <div className="flex-[1]">
                                <div className="sticky top-0 md:px-[40px] py-[40px] flex flex-col gap-2">
                                    {/* Product price */}

                                    <div
                                        className="w-full border-stone-300 flex items-center justify-between  my-1"
                                    >
                                        <div className="flex gap-4">


                                            <Skeleton
                                                variant='rounded'
                                                animation="wave"
                                                className='w-[65px] h-[65px]'

                                            />


                                            <div>
                                                <Skeleton
                                                    variant='text'
                                                    animation="wave"
                                                    className='w-[80px] md:w-[120px]'

                                                />

                                                <Skeleton
                                                    variant='text'
                                                    animation="wave"
                                                    className='w-[70px] md:w-[140px]'

                                                />
                                            </div>

                                        </div>
                                        <p className="text-[15px] md:text-[17px] font-semibold text-stone-800">
                                            <Skeleton
                                                variant='text'
                                                animation="wave"
                                                className='w-[95px] md:w-[130px]'

                                            />
                                        </p>
                                    </div>



                                    {/* Subtotal of Order */}
                                    <div className="w-full mt-6 border-stone-300 flex items-center justify-between ">
                                        <p className="text-[14px] md:text-[16px] font-semibold text-stone-800">
                                            <Skeleton
                                                variant='text'
                                                animation="wave"
                                                className='w-[120px] md:w-[160px] h-[25px]'

                                            />
                                        </p>
                                        <p className="text-[15px] md:text-[17px] font-semibold text-stone-800">
                                            <Skeleton
                                                variant='text'
                                                animation="wave"
                                                className='w-[120px] md:w-[160px] h-[25px]'

                                            />
                                        </p>
                                    </div>

                                    {/* Shipping Cost */}
                                    <div className="w-full border-stone-300 flex items-center justify-between ">
                                        <Skeleton
                                            variant='text'
                                            animation="wave"
                                            className='w-[145px] md:w-[185px] h-[25px]'

                                        />

                                        <Skeleton
                                            variant='text'
                                            animation="wave"
                                            className='w-[120px] md:w-[160px] h-[25px]'

                                        />

                                    </div>

                                    {/* Total */}
                                    <div className="w-full border-stone-300 flex items-center justify-between mt-8">
                                        <Skeleton
                                            variant='text'
                                            animation="wave"
                                            className='w-[100px] md:w-[120px] h-[35px]'

                                        />
                                        <p className="text-[18px] md:text-[20px] font-black text-stone-800">
                                            <Skeleton
                                                variant='text'
                                                animation="wave"
                                                className='w-[120px] h-[35px]'

                                            />
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </>

                        : confirmed_order ?
                            <>

                                <div className="flex-[1] lg:h-[calc(100vh-80px)] md:px-[40px] py-[40px] flex flex-col gap-4 lg:border-r border-stone-200 ">

                                    <div className='flex items-center gap-4 mb-6' >
                                        <div className='w-[50px] h-[50px] flex items-center justify-center rounded-full border-2 border-stone-600'>
                                            <CheckIcon className='scale-[1.2]' />
                                        </div>
                                        <div>
                                            <p className='text-[14px] text-gray-500 line-clamp-1 text-ellipsis overflow-hidden'>Confirmation #{confirmed_order._id}</p>
                                            <p className='text-[20px] font-bold text-stone-900 line-clamp-1 text-ellipsis overflow-hidden'>Thank you, {`${confirmed_order.firstName || ""} ${confirmed_order.lastName || ""}`}!</p>
                                        </div>
                                    </div>

                                    <div className='p-4 border border-stone-200 rounded-md flex flex-col gap-4'>
                                        <p className='text-[18px] font-bold text-stone-900'>Your order is confirmed</p>
                                        <p className='text-[16px] text-stone-700'>You'll receive a confirmation email with your order number shortly.</p>
                                    </div>

                                    <div className='p-4 border border-stone-200 rounded-md'>
                                        <p className='text-[18px] font-bold text-stone-900 w-full mb-5'>Order details</p>


                                        <p className='text-[16px] font-bold text-stone-900 mt-3'>Contact information</p>
                                        <p className='text-[16px] text-stone-700 line-clamp-1 text-ellipsis overflow-hidden'>{confirmed_order.email || ""}</p>


                                        <p className='text-[16px] font-bold text-stone-900 mt-3'>Shipping address</p>
                                        <p className='text-[16px] text-stone-700'>{confirmed_order.address || ""}</p>
                                        <p className='text-[16px] text-stone-700'>{`${confirmed_order.city || ""} ${confirmed_order.postalCode ? confirmed_order.postalCode : ""}`}</p>
                                        <p className='text-[16px] text-stone-700'>{"Pakistan"}</p>
                                        <p className='text-[16px] text-stone-700'>{confirmed_order.phone || ""}</p>

                                        <p className='text-[16px] font-bold text-stone-900 mt-3'>Shipping method</p>
                                        <p className='text-[16px] text-stone-700'>Delivery Charges</p>


                                        {confirmed_order.special_instructions &&
                                            <>
                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Special instructions</p>
                                                <p className='text-[16px] text-stone-700'>{confirmed_order.special_instructions || ""}</p>
                                            </>
                                        }




                                        <p className='text-[16px] font-bold text-stone-900 mt-3'>Payment method</p>
                                        <p className='text-[16px] text-stone-700'>{
                                            payment_method[confirmed_order.payment_method] ?
                                                `${payment_method[confirmed_order.payment_method]} • Rs. ${calc_gross_total_amount(confirmed_order).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                :
                                                ""
                                        }
                                        </p>

                                    </div>
                                </div>

                                {/* Sticky Sidebar */}
                                <div className="flex-[1]">
                                    <div className="sticky top-0 md:px-[40px] py-[40px] flex flex-col gap-2">
                                        {/* Product price */}

                                        {confirmed_order.purchase.map((item) => (
                                            <div key={item._id} className="w-full border-stone-300 flex items-center justify-between  my-1">
                                                <div className="flex items-center gap-5">
                                                    <Badge
                                                        badgeContent={item.quantity}
                                                        color="info"
                                                        showZero
                                                    >
                                                        <div className="w-[65px] h-[65px] border border-stone-300 shadow grid place-items-center rounded-md overflow-hidden">
                                                            <img
                                                                alt=""
                                                                src={select_thumbnail_from_media(item.media)}
                                                                className="w-[65px] h-[65px] object-cover"
                                                            />
                                                        </div>
                                                    </Badge>
                                                    <div className="text-stone-800 text-[14px] font-medium">
                                                        <p className='line-clamp-1 text-ellipsis overflow-hidden font-semibold capitalize'>{item.title}</p>
                                                        <p className="text-gray-600 font-normal line-clamp-1 text-ellipsis overflow-hidden capitalize">{item.size} / {item.condition}</p>
                                                        <p className="text-gray-600 font-normal line-clamp-1 text-ellipsis overflow-hidden capitalize">{item.brand}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                                    Rs. {Number(item.price).toLocaleString("en-US")}
                                                </p>
                                            </div>
                                        ))}


                                        {/* Subtotal of Order */}
                                        <div className="w-full mt-6 border-stone-300 flex items-center justify-between ">
                                            <p className="text-[14px] md:text-[16px] font-medium text-stone-800">
                                                Subtotal {(calc_total_items(confirmed_order.purchase) > 1) && `• ${calc_total_items(confirmed_order.purchase)}  items`}
                                            </p>
                                            <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                                Rs. {calc_total_amount(confirmed_order.purchase).toLocaleString("en-US")}
                                            </p>
                                        </div>

                                        {/* Shipping Cost */}
                                        <div className="w-full border-stone-300 flex items-center justify-between ">
                                            <p className="text-[14px] md:text-[16px] font-medium text-stone-800">
                                                Shipping
                                            </p>
                                            <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                                Rs. {Number(confirmed_order.delivery_charges).toLocaleString("en-US")}
                                            </p>
                                        </div>

                                        {/* Total */}
                                        <div className="w-full border-stone-300 flex items-center justify-between  mt-6">
                                            <p className="text-[18px] md:text-[20px] font-bold text-stone-800">TOTAL:</p>
                                            <p className="text-[18px] md:text-[20px] font-bold text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                                <span className='text-[13px] md:text-[14px] text-gray-600 font-normal pr-[6px]'>
                                                    PKR
                                                </span>
                                                <span>
                                                    Rs. {calc_gross_total_amount(confirmed_order).toLocaleString("en-US")}
                                                </span>
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </>
                            :
                            <div className="w-full h-[70vh] flex flex-col justify-center items-center">
                                <h1 className='text-[16px] md:text-[18px] text-stone-500  uppercase text-center'>
                                    THE ORDER HAS BEEN REMOVED OR CANCELLED.
                                </h1>

                                <div className='my-[30px] w-full flex justify-center items-center'>
                                    <Link href="/collection" >
                                        <button className='w-full py-[12px] text-white bg-black font-semibold text-[14px] md:text-[15px]  transition-all duration-300 hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center'>
                                            <ShoppingCartCheckoutIcon className='text-[19px]' />  CONTINUE ORDERING
                                        </button>
                                    </Link>
                                </div>
                            </div>

                    }
                </>
                :
                <div className="w-full h-[70vh] flex flex-col justify-center items-center">
                    <h1 className='text-[16px] md:text-[18px] text-stone-500  uppercase text-center'>
                        THE ORDER ID IS INVALID
                    </h1>

                    <div className='my-[30px] w-full flex justify-center items-center'>
                        <Link href="/collection" >
                            <button className='w-full py-[12px] text-white bg-black font-semibold text-[14px] md:text-[15px]  transition-all duration-300 hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center'>
                                <ShoppingCartCheckoutIcon className='text-[19px]' />  CONTINUE ORDERING
                            </button>
                        </Link>
                    </div>
                </div>
            }




        </div>
    )
}

export default Checkouts_page