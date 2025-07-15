import React, { useState } from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IoClose } from "react-icons/io5";
import useStateContext from '@/context/ContextProvider';
import { convert_to_query_string, filter_method, find_filter } from '@/utils/functions/filter_function';

const Sort_drawer_admin = ({ drawer_state, toggle_drawer, axios }) => {

    const {
        get_all_products_api,
        filters_admin: filters,
        set_filters_admin: set_filters,
        fetched_products_for_collection: products,
        set_fetched_products_for_collection: set_products,
        products_for_collection_admin_loading: is_loading,
        set_products_for_collection_admin_loading: set_is_loading,
        set_show_more_payload_admin: set_show_more_payload,
    } = useStateContext()

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

    const select_option = async (obj) => {
        const FILTERS = await filter_method(obj, set_filters);
        get_all_products_api(axios, convert_to_query_string(FILTERS), set_products, set_show_more_payload, set_is_loading);
        close();
    }

    return (
        <>
            {(!is_loading && Boolean(products.length) && Boolean(find_filter(filters, "sort_by"))) ?
                <SwipeableDrawer
                    open={drawer_state.sort_drawer_admin}
                    onClose={() => toggle_drawer("sort_drawer_admin")}
                    onOpen={() => toggle_drawer("sort_drawer_admin")}
                    anchor='bottom'
                >
                    <div className='w-full tracking-wider text-stone-950 transition-all duration-300'>
                        <div className='flex justify-between w-full items-center py-[15px] px-[20px] border-b border-stone-200' >
                            <p className='text-[20px] font-bold select-none' >SORT BY:</p>
                            <button onClick={() => toggle_drawer("sort_drawer_admin")} className='active:opacity-75' >
                                <IoClose className='text-stone-400 scale-[2.4]' />
                            </button>
                        </div>

                        {sort_options.map((each, index) => (
                            <button
                                onClick={() => {
                                    select_option({ sort_by: each.option });
                                    toggle_drawer("sort_drawer_admin")
                                }}
                                key={index}
                                className={`w-full text-left py-[10px] px-[20px] ${find_filter(filters, "sort_by").sort_by === each.option ? "bg-gray-100 font-bold" : ""} transition-all`} >
                                <p className='text-[18px] select-none' >
                                    {each.title}
                                </p>
                            </button>
                        ))}

                    </div >
                </SwipeableDrawer >
                :
                <></>
            }
        </>
    )
}

export default Sort_drawer_admin