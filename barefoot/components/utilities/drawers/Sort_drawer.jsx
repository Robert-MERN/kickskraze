import React, { useState } from 'react'
import Drawer from '@mui/material/Drawer';
import { IoClose } from "react-icons/io5";

const Sort_drawer = ({ drawer_state, toggle_drawer }) => {

    const [sort_opt, set_sort_opt] = useState("");

    const sort_options = [
        "Featured",
        "Best selling",
        "Alphabetically, A-Z",
        "Alphabetically, Z-A",
        "Price, low to high",
        "Price, high to low",
        "Date, old to new",
        "Date, new to old",
    ]
    const select_option = (opt) => {
        set_sort_opt(opt);
    }

    return (
        <Drawer
            open={drawer_state.sort_drawer}
            onClose={() => toggle_drawer("sort_drawer")}
            anchor='bottom'
        >
            <div className='w-full tracking-wider text-stone-950 transition-all duration-300'>
                <div className='flex justify-between w-full items-center py-[15px] px-[20px] border-b border-stone-200' >
                    <p className='text-[20px] font-bold select-none' >SORT BY:</p>
                    <button onClick={() => toggle_drawer("sort_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-400 scale-[2.4]' />
                    </button>
                </div>
                {sort_options.map((option, index) => (
                    <button onClick={() => select_option(option)} key={index} className={`w-full text-left py-[10px] px-[20px] ${sort_opt === option ? "bg-gray-100 font-bold" : ""} transition-all`} >
                        <p className='text-[18px] select-none' >
                            {option}
                        </p>
                    </button>
                ))
                }

            </div >
        </Drawer >
    )
}

export default Sort_drawer