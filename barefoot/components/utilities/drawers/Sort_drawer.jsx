import React, { useState } from 'react'
import Drawer from '@mui/material/Drawer';
import { IoClose } from "react-icons/io5";
import useStateContext from '@/context/ContextProvider';
import { filter_method, find_filter } from '@/utils/functions/filter_function';


const Sort_drawer = ({ drawer_state, toggle_drawer }) => {

    const { filters, set_filters } = useStateContext()

    // Sorting options
    const sort_options = [
        {
            title: "Alphabetically, A-Z",
            option: "title-ascending",
        },
        {
            title: "Alphabetically, Z-A",
            option: "title-descending",
        },
        {
            title: "Price, low to high",
            option: "price-ascending",
        },
        {
            title: "Price, high to low",
            option: "price-descending",
        },
        {
            title: "Date, old to new",
            option: "created-ascending",
        },
        {
            title: "Date, new to old",
            option: "created-descending",
        },

    ]

    const select_option = (obj) => {
        filter_method(obj, set_filters);
        close();
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
                {sort_options.map((each, index) => (
                    <button
                        onClick={() => {
                            select_option({ sort_by: each.option });
                            toggle_drawer("sort_drawer")
                        }}
                        key={index}
                        className={`w-full text-left py-[10px] px-[20px] ${find_filter(filters, "sort_by").sort_by === each.option ? "bg-gray-100 font-bold" : ""} transition-all`} >
                        <p className='text-[18px] select-none' >
                            {each.title}
                        </p>
                    </button>
                ))
                }

            </div >
        </Drawer >
    )
}

export default Sort_drawer