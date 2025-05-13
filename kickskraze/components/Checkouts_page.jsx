import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Badge from "@mui/material/Badge";
import Link from 'next/link';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { calc_gross_total_amount, calc_total_amount, calc_total_items, capitalizeWords, select_store_name, select_thumbnail_from_media } from '@/utils/functions/produc_fn';
import useStateContext from '@/context/ContextProvider';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Autocomplete, FormHelperText, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { MetaPixel } from '@/lib/fpixel';
import { PK_cities } from '@/utils/shoes_info_list';


const Checkouts_page = ({ axios }) => {

    const { confirm_order_api, set_API_loading, set_snackbar_alert } = useStateContext();

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
        country: "pakistan",
        phone: "",
        delivery_charges: 200,
        purchase: [],
        total_amount: "",
        subtotal_amount: "",
        total_items: "",
        coupon_code: "",
        special_instructions: "",
        payment_method: "",
        status: "booked",
        verification: "unverified",
        store_name: "",
        errors: {
            email: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            phone: "",
            payment_method: "",
        }
    }
    const [order_details, set_order_details] = useState(default_order_details);

    const [is_loading, set_is_loading] = useState(true)

    const payment_method = {
        cod: "Cash on Delivery (COD)",
        jazzcash: "Pay with JazzCash (JazzCash)",
        easypaisa: "Pay with EasyPaisa (EasyPaisa)",
        sadapay: "Pay with SadaPay (SadaPay)",
        nayapay: "Pay with NayaPay (NayaPay)",
        bank: "Bank Transfer (Bank)",
    };

    const payment_method_icons = {
        cod: <img src="/images/cod.png" className='w-[32px] h-[32px] object-contain mr-[6px] ml-2' />,
        jazzcash: <img src="/images/jazzcash.png" className='w-[40px] h-[40px] object-contain mr-[3px] ml-1' />,
        easypaisa: <img src="/images/easypaisa.png" className='w-[27px] h-[27px] object-contain mx-[10px]' />,
        sadapay: <img src="/images/sadapay.png" className='w-[38px] h-[38px] object-contain mx-[5px]' />,
        nayapay: <img src="/images/nayapay.png" className='w-[35px] h-[35px] object-contain mx-[6px]' />,
        bank: <AccountBalanceIcon className='ml-[10px] mr-[10px] text-[26px]' />,
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        set_order_details((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }



    // Retreiving cart and other information from the local storage
    useEffect(() => {
        set_is_loading(true)
        const fetch = async () => {
            try {
                const cart = await JSON.parse(localStorage.getItem("cart"));
                if (cart) {
                    set_order_details(prev => ({ ...prev, purchase: cart }));
                }
            } catch (err) {
                // console.error(err);
            } finally {
                set_is_loading(false);
            }
        };
        fetch();
    }, []);


    const phone_regex = /^(?:(?:\+92|0092|92|0)?3\d{9})$/;
    
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
                    error = 'Please enter a valid phone number e.g. "03102223511"';
                }
                break;
            case 'purchase':
                if (!value.length) {
                    set_snackbar_alert({
                        open: true,
                        message: "Cart doesn't exist",
                        severity: "error"
                    })
                }
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
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            const { errors, purchase, ...other } = order_details;
            const data_body = {
                ...other,
                purchase: purchase.map(e => ({ _id: e._id, quantity: e.quantity })),
                store_name: select_store_name(purchase),
            }
            const meta_body = {
                content_ids: purchase.map((each) => each._id),
                content_type: "product_group",
                content_category: "Shoes",
                contents: purchase,
                num_items: calc_total_items(purchase),
                value: calc_gross_total_amount(order_details).toFixed(2),
                currency: "PKR"
            }
            MetaPixel.trackEvent("Purchase", meta_body);
            confirm_order_api(axios, data_body, set_API_loading);


        }
    }


    const bank_accounts = {
        easypaisa_muneeb: {
            heading: "EasyPaisa Account Details:",
            icon: <img src="/images/easypaisa.png" className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] object-contain ml-[5px]' />,
            bank_name: "EasyPaisa / Telenor Microfinance Bank",
            account_title: "Muneeb Ahmed",
            account_no: "03197705931",
        },
        easypaisa_babu: {
            heading: "EasyPaisa Account Details:",
            icon: <img src="/images/easypaisa.png" className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] object-contain ml-[5px]' />,
            bank_name: "EasyPaisa / Telenor Microfinance Bank",
            account_title: "MUHAMMAD SHEHROZ SHAHID",
            account_no: "03152495096",
        },
        jazzcash_muneeb: {
            icon: <img src="/images/jazzcash.png" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain' />,
            heading: "JazzCash Account Details:",
            bank_name: "JazzCash Mobilink",
            account_title: "Muneeb Ahmed",
            account_no: "03197705931",
        },
        jazzcash_babu: {
            icon: <img src="/images/jazzcash.png" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain' />,
            heading: "JazzCash Account Details:",
            bank_name: "JazzCash Mobilink",
            account_title: "MUHAMMAD SHEHROZ SHAHID",
            account_no: "03079077079",
        },
        sadapay_muneeb: {
            icon: <img src="/images/sadapay.png" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain' />,
            heading: "SadaPay Account Details:",
            bank_name: "SadaPay",
            account_title: "Muneeb Ahmed",
            account_no: "03102223511",
            iban: "PK03SADA0000003102223511",
        },
        sadapay_babu: {
            icon: <img src="/images/sadapay.png" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain' />,
            heading: "SadaPay Account Details:",
            bank_name: "SadaPay",
            account_title: "Muhammad Shahroz Shahid",
            account_no: "03152495096",
            iban: "PK42SADA0000003152495096",
        },
        nayapay_muneeb: {
            icon: <img src="/images/nayapay.png" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain' />,
            heading: "NayaPay Account Details:",
            bank_name: "NayaPay",
            account_title: "Muneeb Ahmed",
            account_no: "03102223511",
            iban: "PK39NAYA1234503102223511",
        },
        nayapay_babu: {
            icon: <img src="/images/nayapay.png" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain' />,
            heading: "NayaPay Account Details:",
            bank_name: "NayaPay",
            account_title: "MUHAMMAD SHEHROZ SHAHID",
            account_no: "03152495096",
            iban: "PK78NAYA1234503152495096",
        },
        bank_muneeb: {
            icon: <AccountBalanceIcon className='text-[26px] md:text-[34px] ml-[7px]' />,
            heading: "Bank Account Details:",
            bank_name: "Meezan Bank",
            account_title: "BEENISH RAHEEL",
            account_no: "01870106443434",
            iban: "PK26MEZN0001870106443434",
        },
        bank_babu: {
            icon: <AccountBalanceIcon className='text-[26px] md:text-[34px] ml-[7px]' />,
            heading: "Bank Account Details:",
            bank_name: "Meezan Bank",
            account_title: "MUHAMMAD SHEHROZ SHAHID",
            account_no: "10270109202415",
            iban: "PK56MEZN0010270109202415",
        },
    }

    const copy_to_clipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            set_snackbar_alert({
                open: true,
                message: "Copied!",
                severity: "primary",
            })

        } catch (err) {
            console.error("Failed to copy text: ", err);
            set_snackbar_alert({
                open: true,
                message: "Failed to copy!",
                severity: "error",
            });
        }
    };

    const choose_ac = (_order_details) => {
        const { payment_method, purchase } = _order_details;

        if (purchase.every(e => e.brand === "Converse" || e.brand === "Vans")) {
            const account = bank_accounts[`${payment_method}_muneeb`];
            if (account) return account;
            return null
        } else {
            const account = bank_accounts[`${payment_method}_muneeb`];
            if (account) return account;
            return null
        };

    }

    return (
        <div className='w-full px-[20px] flex flex-col lg:flex-row'>


            {/* Main Content Section */}
            {is_loading ?
                <></>

                : Boolean(order_details.purchase.length) ?
                    <>

                        {/* Product Details for Mobile view */}
                        <div className="flex-[1] lg:hidden">
                            <div className="md:px-[40px] pt-[40px] flex flex-col gap-2">
                                {/* Product price */}

                                {order_details.purchase.map((item) => (
                                    <div key={item._id} className="w-full border-stone-300 flex items-center justify-between  my-1">
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
                                        <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                            Rs. {Number(item.price).toLocaleString("en-US")}
                                        </p>
                                    </div>
                                ))}


                                {/* Subtotal of Order */}
                                <div className="w-full mt-6 border-stone-300 flex items-center justify-between ">
                                    <p className="text-[14px] md:text-[16px] font-medium text-stone-800">
                                        Subtotal {(calc_total_items(order_details.purchase) > 1) && `• ${calc_total_items(order_details.purchase)}  items`}
                                    </p>
                                    <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                        Rs. {calc_total_amount(order_details.purchase).toLocaleString("en-US")}
                                    </p>
                                </div>

                                {/* Shipping Cost */}
                                <div className="w-full border-stone-300 flex items-center justify-between ">
                                    <p className="text-[14px] md:text-[16px] font-medium text-stone-800">
                                        Shipping
                                    </p>
                                    <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                        Rs. {Number(order_details.delivery_charges).toLocaleString("en-US")}
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
                                            Rs. {calc_gross_total_amount(order_details).toLocaleString("en-US")}
                                        </span>
                                    </p>
                                </div>

                            </div>
                        </div>


                        {/* Form */}
                        <form onSubmit={handle_submit} className="flex-[1] md:px-[40px] py-[40px] flex flex-col gap-4 lg:border-r border-stone-200 r">
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
                                <Autocomplete
                                    className="w-full"
                                    options={PK_cities}
                                    freeSolo // Allows custom values
                                    getOptionLabel={(option) => option} // Display title in the input
                                    value={order_details.city || null} // Use the entered value if not found in options
                                    onChange={(event, new_value) => {
                                        handleChange({ target: { name: "city", value: capitalizeWords(new_value) } });
                                    }}
                                    onInputChange={(event, new_value) => {
                                        if (event) {
                                            handleChange({ target: { name: "city", value: capitalizeWords(new_value) } });
                                        }
                                    }}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            <li key={option} {...optionProps}>
                                                {option}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={Boolean(order_details.errors.city)}
                                            helperText={order_details.errors.city}
                                            label="City"
                                        />
                                    )}
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
                                inputProps={{
                                    readOnly: true, // Read-only input
                                    style: { cursor: "default" }, // Ensure pointer style is applied to the input element
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" className='text-stone-800'>Rs. {order_details.delivery_charges}.00</InputAdornment>,
                                }}
                            />

                            <h1 className='text-[20px] font-bold pt-4'>Payment</h1>
                            <FormControl
                                className='w-full'
                                variant="outlined"

                                error={Boolean(order_details.errors.payment_method)}
                                sx={style_textfield}
                            >
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    name="payment_method"
                                    label="Payment Method"
                                    onChange={handleChange}
                                    value={order_details.payment_method}
                                    renderValue={(select) => payment_method[select]}
                                >
                                    <MenuItem disabled value="">
                                        <em>Select Payment Method</em>
                                    </MenuItem>
                                    {Object.entries(payment_method).map(([key, value]) => (
                                        <MenuItem key={key} value={key} >
                                            {payment_method_icons[key]}
                                            <p>{value}</p>
                                        </MenuItem>

                                    ))}
                                </Select>
                                {Boolean(order_details.errors.payment_method) && <FormHelperText>{order_details.errors.payment_method}</FormHelperText>}
                            </FormControl>

                            {(order_details.payment_method && choose_ac(order_details)) &&
                                <div className='text-[17px] mt-5 text-stone-700'>


                                    <div className='flex items-center gap-2 mb-6'>
                                        {choose_ac(order_details).icon}
                                        <p className='text-[19px] md:text-[21px] text-stone-700 font-bold '>
                                            {choose_ac(order_details).heading}
                                        </p>
                                    </div>

                                    <div className='flex justify-between items-center gap-4 text-[15px] md:text-[17px] pl-[7px] pr-[11px]'>
                                        <p className='font-bold whitespace-nowrap'>Bank Name:</p>
                                        <p className='text-ellipsis line-clamp-1 overflow-hidden'>{choose_ac(order_details).bank_name}</p>
                                    </div>

                                    <div className='flex justify-between items-center gap-4 text-[15px] md:text-[17px] pl-[7px] pr-[11px] mt-[4px]'>
                                        <p className='font-bold whitespace-nowrap'>Account Title:</p>
                                        <p>{choose_ac(order_details).account_title}</p>
                                    </div>

                                    <div className='flex justify-between items-center gap-4 text-[15px] md:text-[17px] pl-[7px]'>
                                        <p className='font-bold whitespace-nowrap text-center'>Account No:</p>
                                        <p>
                                            {choose_ac(order_details).account_no}
                                            <Tooltip
                                                title="Copy"
                                                placement="top"
                                                arrow
                                                componentsProps={{
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: 'black',
                                                            color: 'white', // Text color
                                                            fontSize: '12px', // Adjust text size
                                                            padding: '10px', // Optional: adjust padding
                                                            width: 'fit',
                                                            textAlign: 'center'
                                                        },
                                                    },
                                                }}
                                            >
                                                <IconButton onClick={() => copy_to_clipboard(choose_ac(order_details).account_no)}>
                                                    <ContentCopyIcon className='text-[18px] text-stone-800' />
                                                </IconButton>
                                            </Tooltip>
                                        </p>
                                    </div>

                                    {choose_ac(order_details).iban &&
                                        <div className='flex justify-between items-center gap-4 text-[15px] md:text-[17px] pl-[7px]'>
                                            <p className='font-bold whitespace-nowrap'>IBAN:</p>
                                            <p>
                                                {choose_ac(order_details).iban}
                                                <Tooltip
                                                    title="Copy"
                                                    placement="top"
                                                    arrow
                                                    componentsProps={{
                                                        tooltip: {
                                                            sx: {
                                                                backgroundColor: 'black',
                                                                color: 'white', // Text color
                                                                fontSize: '12px', // Adjust text size
                                                                padding: '10px', // Optional: adjust padding
                                                                width: 'fit',
                                                                textAlign: 'center'
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <IconButton onClick={() => copy_to_clipboard(choose_ac(order_details).iban)}>
                                                        <ContentCopyIcon className='text-[18px] text-stone-800' />
                                                    </IconButton>
                                                </Tooltip>
                                            </p>
                                        </div>
                                    }

                                    {/* Send Screenshot Section */}
                                    <div className='flex flex-col md:flex-row md:justify-between md:items-center mt-8 md:h-[50px] gap-1 md:gap-0 pl-[7px]'>
                                        <p className='flex gap-2 items-center md:justify-start justify-between text-[15px] md:text-[17px]'>
                                            <strong className='flex items-center gap-1'>
                                                <WhatsAppIcon />
                                                WhatsApp:
                                            </strong>

                                            <span className="flex items-center">
                                                <a className='hover:underline' target='_blank' href="https://wa.me/923102223511">03102223511</a>
                                                <Tooltip
                                                    title="Copy"
                                                    placement="top"
                                                    arrow
                                                    componentsProps={{
                                                        tooltip: {
                                                            sx: {
                                                                backgroundColor: 'black',
                                                                color: 'white', // Text color
                                                                fontSize: '12px', // Adjust text size
                                                                padding: '10px', // Optional: adjust padding
                                                                width: 'fit',
                                                                textAlign: 'center'
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <IconButton onClick={() => copy_to_clipboard("+923102223511")}>
                                                        <ContentCopyIcon className='text-[18px] text-stone-800' />
                                                    </IconButton>
                                                </Tooltip>
                                            </span>
                                        </p>
                                        <div className='w-full md:w-fit flex md:block justify-end pr-[11px] md:pr-0'>
                                            <a
                                                target='_blank'
                                                href="https://wa.me/923102223511"
                                                type='button'
                                                className='w-fit px-[10px] md:px-[12px] py-[6px] md:py-[8px] text-white bg-stone-950 text-[13px] md:text-[15px] transition-all rounded font-medium active:opacity-75'>
                                                Send Screenshot
                                            </a>
                                        </div>
                                    </div>

                                    <p className='mt-6 md:mt-4 text-gray-500 text-[16px] md:text-[18px] pl-[7px] pr-[11px]'>
                                        <strong className='mr-1 text-stone-800'>Note:</strong>
                                        Please share the payment screenshot on the given WhatsApp number. We'll confirm your order once received. Thank you!
                                    </p>


                                </div>
                            }

                            {/* Complete Order Button */}
                            <button type='submit' className='w-full py-[10px] md:py-[16px] flex justify-center items-center text-white bg-stone-950 font-bold text-[13px] md:text-[15px] hover:bg-white hover:text-stone-800 border border-stone-500  transition-all duration-300 rounded mt-6 lg:mb-20'>
                                COMPLETE ORDER
                            </button>
                        </form>


                        {/* Sticky Sidebar */}
                        <div className="flex-[1]">
                            <div className="sticky top-0 md:px-[40px] py-[40px] flex flex-col gap-2">
                                {/* Product price */}

                                {order_details.purchase.map((item) => (
                                    <div key={item._id} className="w-full border-stone-300 flex items-center justify-between  my-1">
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
                                        <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                            Rs. {Number(item.price).toLocaleString("en-US")}
                                        </p>
                                    </div>
                                ))}


                                {/* Subtotal of Order */}
                                <div className="w-full mt-6 border-stone-300 flex items-center justify-between ">
                                    <p className="text-[14px] md:text-[16px] font-medium text-stone-800">
                                        Subtotal {(calc_total_items(order_details.purchase) > 1) && `• ${calc_total_items(order_details.purchase)}  items`}
                                    </p>
                                    <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                        Rs. {calc_total_amount(order_details.purchase).toLocaleString("en-US")}
                                    </p>
                                </div>

                                {/* Shipping Cost */}
                                <div className="w-full border-stone-300 flex items-center justify-between ">
                                    <p className="text-[14px] md:text-[16px] font-medium text-stone-800">
                                        Shipping
                                    </p>
                                    <p className="text-[15px] md:text-[17px] font-medium text-stone-800 line-clamp-1 text-ellipsis overflow-hidden">
                                        Rs. {Number(order_details.delivery_charges).toLocaleString("en-US")}
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
                                            Rs. {calc_gross_total_amount(order_details).toLocaleString("en-US")}
                                        </span>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </>
                    :
                    <div className="w-full h-[70vh] flex flex-col justify-center items-center">

                        <h1 className='text-[16px] md:text-[18px] text-stone-500 uppercase text-center'>
                            YOU HAVE NOT SELECTED ANY ITEM TO CHECKOUT
                        </h1>

                        <div className='my-[30px] w-full flex justify-center items-center'>
                            <Link href="/collection" >
                                <button className='w-full py-[12px] text-white bg-black font-semibold text-[14px] md:text-[15px] transition-all duration-300 hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center'>
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