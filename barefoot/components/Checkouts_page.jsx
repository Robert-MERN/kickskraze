import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import product_1 from "@/public/images/product_1.jpg"
import Badge from "@mui/material/Badge";
import CheckIcon from '@mui/icons-material/Check';


const Checkouts_page = () => {

    useEffect(() => {
        if (document.querySelector(".MuiCheckbox-root")) {
            document.querySelector(".MuiCheckbox-root").style = "color: #292524";
        }

        if (document.querySelectorAll(".MuiBadge-colorInfo")) {
            document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: rgb(120 113 108)");
        }

    }, []);

    const style_textfield = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgb(214 211 209)', // Default border color
            },
            '&:hover fieldset': {
                borderColor: 'black', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: 'black', // Focused border color
            },
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: 'black', // Focused label color
        },
    }

    const style_textfield_2 = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgb(68 64 60)', // Default border color
                borderWidth: "2px",
            },
            '&:hover fieldset': {
                borderColor: 'rgb(68 64 60)', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgb(68 64 60)', // Focused border color
            },
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: 'rgb(68 64 60)', // Focused label color
        },
    }

    const default_order_details = {
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        errors: {
            email: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            phone: "",
        }
    }
    const [order_details, set_order_details] = useState(default_order_details);

    const handleChange = (event) => {
        const { name, value } = event.target;
        set_order_details((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

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
            case 'phone':
                if (!value) {
                    error = 'Please enter your phone';
                } else if (!/^(?:(?:\+92|0092|92|0)?3\d{9})$/.test(value)) {
                    error = 'Please enter a valid phone number';
                }
                if (value.trim().includes("03102223511")) {
                    error = 'Please enter your phone number';
                }
                break;
            default:
                break;
        }
        return error;
    }



    const handle_submit = (e) => {
        e.preventDefault();
        const errors = {};
        Object.keys(order_details).forEach((fieldName) => {
            const error = validateField(fieldName, order_details[fieldName]);
            if (error) {
                errors[fieldName] = error;
            }
        });
        set_order_details((prevState) => ({
            ...prevState,
            errors,
        }));
        // if (Object.values(errors).every((error) => !error)) {
        //     // Form is valid, submit it
        //     const { errors, ...other } = order_details;
        //     handleLoginAPI(other);
        // }
    }

    const thankyou = false;
    return (
        <div className='w-full px-[20px] flex flex-col lg:flex-row'>


            {/* Main Content Section */}
            {thankyou ?
                <div className="flex-[1] lg:h-[calc(100vh-80px)] md:px-[40px] py-[40px] flex flex-col gap-4 lg:border-r border-stone-200 tracking-wider">

                    <div className='flex items-center gap-4 mb-6' >
                        <div className='w-[50px] h-[50px] flex items-center justify-center rounded-full border-2 border-stone-600'>
                            <CheckIcon className='scale-[1.2]' />
                        </div>
                        <div>
                            <p className='text-[14px] text-gray-500'>Confirmation #FHYWATYP3</p>
                            <p className='text-[20px] font-black text-stone-900'>Thank you, {"Muneeb"}!</p>
                        </div>
                    </div>

                    <div className='p-4 border border-stone-200 rounded-md flex flex-col gap-4'>
                        <p className='text-[18px] font-black text-stone-900'>Your order is confirmed</p>
                        <p className='text-[16px] text-stone-700'>You'll receive a confirmation email with your order number shortly.</p>
                    </div>

                    <div className='p-4 border border-stone-200 rounded-md'>
                        <p className='text-[18px] font-black text-stone-900 w-full mb-5'>Order details</p>


                        <p className='text-[16px] font-black text-stone-900 mt-3'>Contact information</p>
                        <p className='text-[16px] text-stone-700'>test@gmail.com</p>

                        <p className='text-[16px] font-black text-stone-900 mt-3'>Shipping address</p>
                        <p className='text-[16px] text-stone-700'>Nazimabad</p>
                        <p className='text-[16px] text-stone-700'>Karachi 76400</p>
                        <p className='text-[16px] text-stone-700'>Pakistan</p>
                        <p className='text-[16px] text-stone-700'>03102223511</p>

                        <p className='text-[16px] font-black text-stone-900 mt-3'>Shipping method</p>
                        <p className='text-[16px] text-stone-700'>Delivery Charges</p>



                        <p className='text-[16px] font-black text-stone-900 mt-3'>Payment method</p>
                        <p className='text-[16px] text-stone-700'>Cash on Delivery (COD) • Rs. {Number("5600").toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>



                        <div></div>
                    </div>
                </div>
                :

                <form onSubmit={handle_submit} className="flex-[1] md:px-[40px] py-[40px] flex flex-col gap-4 lg:border-r border-stone-200 tracking-wider">
                    <h1 className='text-[20px] font-bold'>Contact</h1>

                    <TextField
                        label="Email"
                        variant="outlined"
                        className='w-full'
                        name="email"
                        onChange={handleChange}
                        error={Boolean(order_details.errors.email)}
                        helperText={order_details.errors.email}
                        sx={style_textfield}
                    />

                    <h1 className='text-[20px] font-bold pt-4'>Delivery</h1>

                    <div className='flex flex-col md:flex-row gap-4 md:gap-3'>
                        <TextField
                            label="First name"
                            variant="outlined"
                            className='w-full'
                            name="firstName"
                            onChange={handleChange}
                            error={Boolean(order_details.errors.firstName)}
                            helperText={order_details.errors.firstName}
                            sx={style_textfield}
                        />
                        <TextField
                            label="Last name"
                            variant="outlined"
                            className='w-full'
                            name="lastName"
                            onChange={handleChange}
                            error={Boolean(order_details.errors.lastName)}
                            helperText={order_details.errors.lastName}
                            sx={style_textfield}
                        />
                    </div>

                    <TextField
                        label="Address"
                        variant="outlined"
                        className='w-full'
                        name="address"
                        onChange={handleChange}
                        error={Boolean(order_details.errors.address)}
                        helperText={order_details.errors.address}
                        sx={style_textfield}
                    />

                    <div className='flex flex-col md:flex-row gap-4 md:gap-3'>
                        <TextField
                            label="City"
                            variant="outlined"
                            className='w-full'
                            name="city"
                            onChange={handleChange}
                            error={Boolean(order_details.errors.city)}
                            helperText={order_details.errors.city}
                            sx={style_textfield}
                        />
                        <TextField
                            label="Postal code (optional)"
                            variant="outlined"
                            className='w-full'
                            name="postalCode"
                            onChange={handleChange}
                            sx={style_textfield}
                        />
                    </div>

                    <TextField
                        label="Phone"
                        variant="outlined"
                        className='w-full'
                        name="phone"
                        placeholder='0310 2223511'
                        onChange={handleChange}
                        error={Boolean(order_details.errors.phone)}
                        helperText={order_details.errors.phone}
                        sx={style_textfield}
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment
                                    position="end"
                                    className='text-stone-800 cursor-pointer'
                                >
                                    <Tooltip
                                        title="In case we need to contact you about your order"
                                        placement="top"
                                        arrow
                                        componentsProps={{
                                            tooltip: {
                                                sx: {
                                                    backgroundColor: 'black',
                                                    color: 'white', // Text color
                                                    fontSize: '12px', // Adjust text size
                                                    padding: '10px', // Optional: adjust padding
                                                    width: '150px',
                                                    textAlign: 'center'
                                                },
                                            },
                                        }}
                                    >
                                        <HelpOutlineIcon />
                                    </Tooltip>
                                </InputAdornment>,
                            },
                        }}
                    />

                    <div className='w-full flex items-center text-[14px] md:text-[16px] font-medium text-stone-900'>
                        <Checkbox />
                        <p>Save this information for next time</p>
                    </div>

                    <h1 className='text-[16px] font-bold'>Shipping method</h1>
                    <TextField
                        value="Delivery Charges"
                        variant="outlined"
                        className='w-full cursor-pointer'
                        sx={style_textfield_2}
                        slotProps={{
                            input: {
                                readOnly: true,
                                endAdornment: <InputAdornment position="end" className='text-stone-800'>Rs. 200.00</InputAdornment>,
                            },
                        }}
                    />

                    <h1 className='text-[20px] font-bold pt-4'>Payment</h1>
                    <TextField
                        value="Cash on Delivery (COD)"
                        variant="outlined"
                        className='w-full cursor-pointer'
                        sx={style_textfield_2}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                    />

                    {/* Complete Order Button */}
                    <button type='submit' className='w-full py-[16px] flex justify-center items-center text-white bg-stone-950 font-black text-[14px] md:text-[15px] hover:bg-white hover:text-stone-950 border border-stone-500 tracking-widest transition-all duration-300 rounded mt-6 lg:mb-20'>
                        COMPLETE ORDER
                    </button>
                </form>
            }

            {/* Sticky Sidebar */}
            <div className="flex-[1]">
                <div className="sticky top-0 md:px-[40px] py-[40px] flex flex-col gap-2">
                    {/* Product price */}
                    <div className="w-full border-stone-300 flex items-center justify-between tracking-wider my-1">
                        <div className="flex items-center gap-4">
                            <Badge
                                badgeContent={1}
                                color="info"
                                showZero
                            >
                                <div className="w-[65px] h-[65px] border border-stone-300 shadow grid place-items-center rounded-md">
                                    <Image
                                        alt="product"
                                        src={product_1}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </Badge>
                            <div className="text-stone-950 text-[14px] font-semibold">
                                <p>Vans</p>
                                <p className="text-gray-600 font-normal">44 / Very Good</p>
                            </div>
                        </div>
                        <p className="text-[15px] md:text-[17px] font-semibold text-stone-950">
                            Rs. 39,000
                        </p>
                    </div>


                    {/* Subtotal of Order */}
                    <div className="w-full mt-6 border-stone-300 flex items-center justify-between tracking-wider">
                        <p className="text-[14px] md:text-[16px] font-semibold text-black">
                            Subtotal • {"2" + " items"}
                        </p>
                        <p className="text-[15px] md:text-[17px] font-semibold text-stone-950">
                            Rs. 39,000
                        </p>
                    </div>

                    {/* Shipping Cost */}
                    <div className="w-full border-stone-300 flex items-center justify-between tracking-wider">
                        <p className="text-[14px] md:text-[16px] font-semibold text-black">
                            Shipping
                        </p>
                        <p className="text-[15px] md:text-[17px] font-semibold text-stone-950">
                            Rs. 200
                        </p>
                    </div>

                    {/* Total */}
                    <div className="w-full border-stone-300 flex items-center justify-between tracking-wider mt-6">
                        <p className="text-[18px] md:text-[20px] font-black text-black">TOTAL:</p>
                        <p className="text-[18px] md:text-[20px] font-black text-stone-950">
                            <span className='text-[13px] md:text-[14px] text-gray-600 font-normal pr-[6px]'>PKR</span>
                            Rs. 39,350
                        </p>
                    </div>

                </div>
            </div>



        </div>
    )
}

export default Checkouts_page