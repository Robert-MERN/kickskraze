import React, { useEffect, useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link';
import { IoClose } from "react-icons/io5";
import Image from 'next/image';
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";
import Checkbox from '@mui/material/Checkbox';
import product_1 from "@/public/images/product_1.jpg"
import { MdVerifiedUser } from "react-icons/md";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useStateContext from '@/context/ContextProvider';
import { select_thumbnail_from_media } from '@/utils/functions/produc_fn';
import { MetaPixel } from '@/lib/fpixel';


const Cart_page = () => {
    const {
        cart,
        sum_of_cart,
        delete_item_from_cart,
        add_item_to_cart,
        substract_item_from_cart
    } = useStateContext()


    const [cart_input_data, set_cart_input_data] = useState({
        coupon_code: "",
        special_instructions: "",
    });

    const handle_input_change = (e) => {
        const { value, name } = e;
        set_cart_input_data(prev => ({ ...prev, [name]: value }));
    }

    // useEffect(() => {
    //     if (cart.length) document.querySelector(".MuiCheckbox-root").style = "color: #292524"
    // }, [cart.length]);

    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); // Clean up the timer when the component unmounts
    }, []);

    // Format time into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const convert_cart_to_meta = (cart) => {
        const meta_cart = {
            content_ids: cart.map(each => each._id),
            contents: cart,
            content_type: "product_group",
            value: sum_of_cart().toFixed(2),
            currency: "PKR",
        }
        return meta_cart

    }


    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] '>

            {/* Breadcrumbs */}
            <Breadcrumbs className='text-gray-400 text-[13px] md:text-[15px]' separator={<NavigateNextIcon fontSize="small" />} >
                <Link
                    className='hover:underline active:text-gray-600'
                    underline="hover"
                    color="inherit"
                    href="/collection"
                >
                    Home
                </Link>
                <p>
                    Your Cart
                </p>
            </Breadcrumbs>

            <h1 className='text-[19px] md:text-[24px] mt-2'>YOUR CART</h1>

            {Boolean(cart.length) ?

                <>
                    {/* Fake timer to make users place their order fast  */}
                    {timeLeft > 0 &&
                        <div className='w-full my-4 flex justify-center items-center min-h-[50px] bg-[#FFF2DD] text-left text-black py-3 px-[20px] gap-2' >
                            <InfoOutlinedIcon className='text-stone-700 hidden xl:block' />
                            <p className='text-[16px]'>Please, hurry! Someone has placed an order on one of the items you have in the cart. We'll keep it for you for <span className='text-[17px] font-bold'>{formatTime(timeLeft)}</span> minutes.</p>
                        </div>
                    }

                    <div className='w-full flex flex-col xl:flex-row gap-6 mt-[15px] md:mt-[25px]' >

                        {/* Product Information Section */}
                        <div className='flex flex-col flex-[3]' >

                            {/* Headings */}
                            <div className='bg-[#F7F7F7] w-full h-[40px] md:h-[50px] px-[20px] flex items-center justify-between text-[15px] md:text-[17px] font-semibold text-stone-700' >
                                <div className='flex w-full items-center'>
                                    <p>PRODUCT</p>
                                </div>
                                <div className='flex w-full justify-end items-center gap-16' >
                                    <p>PRICE</p>
                                    <p className='hidden md:block' >QUANTITY</p>
                                    <p className='hidden md:block'>TOTAL</p>
                                    <button className='opacity-0 hidden md:block' >
                                        <IoClose className='text-stone-700 scale-[1.3]' />
                                    </button>
                                </div>
                            </div>

                            {/* Cart Product(s)  */}
                            {cart.map((item, index) => (

                                <div key={index} className='w-full flex px-[20px] items-center justify-between border border-stone-200 
                    py-[10px] md:py-[25px] mt-[10px] min-h-[150px] sm:min-h-[170px] gap-2' >

                                    {/* Product info */}
                                    <div className='flex w-full h-full gap-4' >
                                        <Link href={`/product?product_id=${item._id}`}>
                                            <div className='w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] rounded-md overflow-hidden'>
                                                <img
                                                    src={select_thumbnail_from_media(item.media)}
                                                    alt="product" className='w-[60px] h-[60px]  sm:w-[100px] sm:h-[100px] object-cover rounded-md'
                                                    onError={(e) => e.target.src = "/images/logo_error.png"}
                                                />
                                            </div>
                                        </Link>
                                        <div className='flex flex-col gap-1 text-[14px] md:text-[17px]' >
                                            <p className='capitalize line-clamp-1 text-ellipsis overflow-hidden' >{item.title}</p>
                                            {/* ===== SIZE / COLOR ===== */}
                                            <p className='text-gray-500 text-[13px] md:text-[15px] capitalize'>
                                                {[
                                                    item.selectedVariant?.options?.size ?? item.size,   // variant > base
                                                    item.selectedVariant?.options?.color ?? item.color  // variant > base
                                                ]
                                                    .filter(Boolean)         // remove null / empty
                                                    .join(" / ")             // add slash only if both exist
                                                }
                                            </p>
                                            {/* ===== BRAND / CONDITION ===== */}
                                            <p className='text-gray-500 text-[13px] md:text-[15px] capitalize'>
                                                {[
                                                    item.brand || null,                                      // base fallback only
                                                    item.condition && item.condition.toLowerCase() !== "brand new"
                                                        ? item.condition                                     // hide brand new
                                                        : null
                                                ]
                                                    .filter(Boolean)
                                                    .join(" / ")
                                                }
                                            </p>

                                            {/* Qunatity Selector for Mobile media (Responsive) */}
                                            <div className='flex sm:hidden justify-start gap-2 sm:gap-4 text-[17px] text-stone-800 font-medium mt-2 select-none'>
                                                {/* Quantity Selector button */}
                                                <div className='px-[8px] sm:px-[8px] py-[6px] sm:py-[8px] md:py-[10px] flex gap-4 md:gap-6 items-center border border-stone-500 text-stone-700'>
                                                    <button
                                                        onClick={() => substract_item_from_cart(item)} className='active:opacity-60'
                                                    >
                                                        <FaMinus className='text-[12px] sm:text-[12px] md:text-[14px]' />
                                                    </button>
                                                    <p className='text-[12px] sm:text-[15px] md:text-[16px]' >{item.quantity}</p>
                                                    <button
                                                        onClick={() => add_item_to_cart(item)}
                                                        className='active:opacity-60'
                                                    >
                                                        <IoMdAdd className='text-[14px] sm:text-[15px] md:text-[17px]' />
                                                    </button>
                                                </div>
                                                {/* Remove from the cart button */}
                                                <button
                                                    onClick={() => delete_item_from_cart(item)}
                                                    className='active:opacity-60'
                                                >
                                                    <IoClose className='text-stone-700 sm:scale-[1.3]' />
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Price & Quantity */}
                                    <div className='flex flex-col md:flex-row md:w-full h-full justify-start md:justify-end items-end md:items-center gap-4 md:gap-6 lg:gap-8 text-[14px] sm:text-[15px] xl:text-[17px] text-stone-800 font-medium select-none text-nowrap'>
                                        {/* Price */}
                                        <p className='text-nowrap' >Rs. {Number(item.price).toLocaleString("en-US")}</p>
                                        {/* Quanity Selector button */}
                                        <div className='px-[6px] py-[10px] sm:flex hidden  gap-6 items-center border border-stone-500 text-stone-700'>
                                            <button
                                                onClick={() => substract_item_from_cart(item)}
                                                className='active:opacity-60'
                                            >
                                                <FaMinus className='text-[14px]' />
                                            </button>
                                            <p>{item.quantity}</p>
                                            <button
                                                onClick={() => add_item_to_cart(item)}
                                                className='active:opacity-60'
                                            >
                                                <IoMdAdd className='text-[17px]' />
                                            </button>
                                        </div>
                                        {/* Total price */}
                                        <p className='hidden md:block' >Rs. {Number(item.price * item.quantity).toLocaleString("en-US")}</p>
                                        {/* Remove from the Cart button*/}
                                        <button
                                            onClick={() => delete_item_from_cart(item)}
                                            className='hidden sm:block active:opacity-60'
                                        >
                                            <IoClose className='text-stone-700 scale-[1.3]' />
                                        </button>
                                    </div>

                                </div>
                            ))}


                            {/* Additional Comments from Customers */}
                            <div className='w-full mt-[20px] flex flex-col gap-2'>
                                <p className='text-[15px] md:text-[17px] font-semibold text-stone-700'>
                                    Additional Comments
                                </p>
                                <textarea
                                    placeholder="Special instruction for seller..."
                                    type='text'
                                    name="special_instructions"
                                    className='w-full lg:w-[600px] h-[100px] border-2 border-stone-200 px-[15px] py-[10px] outline-none text-[17px] text-stone-800'
                                    value={cart_input_data.special_instructions}
                                    onChange={handle_input_change}
                                />
                                <p className='text-[15px] md:text-[17px] text-stone-400 flex items-center gap-2 mt-2'>
                                    <MdVerifiedUser className='text-stone-700 text-[22px] md:text-[24px]' />
                                    Secure shopping gurantee
                                </p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className='flex flex-col md:flex-row xl:flex-col flex-[1] md:gap-6 xl:gap-0' >

                            <div className='flex flex-col flex-[1]' >
                                <div className='w-full border-b-[3px] h-[40px] md:h-[50px] border-stone-800 flex items-center text-stone-900' >
                                    <p className='text-[18px] md:text-[20px]' >ORDER SUMMARY</p>
                                </div>
                                {/* Subtotal of Order */}
                                <div className='w-full border-b py-[10px] border-stone-300 flex items-center justify-between mt-[10px]' >
                                    <p className='text-[16px] md:text-[18px] font-medium'>Subtotal</p>
                                    <p className='text-[17px] md:text-[20px] font-bold'>Rs. {sum_of_cart().toLocaleString("en-US")}</p>
                                </div>

                                {/* Coupon Code */}
                                <div className='w-full py-[15px] md:py-[25px] text-[15px] md:text-[17px] flex flex-col gap-2 border-b border-stone-300'>
                                    <h1 className='font-medium'>Coupon Code</h1>
                                    <input
                                        type="text"
                                        placeholder='Enter Coupon Code'
                                        name="coupon_code"
                                        className='outline-none border border-stone-400 px-[12px] py-[10px]'
                                        value={cart_input_data.coupon_code}
                                        onChange={handle_input_change}
                                    />
                                    <p className='text-stone-400 leading-[1.3] text-[16px]' >Coupon code will be applied on the checkout page</p>
                                </div>

                                {/* Total */}
                                <div className='w-full border-b border-stone-300 flex items-center justify-between py-[15px] md:py-[20px]' >
                                    <p className='text-[16px] md:text-[19px] font-semibold '>TOTAL:</p>
                                    <p className='text-[19px] md:text-[22px] font-bold'>Rs. {sum_of_cart().toLocaleString("en-US")}</p>
                                </div>
                            </div>


                            <div className='flex flex-col flex-[1] md:pt-8 xl:pt-0'>
                                {/* Terms & Conditionsss */}
                                {/* <div className='w-full py-[12px] flex items-center text-[14px] md:text-[15px]'>
                                    <Checkbox size='small' />
                                    <p>I agree with</p>
                                    <p className='cursor-pointer select-none ml-1 border-b border-b-stone-600  leading-[1.2]'>Terms & Conditions</p>
                                </div> */}

                                {/* Checkout Button */}
                                <Link href="/checkouts" >
                                    <button onClick={() => MetaPixel.trackEvent("InitiateCheckout", convert_cart_to_meta(cart))} className='w-full py-[12px] flex justify-center items-center text-white bg-stone-950 font-bold text-[14px] md:text-[15px] hover:bg-white hover:text-stone-950 border border-stone-500  transition-all duration-300'>
                                        PROCEED TO CHECKOUT
                                    </button>
                                </Link>


                                {/* Continue Shopping Button */}
                                <Link href="/collection" >
                                    <button className='w-full py-[12px] flex justify-center items-center hover:text-white hover:bg-stone-950 font-bold text-[14px] md:text-[15px] bg-white text-stone-950 border border-stone-500  transition-all duration-300 mt-[12px]'>
                                        CONTINUE SHOPPING
                                    </button>
                                </Link>
                            </div>


                        </div>
                    </div>
                </>
                :
                <div className="h-[70vh] flex flex-col justify-center items-center">

                    <h1 className='text-[18px] text-stone-500  uppercase'>
                        YOUR CART IS EMPTY
                    </h1>

                    <div className='my-[30px] w-full flex justify-center items-center'>
                        <Link href="/collection" >
                            <button className='font-bold text-black hover:text-white active:opacity-50 transition-all py-[12px] px-[16px] md:w-[300px] hover:bg-black bg-white border border-stone-400 duration-300' >
                                CONTINUE SHOPPING
                            </button>
                        </Link>
                    </div>
                </div>

            }

        </div>
    )
}

export default Cart_page