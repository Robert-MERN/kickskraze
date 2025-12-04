import React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { RiAccountCircleLine } from "react-icons/ri";
import { LuUserPlus } from "react-icons/lu";

const Menu_drawer = ({ drawer_state, toggle_drawer }) => {

    const slider_menu_options = [
        {
            option: "Footwear",
            toggle: () => toggle_drawer("footwear_drawer"),
        },
        {
            option: "Jewellry",
            toggle: () => toggle_drawer("jewelry_drawer"),
        },
        {
            option: "Clothing",
            toggle: () => toggle_drawer("apparel_drawer"),
        },
        {
            option: "Footwear Accessories",
            toggle: () => toggle_drawer("footwear_accessories_drawer"),
        },
    ]

    return (
        <SwipeableDrawer
            open={drawer_state.menu_drawer}
            onClose={() => toggle_drawer("menu_drawer")}
            onOpen={() => toggle_drawer("menu_drawer")}
        >
            <div className='w-[90vw] md:w-[50vw] lg:w-[25vw] py-[10px] text-stone-950 transition-all duration-300'>


                <div className='flex justify-between w-full items-center py-[12px] px-[20px]' >
                    <p className='text-[20px] font-bold select-none' >Menu</p>
                    <button onClick={() => toggle_drawer("menu_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-700 scale-[1.60]' />
                    </button>

                </div>

                <div className='flex justify-between items-center py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                    <p className='text-[17px] font-semibold select-none' >All Collection</p>
                </div>

                <div className='flex flex-col w-full'>
                    {slider_menu_options.map((each, index) => (
                        <button
                            key={index}
                            className='w-full flex justify-between items-center text-left py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all'
                            onClick={each.toggle}
                        >

                            <p className='text-[17px] font-semibold select-none' >{each.option}</p>
                            <FaAngleRight className='scale-[1.05] text-stone-500' />

                        </button>
                    ))}
                </div>

                <button onClick={() => toggle_drawer("menu_drawer")} className='flex gap-2 items-center py-[17px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all w-full' >
                    <RiAccountCircleLine className='text-[24px] text-stone-900 font-thin' />
                    <p className='text-[17px] font-medium select-none' >Sign In</p>
                </button>
                <button onClick={() => toggle_drawer("menu_drawer")} className='flex gap-2 items-center py-[17px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all w-full' >
                    <LuUserPlus className='text-[24px] text-stone-900 font-thin' />
                    <p className='text-[17px] font-medium select-none' >Create an Account</p>
                </button>
            </div>
        </SwipeableDrawer>
    )
}

export default Menu_drawer
