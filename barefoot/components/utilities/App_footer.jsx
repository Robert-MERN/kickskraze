import React, { useEffect } from 'react'
import { HiOutlineHome } from "react-icons/hi2";
import SearchIcon from "@mui/icons-material/Search";
import { RiAccountCircleLine } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { IoGridOutline } from "react-icons/io5";
import Badge from "@mui/material/Badge";
import useStateContext from '@/context/ContextProvider';







const App_footer = () => {
    const { toggle_drawer } = useStateContext();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #292524")
    }, []);

    return (
        <div className='fixed bottom-0 right-0 left-0 w-screen h-[65px] px-[20px] bg-white z-20 flex pb-[5px] items-end justify-between lg:hidden   shadow-[0_0_9px_#0000001f]' >

            <button className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                <HiOutlineHome className='text-[22px] text-stone-700' />
                <p>Home</p>
            </button>

            <button onClick={() => toggle_drawer("search_drawer")} className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                <SearchIcon className='text-stone-700' />
                <p>Search</p>
            </button>

            <button className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                <IoGridOutline className='text-[22px] text-stone-700' />
                <p>Collection</p>
            </button>

            <button onClick={() => toggle_drawer("menu_drawer")} className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                <RiAccountCircleLine className='text-[22px] text-stone-700' />
                <p>Account</p>
            </button>

            <button onClick={() => toggle_drawer("sort_drawer")} className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                <Badge className='badge-2' badgeContent={0} color="info" showZero>
                    <FiShoppingCart className='text-[22px] text-stone-700' />
                </Badge>
                <p>Cart</p>
            </button>

        </div>
    )
}

export default App_footer