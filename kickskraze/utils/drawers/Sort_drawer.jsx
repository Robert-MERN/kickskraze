import React, { useState } from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IoClose } from "react-icons/io5";
import useStateContext from '@/context/ContextProvider';
import { convert_to_query_string, filter_method, find_filter } from '@/utils/functions/filter_function';
import { useRouter } from 'next/router';

const Sort_drawer = ({ drawer_state, toggle_drawer, axios }) => {

    const {
        filters,
        set_filters,
        get_all_products_api,
        fetched_products_for_collection: products,
        set_fetched_products_for_collection: set_products,
        products_for_collection_loading: is_loading,
        set_products_for_collection_loading: set_is_loading,
        show_more_payload,
        set_show_more_payload
    } = useStateContext();

    const router = useRouter();

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

    const updateUrlFromFilters = (filters) => {
        const query = {};
        filters.forEach(obj => {
            const key = Object.keys(obj)[0];
            const value = String(obj[key]); // convert number to string

            if (!query[key]) {
                // create a new Set to avoid duplicates
                query[key] = new Set([value]);
            } else {
                query[key].add(value);
            }
        });

        // Convert Set → comma string
        Object.keys(query).forEach(key => {
            query[key] = Array.from(query[key]).join(",");
        });

        router.push({
            pathname: router.asPath.split('?')[0],
            query
        }, undefined, { shallow: true });
    };


    const select_option = async (obj) => {
        const FILTERS = await filter_method(obj, set_filters);
        updateUrlFromFilters(FILTERS);
        close();
    }

    return (
        <>
            {(!is_loading && Boolean(products.length) && Boolean(find_filter(filters, "sort_by"))) ?
                <SwipeableDrawer
                    open={drawer_state.sort_drawer}
                    onClose={() => toggle_drawer("sort_drawer")}
                    onOpen={() => toggle_drawer("sort_drawer")}
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
                        ))}

                    </div >
                </SwipeableDrawer >
                :
                <></>
            }
        </>
    )
}

export default Sort_drawer