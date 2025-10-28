import Image from 'next/image'
import React, { useState } from 'react'
import Fade from "react-reveal/Fade";
import useStateContext from '@/context/ContextProvider';
import styles from "@/styles/home.module.css";
import logo from "@/public/images/logo.png"
import logo_white from "@/public/images/logo_white.png"
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';

const Login_page = ({ axios }) => {
    const { login_api, set_API_loading } = useStateContext();

    const [form_state, set_form_state] = useState({
        email: '',
        password: '',
        show_password: false,
        errors: {
            email: '',
            password: '',
        },
    });

    const validate_form = (field_name, value) => {
        let error = '';
        switch (field_name) {
            case 'email':
                if (!value) {
                    error = 'Please enter an email';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                    error = 'Invalid email address';
                }
                break;
            case 'password':
                if (!value) {
                    error = 'Please enter a password';
                }
                break;
            default:
                break;
        }
        return error;
    }

    const handle_blur = (event) => {
        const { name, value } = event.target;
        const error = validate_form(name, value);
        set_form_state((prev_state) => ({
            ...prev_state,
            errors: {
                ...prev_state.errors,
                [name]: error,
            },
        }));
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        set_form_state((prev_state) => ({
            ...prev_state,
            [name]: value.trim(),
        }));
    }

    const handle_click_show_password = () => {
        set_form_state({
            ...form_state,
            show_password: !form_state.show_password,
        });
    };

    const handle_mouse_down_password = (event) => {
        event.preventDefault();
    };

    const handle_submit = (e) => {
        e.preventDefault();
        const errors = {};
        Object.keys(form_state).forEach((field_name) => {
            const error = validate_form(field_name, form_state[field_name]);
            if (error) {
                errors[field_name] = error;
            }
        });
        set_form_state((prev_state) => ({
            ...prev_state,
            errors,
        }));
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            const { show_password, errors, ...other } = form_state;
            login_api(axios, other, set_API_loading);
        }
    }
    return (
        <div className='w-screen h-screen' >

            <Fade duration={500} >
                <div className={`w-screen h-screen  overflow-y-auto ${styles.scroll_bar}`} >

                    <Fade duration={500} >

                        <div className='flex h-full' >
                            <div className='flex-1 flex flex-col md:justify-center items-center  bg-slate-100 mt-[50px] md:mt-0'>

                                <div className='w-full flex justify-center md:hidden mb-4'>
                                    <div className='w-[180px] relative p-2' >
                                        <Image className='object-contain w-full h-full' alt="logo Image" src={logo} />
                                    </div>
                                </div>
                                {/* Login Form */}
                                <Fade>
                                    <form onSubmit={handle_submit} className='flex flex-col gap-8 px-[20px] h-fit' >
                                        <div className='flex flex-col w-full gap-1 justify-center' >
                                            <p className='text-[20px] md:text-[30px] font-semibold text-slate-700' >
                                                Welcome To KicksKraze
                                            </p>
                                            <p className='text-[13px] md:text-[15px] font-semibold text-slate-500' >KicksKraze admin page, please enter your details.</p>
                                        </div>


                                        <div className='w-full flex flex-col gap-6' >
                                            <div className='w-full' >
                                                <label
                                                    htmlFor=""
                                                    className={`text-stone-800 font-semibold text-[13px] md:text-[15px]`}
                                                >
                                                    Email
                                                </label>
                                                <FormControl
                                                    className='w-full mt-1 md:mt-2'
                                                >
                                                    <TextField
                                                        name="email"
                                                        size='small'
                                                        placeholder="Enter your Email"
                                                        error={Boolean(form_state.errors.email)}
                                                        helperText={form_state.errors.email}
                                                        onBlur={handle_blur}
                                                        onChange={handleChange}
                                                        value={form_state.email}
                                                    />
                                                </FormControl>
                                            </div>

                                            <div className='w-full' >
                                                <label
                                                    htmlFor=""
                                                    className={`text-stone-800 font-semibold text-[13px] md:text-[15px]`}
                                                >
                                                    Password
                                                </label>
                                                <FormControl
                                                    className='w-full mt-1 md:mt-2'
                                                    variant="outlined"
                                                    size='small'
                                                >
                                                    <OutlinedInput
                                                        placeholder="Enter your Password"
                                                        type={form_state.show_password ? 'text' : 'password'}
                                                        value={form_state.password}
                                                        name="password"
                                                        error={Boolean(form_state.errors.password)}
                                                        helpertext={form_state.errors.password}
                                                        onBlur={handle_blur}
                                                        onChange={handleChange}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handle_click_show_password}
                                                                    onMouseDown={handle_mouse_down_password}
                                                                    edge="end"
                                                                >
                                                                    {form_state.show_password ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }

                                                    />
                                                    {form_state.errors.password && <FormHelperText error>{form_state.errors.password}</FormHelperText>}
                                                </FormControl>
                                            </div>
                                        </div>

                                        <button className='bg-black text-slate-100 text-[15px] md:text-[17px] w-full py-[8px] rounded-md my-6 hover:opacity-80 transition-all ' >Sign in</button>

                                        {/* <div>
                                            <p className='text-[13px] text-stone-500 text-center' >Don't have an account?<span onClick={() => router.push("/signup")} className='font-bold cursor-pointer hover:underline ' > Sign up</span> </p>
                                        </div> */}

                                    </form>
                                </Fade>
                            </div>
                            <div className='flex-1 place-items-center bg-stone-950 md:grid hidden' >
                                <div className='md:w-[400px] lg:w-[480px] xl:w-[600px] relative p-2' >
                                    <Image className='object-contain w-full h-full' alt="logo_white Image" src={logo_white} />
                                </div>
                            </div>
                        </div>
                    </Fade>

                </div >
            </Fade>
        </div >
    )
}

export default Login_page