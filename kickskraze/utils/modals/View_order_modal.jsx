import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Badge from "@mui/material/Badge";
import { Skeleton } from '@mui/material';
import mongoose from 'mongoose';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import useStateContext from '@/context/ContextProvider';
import { calc_gross_total_amount, calc_total_amount, calc_total_items, select_thumbnail_from_media } from '@/utils/functions/produc_fn';
import styles from "@/styles/home.module.css";
import Link from 'next/link';
import { useRouter } from 'next/router';



const View_order_modal = ({
    modals_state,
    toggle_modal,
    axios,
}) => {



    const { get_all_orders_api, set_orders, set_dispatched_orders, get_order_api, order_id, set_order_id, update_order_api, delete_order_api, set_API_loading, } = useStateContext();


    const pathname = useRouter().pathname;
    const pages = {
        "/admin/orders": {
            query: "status=booked",
            fn: set_orders,
        },
        "/admin/dispatched-orders": {
            query: "status_not=booked",
            fn: set_dispatched_orders,
        },
    };


    useEffect(() => {
        if (document.querySelector(".MuiCheckbox-root")) {
            document.querySelector(".MuiCheckbox-root").style = "color: #292524";
        }

        if (document.querySelectorAll(".MuiBadge-colorInfo")) {
            document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: rgb(120 113 108)");
        }

    }, []);

    // validate Order ID
    const isValidObjectId = (id) => {
        try {
            return new mongoose.Types.ObjectId(id); // If valid, it returns the ObjectId
        } catch (error) {
            return false; // Invalid ID
        }
    };


    // Handle Confirm Order API [SUBMIT BUTTON]
    const [confirmed_order, set_confirmed_order] = useState(null);
    const default_errors = {
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phone: "",
        payment_method: "",
        tracking_no: "",
        courier_name: "",
    }
    const [errors, set_errors] = useState(default_errors)


    const [is_loading, set_is_loading] = useState(true);

    // Close Modal
    const close_modal = () => {
        set_confirmed_order(null);
        set_errors(default_errors);
        toggle_modal("view_order_modal");
        set_is_loading(true);
    }

    // getting confirmed order
    useEffect(() => {
        if (modals_state.view_order_modal && order_id) {
            get_order_api(axios, order_id, set_confirmed_order, set_is_loading);
        } else {
            set_confirmed_order(null);
            set_errors(default_errors);
        }
    }, [order_id, modals_state.view_order_modal]);


    // Invoice Date Formatter
    const date_formatter = (date) => {
        // Create a Date object
        const dateObject = new Date(date);

        // Format the date
        const dateOptions = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = dateObject.toLocaleDateString('en-US', dateOptions);

        // Format the time
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedTime = dateObject.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate}  [${formattedTime}]`;
    };



    // Handle input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        set_confirmed_order((prevState) => ({
            ...prevState,
            [name]: (name === "tracking_no") ? value.replace(/\s+/g, "") : value,
        }));
    }

    const phone_regex = /^(?:(?:\+92|0092|92|0)?3\d{9})$/
    // Validate form
    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'email':
                if (!value) {
                    error = 'Please enter an email';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                    error = 'Invalid email address';
                }
                break;
            case 'firstName':
                if (!value) {
                    error = 'Please enter your first name';
                }
                break;
            case 'lastName':
                if (!value) {
                    error = 'Please enter your last name';
                }
                break;
            case 'address':
                if (!value) {
                    error = 'Please enter your address';
                }
                break;
            case 'city':
                if (!value) {
                    error = 'Please enter your city';
                }
                break;
            case 'payment_method':
                if (!value) {
                    error = 'Please select your payment method';
                }
                break;
            case 'phone':
                if (!value) {
                    error = 'Please enter your phone';
                } else if (!phone_regex.test(value)) {
                    error = 'Please enter a valid phone number';
                }
                break;
            case 'tracking_no':
                if (value && !confirmed_order.courier_name) {
                    error = 'Please also select the courier name';
                }
                break;
            case 'courier_name':
                if (value && !confirmed_order.tracking_no) {
                    error = 'Please also enter the tracking no.';
                }
                break;
            default:
                break;
        }
        return error;
    }


    // Handle Update Form
    const handle_submit = async (e) => {
        e.preventDefault();
        const errors = {};
        Object.keys(confirmed_order).forEach((fieldName) => {
            const error = validateField(fieldName, confirmed_order[fieldName]);
            if (error) {
                errors[fieldName] = error;
            }
        });
        set_errors(errors);
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            let { purchase = [], ...others } = confirmed_order;
            purchase = purchase.length ? purchase.map(e => ({ _id: e._id, quantity: e.quantity })) : [];
            const updated_order = await update_order_api(axios, order_id, { purchase, ...others }, set_API_loading);
            await get_all_orders_api(axios, pages[pathname].query, pages[pathname].fn, set_API_loading);

            if (!confirmed_order.purchase.length && updated_order) {
                close_modal();
            }
        }
    };


    const remove_item = (item_id) => {
        set_confirmed_order(prev => {
            const purchase = prev.purchase.filter(e => e._id !== item_id);
            return { ...prev, purchase };
        });
    }


    return (
        <Dialog
            open={modals_state.view_order_modal}
            onClose={close_modal}
            className=''
        >
            <div className={`w-full md:w-[550px] ${styles.scroll_bar} overflow-x-hidden`} >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50 sticky top-0 z-10' >
                    <p className='text-[15px] md:text-[18px] font-medium text-stone-700 '>
                        View/Edit Order
                    </p>
                    <IconButton onClick={close_modal}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>


                <div className='w-full px-[20px] flex flex-col'>


                    {/* Main Content Section */}

                    {isValidObjectId(order_id) ?
                        <>

                            {(is_loading) ?
                                <>
                                    {/* Sticky Sidebar Order Information Skeleton*/}
                                    <div className="flex-[1]">
                                        <div className="py-[40px] flex flex-col gap-2">
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

                                    {/* Skeleton */}
                                    <div className="flex-[1] py-[40px] flex flex-col gap-4  border-stone-200 ">

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
                                </>

                                : confirmed_order ?
                                    <>
                                        {/* Sticky Sidebar */}
                                        {Boolean(confirmed_order.purchase.length) &&
                                            < div className="flex-[1]">
                                                <div className="py-[40px] flex flex-col gap-2">
                                                    {/* Product price */}

                                                    {confirmed_order.purchase.map((item) => (
                                                        <div key={item._id} className="w-full border-stone-300 flex items-center justify-between my-1">
                                                            <div className="flex items-center gap-5">
                                                                <Link href={`/product?product_id=${item._id}`} target="_blank">
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
                                                                                onError={(e) => e.target.src = "/images/logo_error.png"}
                                                                            />
                                                                        </div>
                                                                    </Badge>
                                                                </Link>
                                                                <div className="text-stone-800 text-[14px] font-medium">
                                                                    <p className='line-clamp-1 text-ellipsis overflow-hidden font-semibold capitalize'>{item.title}</p>
                                                                    <p className="text-gray-600 font-normal line-clamp-1 text-ellipsis overflow-hidden capitalize">{item.size} / {item.condition}</p>
                                                                    <p className="text-gray-600 font-normal line-clamp-1 text-ellipsis overflow-hidden capitalize">{item.brand}</p>
                                                                </div>
                                                            </div>

                                                            <div className='flex flex-col items-end'>
                                                                <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                                                    Rs. {Number(item.price).toLocaleString("en-US")}
                                                                </p>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => remove_item(item._id)}
                                                                    className='w-fit px-[14px] py-[4px] bg-rose-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] mt-1'
                                                                >
                                                                    Remove item
                                                                </button>
                                                            </div>

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
                                        }

                                        <form onSubmit={handle_submit} className="flex-[1] py-[40px] flex flex-col gap-4">

                                            {/* Inputs & Details */}
                                            <div className='p-4 border border-stone-200 rounded-md'>
                                                <p className='text-[18px] font-bold text-stone-900 w-full mb-5'>Order details</p>


                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Invoice date</p>
                                                <p className='text-[16px] text-stone-700 line-clamp-1 text-ellipsis overflow-hidden px-1'>{date_formatter(confirmed_order.createdAt) || ""}</p>


                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Order id</p>
                                                <p className='text-[16px] text-stone-700 line-clamp-1 text-ellipsis overflow-hidden px-1'>#{confirmed_order.orderNumber || ""}</p>


                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Customer name</p>
                                                {/* First Name */}
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    placeholder='First name'
                                                    value={confirmed_order.firstName || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />
                                                {errors.firstName &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.firstName}</p>
                                                }
                                                {/* Last Name */}
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    placeholder='Last name'
                                                    value={confirmed_order.lastName || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />
                                                {errors.lastName &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.lastName}</p>
                                                }




                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Contact information</p>
                                                {/* Email */}
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder='Email'
                                                    value={confirmed_order.email || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />
                                                {errors.email &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.email}</p>
                                                }




                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Shipping address</p>
                                                {/* Address */}
                                                <input
                                                    type="text"
                                                    name="address"
                                                    placeholder='Address'
                                                    value={confirmed_order.address || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />
                                                {errors.address &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.address}</p>
                                                }
                                                {/* City */}
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder='City'
                                                    value={confirmed_order.city || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />
                                                {errors.city &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.city}</p>
                                                }
                                                {/* Postal Code */}
                                                {confirmed_order.postalCode &&
                                                    <>
                                                        <input
                                                            type="text"
                                                            name="postalCode"
                                                            placeholder='Postal Code'
                                                            value={confirmed_order.postalCode || ""}
                                                            onChange={handleChange}
                                                            className='w-full outline-none border-none px-1'
                                                        />
                                                    </>
                                                }
                                                <p className='text-[16px] text-stone-700 px-1'>{"Pakistan"}</p>
                                                {/* Phone */}
                                                <input
                                                    type="phone"
                                                    name="phone"
                                                    placeholder='Phone'
                                                    value={confirmed_order.phone || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />
                                                {errors.phone &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.phone}</p>
                                                }




                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Status</p>
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={confirmed_order.status || ""}
                                                    onChange={handleChange}
                                                    className='outline-none px-0 cursor-pointer'
                                                >
                                                    <option value="booked">Booked</option>
                                                    <option value="in_transit">In Transit</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="rcp">RCP</option>
                                                    <option value="returned">Returned</option>
                                                </select>



                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Verification Status</p>
                                                <select
                                                    id="verification"
                                                    name="verification"
                                                    value={confirmed_order.verification || ""}
                                                    onChange={handleChange}
                                                    className='outline-none px-0 cursor-pointer'
                                                >
                                                    <option value="verified">Verified</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="unverified">Unverified</option>
                                                </select>




                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Warehouse Status</p>
                                                <select
                                                    id="warehouse_status"
                                                    name="warehouse_status"
                                                    value={confirmed_order.warehouse_status || ""}
                                                    onChange={handleChange}
                                                    className='outline-none px-0 cursor-pointer'
                                                >
                                                    <option value="idle">Idle</option>
                                                    <option value="found">Found</option>
                                                    <option value="packed">Packed</option>
                                                    <option value="not found">Not Found</option>
                                                </select>




                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Tracking no.</p>
                                                <input
                                                    type="text"
                                                    name="tracking_no"
                                                    placeholder='Tracking No.'
                                                    value={confirmed_order.tracking_no || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />
                                                {errors.tracking_no &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.tracking_no}</p>
                                                }



                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Courier</p>
                                                <select
                                                    id="courier_name"
                                                    name="courier_name"
                                                    value={confirmed_order.courier_name || ""}
                                                    onChange={handleChange}
                                                    className='outline-none px-0 cursor-pointer'
                                                >
                                                    <option className='italic text-gray-400' value="">No Courier</option>
                                                    <option value="trax">Trax</option>
                                                    <option value="leapord">Leapord</option>
                                                </select>
                                                {errors.courier_name &&
                                                    <p className='text-[13px] text-rose-500 line-clamp-1 text-ellipsis overflow-hidden px-2 mb-2'>{errors.courier_name}</p>
                                                }






                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Shipping method</p>
                                                <p className='text-[16px] text-stone-700 px-1'>Delivery Charges</p>





                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Special instructions</p>
                                                <input
                                                    type="text"
                                                    name="special_instructions"
                                                    placeholder='Special Instructions'
                                                    value={confirmed_order.special_instructions || ""}
                                                    onChange={handleChange}
                                                    className='w-full outline-none border-none px-1'
                                                />




                                                <p className='text-[16px] font-bold text-stone-900 mt-3'>Payment Method</p>
                                                <select
                                                    id="payment_method"
                                                    name="payment_method"
                                                    value={confirmed_order.payment_method || ""}
                                                    onChange={handleChange}
                                                    className='outline-none px-0 cursor-pointer'
                                                >
                                                    <option value="cod">Cash on Delivery (COD)</option>
                                                    <option value="jazzcash">Paid with JazzCash (JazzCash)</option>
                                                    <option value="easypaisa">Paid with EasyPaisa (EasyPaisa)</option>
                                                    <option value="sadapay">Paid with SadaPay (SadaPay)</option>
                                                    <option value="nayapay">Paid with NayaPay (NayaPay)</option>
                                                    <option value="bank">Bank Transfer (Bank)</option>
                                                </select>




                                            </div>

                                            {/* Buttons */}
                                            <div className='w-full flex items-center justify-between my-4 px-4' >
                                                <button
                                                    type='button'
                                                    onClick={() => toggle_modal("delete_order_modal")}
                                                    className='w-fit px-[12px] py-[6px] bg-rose-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[15px]'
                                                >
                                                    Delete
                                                </button>
                                                <div className='flex items-center gap-5' >
                                                    <button
                                                        type="button"
                                                        onClick={close_modal}
                                                        className='w-fit px-[12px] py-[6px] bg-stone-200 text-stone-700 hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[15px]'
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type='submit'
                                                        className='w-fit px-[12px] py-[6px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[15px]'
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                    :
                                    <div className="w-full h-[70vh] flex flex-col justify-center items-center">
                                        <h1 className='text-[16px] md:text-[18px] text-stone-500  uppercase text-center'>
                                            THE ORDER HAS BEEN REMOVED OR CANCELLED.
                                        </h1>

                                        <div className='my-[30px] w-full flex justify-center items-center'>
                                            <button onClick={close_modal} className='w-full py-[12px] text-white bg-black font-semibold text-[14px] md:text-[15px]  transition-all duration-300 hover:opacity-70 active:scale-[.97] px-[50px] flex justify-center gap-3 items-center'>
                                                <ShoppingCartCheckoutIcon className='text-[19px]' />  CLOSE MODAL
                                            </button>
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
                                <button onClick={close_modal} className='w-full py-[12px] text-white bg-black font-semibold text-[14px] md:text-[15px]  transition-all duration-300 hover:opacity-70 active:scale-[.97] px-[50px] flex justify-center gap-3 items-center'>
                                    <ShoppingCartCheckoutIcon className='text-[19px]' />  CLOSE MODAL
                                </button>
                            </div>
                        </div>
                    }




                </div>


            </div>
        </Dialog >
    )
}

export default View_order_modal