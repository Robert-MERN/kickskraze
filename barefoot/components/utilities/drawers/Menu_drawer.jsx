import React from 'react'
import Drawer from '@mui/material/Drawer';
import { IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import Link from 'next/link';
import { RiAccountCircleLine } from "react-icons/ri";
import { LuUserPlus2 } from "react-icons/lu";

const Menu_drawer = ({ drawer_state, toggle_drawer }) => {

    const slider_menu_options = [
        {
            option: "Men",
            link: "#",
        },
        {
            option: "Women",
            link: "#",
        },
        {
            option: "Kids",
            link: "#",
        },
        {
            option: "Exclusive",
            link: "#",
        },
    ]

    return (
        <Drawer
            open={drawer_state.menu_drawer}
            onClose={() => toggle_drawer("menu_drawer")}
        >
            <div className='w-[90vw] md:w-[50vw] py-[10px] tracking-wider text-stone-950 transition-all duration-300'>


                <div className='flex justify-between w-full items-center py-[12px] px-[20px]' >
                    <p className='text-[20px] font-bold select-none' >Menu</p>
                    <button onClick={() => toggle_drawer("menu_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-700 scale-[1.60]' />
                    </button>

                </div>

                <div onClick={() => toggle_drawer("collection_drawer")} className='flex justify-between items-center py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                    <p className='text-[17px] font-semibold select-none' >Colection</p>
                    <FaAngleRight className='scale-[1.05] text-stone-500' />
                </div>

                {slider_menu_options.map((each, index) => (
                    <div key={index} className='py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                        <Link href={each.link} >
                            <p className='text-[17px] font-semibold select-none' >{each.option}</p>
                        </Link>
                    </div>
                ))}

                <div className='flex gap-2 items-center py-[17px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                    <RiAccountCircleLine className='text-[24px] text-stone-900 font-thin' />
                    <p className='text-[17px] font-medium select-none' >Sign In</p>
                </div>
                <div className='flex gap-2 items-center py-[17px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                    <LuUserPlus2 className='text-[24px] text-stone-900 font-thin' />
                    <p className='text-[17px] font-medium select-none' >Create an Account</p>
                </div>
            </div>
        </Drawer>
    )
}

export default Menu_drawer