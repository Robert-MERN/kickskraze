import React from 'react'
import Drawer from '@mui/material/Drawer';
import { IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import Link from 'next/link';
import { RiAccountCircleLine } from "react-icons/ri";
import { LuUserPlus2 } from "react-icons/lu";

const Food_menu_drawer = ({ drawer_state, toggle_drawer, handle_sidebar, set_data }) => {

    const slider_menu_options = [
        {
            option: "Create Menu",
            link: "create-menu",
        },
        {
            option: "Update Menu",
            link: "update-menu",
        },
        {
            option: "Create/Update Section",
            link: "update-section",
        },
    ]

    return (
        <Drawer
            open={drawer_state.food_menu_drawer}
            onClose={() => toggle_drawer("food_menu_drawer")}
        >
            <div className='w-[90vw] md:w-[50vw] py-[10px] tracking-wider text-stone-950 transition-all duration-300'>


                <div className='flex justify-between w-full items-center pt-[12px] pb-[30px] px-[20px]' >
                    <p className='text-[20px] font-bold select-none' >Sidebar</p>
                    <button onClick={() => toggle_drawer("food_menu_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-700 scale-[1.60]' />
                    </button>

                </div>

                {slider_menu_options.map((each, index) => (
                    <div
                        onClick={() => { toggle_drawer("food_menu_drawer"); handle_sidebar(set_data,each.link); }}
                        key={index}
                        className='py-[17px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all text-stone-700 tracking-wider'
                    >
                        <button className=''>
                            <p className='text-[17px] font-semibold select-none' >{each.option}</p>
                        </button>
                    </div>
                ))}

                <button onClick={() => toggle_drawer("food_menu_drawer")} className='flex gap-2 items-center py-[17px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all w-full' >
                    <RiAccountCircleLine className='text-[24px] text-stone-900 font-thin' />
                    <p className='text-[17px] font-medium select-none' >Sign In</p>
                </button>
                <button onClick={() => toggle_drawer("food_menu_drawer")} className='flex gap-2 items-center py-[17px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all w-full' >
                    <LuUserPlus2 className='text-[24px] text-stone-900 font-thin' />
                    <p className='text-[17px] font-medium select-none' >Create an Account</p>
                </button>
            </div>
        </Drawer>
    )
}

export default Food_menu_drawer