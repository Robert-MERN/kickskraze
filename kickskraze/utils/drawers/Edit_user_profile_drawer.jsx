import React, { useEffect, useState } from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import useStateContext from '@/context/ContextProvider';
import styles from "@/styles/home.module.css";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import StoreIcon from '@mui/icons-material/Store';
import { TextField } from '@mui/material'
import { FaUserCog } from "react-icons/fa";
import { Skeleton } from '@mui/material';




const Edit_user_profile_drawer = ({ drawer_state, toggle_drawer, toggle_modal, axios }) => {

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


    const { set_API_loading, update_user_api, get_user_api, modal_user_id, get_all_users_api, set_all_users_details, user } = useStateContext();

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
    const [is_loading, set_is_loading] = useState(true);

    useEffect(() => {
        if (drawer_state.edit_user_profile_drawer) {
            get_user_api(axios, modal_user_id, set_user_details, set_is_loading);
        }

    }, [drawer_state.edit_user_profile_drawer]);

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

                console.log(user);
                update_user_api(axios, modal_user_id, otherData, set_API_loading);
                await get_all_users_api(axios, user.id, set_all_users_details, set_API_loading);

            }
        } catch (err) {
            console.error(err);
        } finally {
            set_API_loading(false);
        }
    };

    // Close Drawer
    const close_drawer = () => {
        toggle_drawer("edit_user_profile_drawer");
        set_user_details({ ...default_user_details });
    }

    // Delete User Button
    const delete_user_btn = () => {
        toggle_modal("delete_user_modal");
    }



    return (
        <SwipeableDrawer
            open={drawer_state.edit_user_profile_drawer}
            onClose={close_drawer}
            onOpen={close_drawer}
        >
            <div className={`w-screen ${styles.scroll_bar} overflow-x-hidden`} >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50 sticky top-0 z-10' >
                    <h1 className='text-[15px] md:text-[18px] font-semibold text-stone-700 flex items-center gap-2'>
                        <FaUserCog className='text-[18px] lg:text-[24px] ml-1' />
                        Update User
                    </h1>
                    <IconButton onClick={close_drawer}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>

                <>

                    {is_loading ?
                        // Skeleton Loading State
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
                                    className='w-[100px] md:w-[140px] h-[30px] mt-2'

                                />

                                <Skeleton
                                    variant='rounded'
                                    animation="wave"
                                    className='w-[140px] md:w-[180px] h-[30px] mt-2'

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
                        :
                        <div className='w-full px-[20px]'>

                            <div className='w-full h-full' >
                                <form onSubmit={handle_submit} className="flex-[1] md:px-[20px] py-[20px] flex flex-col gap-y-6">

                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        className='w-full'
                                        name="firstName"
                                        size="small"
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
                                        size="small"
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
                                        size="small"
                                        value={user_details.email}
                                        onChange={handleChange}
                                        error={Boolean(user_details.errors.email)}
                                        helperText={user_details.errors.email}
                                        sx={style_textfield}
                                    />

                                    <FormControl
                                        className='w-full'
                                        variant="outlined"
                                        size='small'
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

                                    {user?.parentAdmin && (
                                        <FormControl
                                            className='w-full'
                                            variant="outlined"
                                            sx={style_textfield}
                                            size='small'
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
                                    )}




                                    <TextField
                                        label="Password"
                                        variant="outlined"
                                        className='w-full'
                                        name="password"
                                        size="small"
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
                                        size="small"
                                        value={user_details.confirm_password}
                                        onChange={handleChange}
                                        error={Boolean(user_details.errors.confirm_password)}
                                        helperText={user_details.errors.confirm_password}
                                        sx={style_textfield}
                                    />


                                    <div className='w-full flex justify-between items-center'>
                                        <button type="button" onClick={delete_user_btn} className='w-fit px-[8px] lg:px-[18px] py-[6px] bg-red-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[12px] md:text-[14px]'>
                                            Delete
                                        </button>

                                        <div className="w-full flex justify-end my-[30px] gap-2 lg:gap-4">
                                            <button type="button" onClick={close_drawer} className='w-fit px-[8px] lg:px-[18px] py-[6px] bg-stone-400 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[12px] md:text-[14px]'>
                                                Cancel
                                            </button>
                                            <button type='submit' className='w-fit px-[8px] lg:px-[18px] py-[6px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[12px] md:text-[14px]'>
                                                Update
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>

                        </div>
                    }
                </>



            </div>

        </SwipeableDrawer>
    )
}

export default Edit_user_profile_drawer