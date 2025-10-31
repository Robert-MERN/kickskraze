import React, { useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import StoreIcon from '@mui/icons-material/Store';
import { TextField } from '@mui/material'
import { useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import { FaUserCog } from "react-icons/fa";


const Update_user = ({ axios, user: USER }) => {

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


    const { set_API_loading, update_user_api, get_user_api, get_all_users_api, set_all_users_details, toggle_modal, } = useStateContext();

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

    useEffect(() => {
        if (USER) {
            get_user_api(axios, USER.id, set_user_details, set_API_loading);
        }
    }, [USER]);

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
                if (value && !password_regex.test(value)) {
                    error = 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character, and have no spaces';
                }
                break;
            case 'confirm_password':
                if (value && value !== user_details.password) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }
        return error;
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

                await update_user_api(axios, user.id, otherData, set_API_loading);
                await get_user_api(axios, user.id, set_user_details, set_API_loading);

            }
        } catch (err) {
            console.error(err);
        } finally {
            set_API_loading(false);
        }
    };



    return (

        <div className='w-full h-full' >
            <form onSubmit={handle_submit} className="flex-[1] md:px-[40px] py-[40px] flex flex-col gap-y-6 border-stone-200 rounded-2xl md:shadow-md">

                <h1 className='text-[17px] lg:text-[19px] font-semibold text-stone-700 mb-[15px] flex items-center gap-2'>
                    <FaUserCog className='text-[24px] lg:text-[30px] ml-1' />
                    Your Profile
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



                <div className="w-full flex justify-end my-[30px] gap-4 lg:gap-6">
                    {!user_details.parentAdmin &&
                        <>
                            <button type='button' onClick={() => toggle_modal("delete_user_modal")} className='w-fit px-[14px] lg:px-[28px] py-[8px] bg-red-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[14px]'>
                                DELETE
                            </button>
                        </>
                    }
                    <button type='submit' className='w-fit px-[14px] lg:px-[28px] py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[14px]'>
                        UPDATE
                    </button>
                </div>

            </form>
        </div>



    )
}


export default Update_user