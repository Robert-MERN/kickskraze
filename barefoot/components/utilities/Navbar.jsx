import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import Badge from "@mui/material/Badge";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import useStateContext from "@/context/ContextProvider";
import { RiAccountCircleLine } from "react-icons/ri";


const Navbar = () => {
    const { toggle_drawer } = useStateContext();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #292524")
    }, []);

    return (
        <div className="px-[30px] w-full h-[70px] flex lg:justify-between items-center bg-white shadow-[0_1px_3px_#0000001a]">
            <div className="w-full flex lg:hidden items-center gap-6 transition-all">
                <button onClick={() => toggle_drawer("menu_drawer")}>
                    <RxHamburgerMenu className="text-[26px] text-stone-800 active:text-stone-500 cursor-pointer" />
                </button>

                <button onClick={() => toggle_drawer("search_drawer")}>
                    <SearchIcon className="text-stone-800 scale-[1.20] active:text-stone-500 cursor-pointer" />
                </button>
            </div>
            <div className="flex lg:hidden w-full justify-center">
                <Image alt="logo" src={logo} className="w-[120px] object-contain" />
            </div>

            {/* Logo and Optoins Div */}
            <div className="hidden lg:flex items-center h-full w-full gap-16">
                {/* Logo Div */}
                <div className="w-[120px]">
                    <Image alt="logo" src={logo} className="w-[120px] object-contain" />
                </div>
                {/* Options Div */}
                <div className="flex h-full items-center">
                    <ul className="flex gap-10 items-center justify-center text-center">
                        <li>
                            <a
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="#"
                            >
                                Collections
                            </a>
                        </li>
                        <li>
                            <a
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="#"
                            >
                                Women
                            </a>
                        </li>
                        <li>
                            <a
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="#"
                            >
                                Men
                            </a>
                        </li>
                        <li>
                            <a
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="#"
                            >
                                Kids
                            </a>
                        </li>
                        <li>
                            <a
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100 `}
                                href="#"
                            >
                                Exclusive
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Search Div */}
            <div className="w-full h-full flex justify-end items-center gap-6">

                <div className="hidden lg:flex h-full items-center">
                    <input
                        className="outline-none px-[15px] py-[3px] border border-stone-300 text-[16px] h-[40px] w-[230px]"
                        placeholder="Search"
                        type="text"
                    />
                    <button className="bg-stone-800 flex items-center justify-center text-[16px] w-[40px] h-[40px] active:opacity-70 transition-all">
                        <SearchIcon className="text-white" />
                    </button>
                </div>

                <button onClick={() => toggle_drawer("menu_drawer")} className="lg:hidden" >
                    <RiAccountCircleLine className='text-[26px] text-stone-900' />
                </button>

                <div>
                    <button onClick={() => toggle_drawer("sort_drawer")} className="active:text-stone-400 text-stone-800 transition-all">
                        <Badge badgeContent={0} color="info" showZero>
                            <FiShoppingCart className="text-[24px]" />
                        </Badge>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
