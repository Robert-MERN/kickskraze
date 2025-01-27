import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import useStateContext from "@/context/ContextProvider";
import Link from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from "@mui/material";


const Admin_navbar = () => {
    const { toggle_drawer, toggle_modal } = useStateContext();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #292524")
    }, []);

    return (
        <div className="px-[30px] w-full h-[70px] flex lg:justify-between items-center fixed top-0 z-10 bg-transparent  backdrop-blur-[10px] border-b border-b-slate-200">
            <div className="w-full flex lg:hidden items-center gap-6 transition-all">
                <button onClick={() => toggle_drawer("admin_menu_drawer")}>
                    <RxHamburgerMenu className="text-[26px] text-stone-800 active:text-stone-500 cursor-pointer" />
                </button>
            </div>
            <div className="flex lg:hidden w-full justify-center">
                <Link href="/">
                    <Image alt="logo" priority src={logo} className="w-[90px] object-contain" />
                </Link>
            </div>

            {/* Logo and Optoins Div */}
            <div className="hidden lg:flex items-center h-full w-full gap-16">
                {/* Logo Div */}
                <div className="w-[120px]">
                    <Link href="/" >
                        <Image alt="logo" priority src={logo} className="w-[90px] object-contain" />
                    </Link>
                </div>
            </div>

            {/* Logout Button */}
            <div className="w-full h-full flex justify-end items-center gap-6 ">

                <div>
                    <IconButton onClick={() => toggle_modal("logout_modal")}>
                        <LogoutIcon className="text-[24px] md:text-[26px] text-stone-900" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default Admin_navbar;
