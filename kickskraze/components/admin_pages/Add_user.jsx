import React from 'react'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import StoreIcon from '@mui/icons-material/Store';
import { TextField } from '@mui/material'
import { FaUserPlus } from "react-icons/fa";
import { useState, useEffect } from 'react';
import useStateContext from '@/context/ContextProvider';
import Link from 'next/link';


const Add_user = ({ axios, user: USER }) => {

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
    };


    const { set_API_loading, add_user_api, user, set_user, get_user_api } = useStateContext();

    const [is_loading, set_is_loading] = useState(true);

    useEffect(() => {
        get_user_api(axios, USER.id, set_user, set_is_loading);
    }, [USER]);


    const default_user_details = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        isAdmin: false,
        store_name: "",
        confirm_password: "",
        errors: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            isAdmin: false,
            store_name: "",
            confirm_password: "",

        }
    }

    const [user_details, set_user_details] = useState({ ...default_user_details });

    const handleChange = (e) => {
        const { name, value } = e.target;
        set_user_details((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const password_regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;

    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'email':
                if (!value) {
                    error = 'Please enter an email';
                } else if (!email_regex.test(value)) {
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
            case 'store_name':
                if (!value) {
                    error = 'Please select a store name';
                }
                break;
            case 'isAdmin':
                if (value === "") {
                    error = 'Please select a user role';
                }
                break;
            case 'password':
                if (!value) {
                    error = 'Please enter a password';
                } else if (!password_regex.test(value)) {
                    error = 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character, and have no spaces';
                }
                break;
            case 'confirm_password':
                if (!value) {
                    error = 'Please confirm your password';
                } else if (value !== user_details.password) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }
        return error;
    }

    const reset_all = () => {
        set_user_details({ ...default_user_details });
    }

    const handle_submit = async (e) => {
        e.preventDefault();
        set_API_loading(true);

        try {

            const errors = {};
            Object.keys(user_details).forEach((fieldName) => {
                const error = validateField(fieldName, user_details[fieldName]);
                if (error) {
                    errors[fieldName] = error;
                }
            });
            set_user_details((prevState) => ({
                ...prevState,
                errors,
            }));


            if (Object.values(errors).every((error) => !error)) {

                // Form is valid, submit it
                const { errors, confirm_password, ...otherData } = user_details;


                await add_user_api(axios, user_details, set_API_loading, reset_all);

            }
        } catch (err) {
            console.error(err);
        } finally {
            set_API_loading(false);
        }
    };



    return (

        <div className='w-full h-full' >
            {is_loading ?
                // Loading State
                <p className='text-[16px] md:text-[20px] text-center h-full flex items-center justify-center text-stone-500 font-medium' >
                    Loading...
                </p>
                :
                <>
                    {/* Show Form if user is Admin or Parent Admin */}
                    {(user?.isAdmin || user?.parentAdmin) ?
                        <form onSubmit={handle_submit} className="flex-[1] md:px-[40px] py-[40px] flex flex-col gap-y-6 border-stone-200 rounded-2xl md:shadow-md">

                            <h1 className='text-[17px] lg:text-[19px] font-semibold text-stone-700 mb-[15px] flex items-center gap-2'>
                                <FaUserPlus className='text-[24px] lg:text-[30px] ml-1' />
                                Add User
                            </h1>



                            <TextField
                                label="First Name"
                                variant="outlined"
                                className='w-full'
                                name="firstName"
                                size="medium"
                                value={user_details.firstName}
                                onChange={handleChange}
                                error={Boolean(user_details.errors.firstName)}
                                helperText={user_details.errors.firstName}
                                sx={style_textfield}
                            />

                            <TextField
                                label="Last Name"
                                variant="outlined"
                                className='w-full'
                                name="lastName"
                                size="medium"
                                value={user_details.lastName}
                                onChange={handleChange}
                                error={Boolean(user_details.errors.lastName)}
                                helperText={user_details.errors.lastName}
                                sx={style_textfield}
                            />

                            <TextField
                                label="Email"
                                variant="outlined"
                                className='w-full'
                                name="email"
                                size="medium"
                                value={user_details.email}
                                onChange={handleChange}
                                error={Boolean(user_details.errors.email)}
                                helperText={user_details.errors.email}
                                sx={style_textfield}
                            />

                            <FormControl
                                className='w-full'
                                variant="outlined"
                                size="medium"
                                error={Boolean(user_details.errors.store_name)}
                                sx={style_textfield}
                            >
                                <InputLabel>Store Name</InputLabel>
                                <Select
                                    name="store_name"
                                    label="Store Name"
                                    onChange={handleChange}
                                    value={user_details.store_name}
                                    renderValue={selected => selected}
                                >
                                    <MenuItem value="Footwear">
                                        <StoreIcon className='mr-2 text-stone-600' />
                                        <p>Footwear</p>
                                    </MenuItem>
                                    <MenuItem value="Apparel">
                                        <StoreIcon className='mr-2 text-stone-600' />
                                        <p>Apparel</p>
                                    </MenuItem>
                                    <MenuItem value="Jewelry">
                                        <StoreIcon className='mr-2 text-stone-600' />
                                        <p>Jewelry</p>
                                    </MenuItem>
                                </Select>
                                {Boolean(user_details.errors.store_name) && <FormHelperText>{user_details.errors.store_name}</FormHelperText>}
                            </FormControl>


                            {user?.parentAdmin &&
                                <FormControl
                                    className='w-full'
                                    variant="outlined"
                                    sx={style_textfield}
                                    size='medium'
                                >
                                    <InputLabel id="isAdmin-label">User Role</InputLabel>
                                    <Select
                                        labelId="user-role-lablel"
                                        name="isAdmin"
                                        label="User Role"
                                        onChange={handleChange}
                                        value={user_details.isAdmin}
                                        renderValue={selected => selected ? "Admin" : "User"}
                                    >
                                        <MenuItem value={true}>
                                            Admin
                                        </MenuItem>
                                        <MenuItem value={false}>
                                            User
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            }


                            <TextField
                                label="Password"
                                variant="outlined"
                                className='w-full'
                                name="password"
                                size="medium"
                                value={user_details.password}
                                onChange={handleChange}
                                error={Boolean(user_details.errors.password)}
                                helperText={user_details.errors.password}
                                sx={style_textfield}
                            />


                            <TextField
                                label="Confirm Password"
                                variant="outlined"
                                className='w-full'
                                name="confirm_password"
                                size="medium"
                                value={user_details.confirm_password}
                                onChange={handleChange}
                                error={Boolean(user_details.errors.confirm_password)}
                                helperText={user_details.errors.confirm_password}
                                sx={style_textfield}
                            />



                            <div className="w-full flex justify-end my-[30px]">
                                <button type='submit' className='w-full lg:w-fit lg:px-[28px] py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[14px]'>
                                    SAVE
                                </button>
                            </div>

                        </form>
                        :
                        // Show No Permission Message
                        <div className='h-[50%] flex flex-col gap-4 justify-end items-center'>
                            <p className='text-[17px] md:text-[22px] text-center text-stone-500 font-medium' >
                                You do not have permission to view this page.
                            </p>
                            <Link href="/admin">
                                <button className={`text-white text-[14px] md:text-[16px] font-medium px-[13px] md:px-[30px] py-[6px] md:py-[8px] cursor-pointer transition-all bg-black hover:opacity-75 duration-300`}>Go back</button>
                            </Link>
                        </div>
                    }
                </>
            }
        </div>



    )
}

export default Add_user