import React, { useEffect, useState } from 'react'
import { HiOutlineHome } from "react-icons/hi2";
import SearchIcon from "@mui/icons-material/Search";
import { RiAccountCircleLine } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { IoGridOutline } from "react-icons/io5";
import Badge from "@mui/material/Badge";
import useStateContext from '@/context/ContextProvider';
import Link from 'next/link';
import { useRouter } from 'next/router';







const App_footer = () => {
    const { toggle_drawer, cart } = useStateContext();

    const router = useRouter();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #292524")
    }, []);

    const [store_name, set_store_name] = useState("");


    // Setting store name
    useEffect(() => {
        const path = router.pathname.split("?")[0].slice(1).split("/");
        if (path.length === 2 && path[0] === "collection") {
            const normalizedPathStoreName = path[1].charAt(0).toUpperCase() + path[1].slice(1);
            if (normalizedPathStoreName === "Jewellry") {
                set_store_name("Jewelry");
            } else {
                set_store_name(normalizedPathStoreName);
            }
        } else {
            set_store_name("");
        }

    }, [router.pathname]);

    return (
        <div className='fixed bottom-0 right-0 left-0 w-screen h-[65px] px-[20px] bg-white z-20 flex pb-[5px] items-end justify-between lg:hidden   shadow-[0_0_9px_#0000001f]' >

            <Link href="/" >
                <button className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                    <HiOutlineHome className='text-[22px] text-stone-700' />
                    <p>Home</p>
                </button>
            </Link>

            {["Footwear", "Footwear-accessories", "Jewelry", "Apparel"].includes(store_name) && (
                <button onClick={() => toggle_drawer("search_drawer")} className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                    <SearchIcon className='text-stone-700' />
                    <p>Search</p>
                </button>
            )}


            <Link href="/collection" >
                <button className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                    <IoGridOutline className='text-[22px] text-stone-700' />
                    <p>Collection</p>
                </button>
            </Link>

            {["Footwear", "Footwear-accessories", "Jewelry", "Apparel"].includes(store_name) && (
                <button onClick={() => toggle_drawer("menu_drawer")} className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                    <RiAccountCircleLine className='text-[22px] text-stone-700' />
                    <p>Account</p>
                </button>
            )}

            <Link href='/cart' >
                <button className='text-[12px] text-stone-950 flex flex-col items-center gap-1 active:opacity-70 transition-all'>
                    <Badge className='badge-2' badgeContent={cart.length} color="info" showZero>
                        <FiShoppingCart className='text-[22px] text-stone-700' />
                    </Badge>
                    <p>Cart</p>
                </button>
            </Link>

        </div>
    )
}

export default App_footer