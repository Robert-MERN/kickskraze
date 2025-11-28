import React, { useEffect, useState, useRef } from 'react'
import styles from "@/styles/home.module.css";
import Checkbox from '@mui/material/Checkbox';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Slider from '@mui/material/Slider';
import { IoClose } from "react-icons/io5";
import useStateContext from '@/context/ContextProvider';
import {
    filter_method,
    filters_realtime_update,
    remove_item_from_filters_realtime_update,
    remove_group_items_from_filters_realtime_update,
    remove_all_items_from_filters_realtime_update,
    find_filter,
    convert_to_query_string,
    store_name_filter_display_fn,
    sort_store_names,
} from '@/utils/functions/filter_function';
import { Fade } from 'react-reveal';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';



const Filter_drawer = ({ drawer_state, toggle_drawer, axios }) => {

    const router = useRouter();

    const { filters,
        set_filters,
        filter_options,
        set_filter_options,
        get_filter_values_api,
        get_all_products_api,
        fetched_products_for_collection: products,
        set_fetched_products_for_collection: set_products,
        products_for_collection_loading: is_loading,
        set_products_for_collection_loading: set_is_loading,
        show_more_payload,
        set_show_more_payload
    } = useStateContext();


    const [filter_options_loading, set_filter_options_loading] = useState(false);




    useEffect(() => {
        document.querySelectorAll(".MuiCheckbox-root").forEach((each, _) => each.style = "color: #292524")
    }, []);

    // APPLYING FILTER AND REMOVING FILTERS LOGICS
    const timerRef = useRef(null);

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
            pathname: router.pathname,
            query
        }, undefined, { shallow: true });
    };

    const apply_filter = async (filter_obj) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (Object.keys(filter_obj).includes("price_gte") || Object.keys(filter_obj).includes("price_lte")) {
            timerRef.current = setTimeout(async () => {
                const FILTERS = await filter_method(filter_obj, set_filters);
                updateUrlFromFilters(FILTERS);
            }, 300);
        } else {
            const FILTERS = await filter_method(filter_obj, set_filters);
            updateUrlFromFilters(FILTERS);
        }
    };


    const remove_item_from_filters_realtime_update_fn = async (set_filters, e, filter_options) => {
        const FILTERS = await remove_item_from_filters_realtime_update(set_filters, e, filter_options);
        updateUrlFromFilters(FILTERS);
    }

    const remove_group_items_from_filters_realtime_update_fn = async (set_filters, obj_key) => {
        const FILTERS = await remove_group_items_from_filters_realtime_update(set_filters, obj_key);
        updateUrlFromFilters(FILTERS);
    }

    const remove_all_items_from_filters_realtime_update_fn = (filter_options, set_filters) => {
        const FILTERS = remove_all_items_from_filters_realtime_update(filter_options, set_filters);
        updateUrlFromFilters(FILTERS);
    }

    // <-----------End Here ----------->

    useEffect(() => {
        if (drawer_state.filter_drawer && !Object.entries(filter_options).length) {
            get_filter_values_api(axios, set_filter_options, set_filter_options_loading);
        }
    }, [drawer_state.filter_drawer]);

    useEffect(() => {
        if (Object.keys(filter_options).length) {
            // Initalizing and Reseting Filters
            remove_all_items_from_filters_realtime_update(filter_options, set_filters);
        }
    }, [filter_options]);





    return (
        <SwipeableDrawer
            open={drawer_state.filter_drawer}
            onClose={() => toggle_drawer("filter_drawer")}
            onOpen={() => toggle_drawer("filter_drawer")}
        >
            <div className='w-[75vw] pt-[10px] pb-[40px] text-stone-950 transition-all duration-300'>

                <div className='flex justify-between w-full items-center py-[12px] px-[15px]' >
                    <p className='text-[20px] font-bold select-none' >Filters</p>
                    <button onClick={() => toggle_drawer("filter_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-700 scale-[1.60]' />
                    </button>

                </div>

                <div className={`w-full px-[20px] ${styles.scroll_bar}`}  >

                    {(filter_options_loading || !Boolean(Object.keys(filter_options).length)) || !Boolean(filters.length) ?
                        <>
                            <Skeleton
                                variant='text'
                                animation="wave"
                                className='bg-stone-100 w-[30%] mt-[10px] mb-3'
                            />
                            <div className='flex flex-wrap gap-3 max-h-[155px] overflow-hidden px-[10px] justify-start items-start' >
                                {[...Array(27)].map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        variant='rounded'
                                        animation="wave"
                                        className='bg-stone-100 w-[45px] h-[30px]'
                                    />
                                ))}
                            </div>

                            <Skeleton
                                variant='text'
                                animation="wave"
                                className='bg-stone-100 w-[30%] mt-[45px]'
                            />
                            {[...Array(4)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant='rounded'
                                    animation="wave"
                                    className={`bg-stone-100 h-[14.4px] w-[65%] mt-[10px]`}
                                />
                            ))}

                            <Skeleton
                                variant='text'
                                animation="wave"
                                className='bg-stone-100 w-[30%] mt-[45px]'
                            />
                            {[...Array(4)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant='rounded'
                                    animation="wave"
                                    className={`bg-stone-100 h-[14.4px] w-[65%] mt-[10px]`}
                                />
                            ))}

                            <div>
                                <Skeleton
                                    variant='text'
                                    animation="wave"
                                    className='bg-stone-100 w-[30%] mt-[45px]'
                                />
                                <Skeleton
                                    variant='rounded'
                                    animation="wave"
                                    className='bg-stone-100 w-full h-[20px] mt-[10px]'
                                />
                                <div className='w-full flex justify-between items-center mt-[10px]'>
                                    {[...Array(2)].map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            variant='rounded'
                                            animation="wave"
                                            className='bg-stone-100 w-[75px] h-[40px]'
                                        />
                                    ))}
                                </div>
                            </div>

                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 w-full h-[40px] mt-[45px]'
                            />
                        </>

                        :
                        <>
                            {/* Filter Realtime Updates */}
                            {Boolean(filters_realtime_update(filter_options, filters).length) &&
                                <Fade>

                                    <div className='pb-[15px] border-b border-stone-300 mb-[30px]'>

                                        <button
                                            onClick={() => remove_all_items_from_filters_realtime_update_fn(filter_options, set_filters)}
                                            className='text-[16px] text-stone-600 mb-3 underline underline-offset-4'
                                        >
                                            Clear all
                                        </button>

                                        <div className='flex flex-wrap gap-2' >
                                            {filters_realtime_update(filter_options, filters).map((e, index) => (
                                                <Fade key={index}>
                                                    <button
                                                        onClick={() => remove_item_from_filters_realtime_update_fn(set_filters, e, filter_options)
                                                        }
                                                        className='flex items-center justify-center pl-[10px] pr-[6px] py-[4px] bg-stone-100 text-stone-600 rounded hover:bg-stone-500 hover:text-white active:opacity-65 transition-all duration-300 gap-1'
                                                    >
                                                        {e} <IoClose />
                                                    </button>
                                                </Fade>
                                            ))}
                                        </div>
                                    </div>
                                </Fade>
                            }


                            {/* size */}
                            <Fade>

                                <div className='pb-[15px] border-b border-stone-300'>
                                    <h1 className='text-[17px] text-stone-900 mb-3'>Size</h1>
                                    <div className={`flex flex-wrap justify-start gap-2 max-h-[150px] px-[10px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
                                        {filter_options.sizes.map((each, index) => (
                                            <button
                                                key={index}
                                                onClick={() => apply_filter({ size: each })}
                                                className={`w-[45px] h-[30px] border border-stone-300 text-center text-[14px] text-stone-900 active:bg-gray-300 text-ellipsis line-clamp-1 overflow-hidden transition-all ${filters.some(e => String(e.size) === String(each)) ? "bg-gray-200" : ""}`}
                                            >
                                                {each}
                                            </button>
                                        ))
                                        }
                                    </div>
                                    {filters.some(e => Object.keys(e)[0] === "size") &&
                                        <button
                                            onClick={() => remove_group_items_from_filters_realtime_update_fn(set_filters, "size")
                                            }
                                            className='text-[14px] text-stone-600 my-3 underline underline-offset-4 px-[10px]'>
                                            Clear all
                                        </button>
                                    }
                                </div>
                            </Fade>


                            {/* Condition */}
                            <Fade>
                                <div className='mt-[30px] pb-[10px] border-b border-stone-300'>
                                    <h1 className='text-[17px] text-stone-900 mb-3'>Condition</h1>
                                    <div className={`max-h-[155px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
                                        {filter_options.conditions.map((each, index) => (
                                            <button
                                                key={index}
                                                onClick={() => apply_filter({ condition: each })}
                                                className='flex items-center w-full'
                                            >
                                                <Checkbox
                                                    checked={filters.some(e => e.condition === each)}
                                                    size='small'
                                                />
                                                <p className='text-[15px] text-stone-900 capitalize'>{each}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {filters.some(e => Object.keys(e)[0] === "condition") &&
                                        <button
                                            onClick={() => remove_group_items_from_filters_realtime_update_fn(set_filters, "condition")
                                            }
                                            className='text-[14px] text-stone-600 my-3 underline underline-offset-4 px-[10px]'>
                                            Clear all
                                        </button>
                                    }
                                </div>
                            </Fade>


                            {/* Shoes Types */}
                            <Fade>
                                <div className='mt-[30px] pb-[10px] border-b border-stone-300'>
                                    <h1 className='text-[17px] text-stone-900 mb-3'>Shoe Type</h1>
                                    <div className={`max-h-[155px] px-[10px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
                                        {(sort_store_names(filter_options.store_names)).map((each, index) => (
                                            <button
                                                key={index}
                                                onClick={() => apply_filter({ store_name: each })}
                                                className='flex items-center w-full'
                                            >
                                                <Checkbox
                                                    checked={filters.some(e => e.store_name === each)}
                                                    size='small'
                                                />
                                                <p className='text-[15px] text-stone-900 capitalize'>{store_name_filter_display_fn(each)}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {filters.some(e => Object.keys(e)[0] === "store_name") &&
                                        <button
                                            onClick={() => remove_group_items_from_filters_realtime_update_fn(set_filters, "store_name")
                                            }
                                            className='text-[14px] text-stone-600 my-3 underline underline-offset-4 px-[10px]'>
                                            Clear all
                                        </button>
                                    }
                                </div>
                            </Fade>


                            {/* Brand */}
                            <Fade>
                                <div className='mt-[30px] pb-[10px] border-b border-stone-300'>
                                    <h1 className='text-[17px] text-stone-900 mb-3'>Brand</h1>
                                    <div className={`max-h-[200px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
                                        {filter_options.brands.map((each, index) => (
                                            <button
                                                onClick={() => apply_filter({ brand: each })}
                                                key={index + each} className='flex items-center w-full'
                                            >
                                                <Checkbox
                                                    checked={filters.some(e => e.brand === each)}
                                                    size='small'
                                                />
                                                <p className='text-[15px] text-stone-900 capitalize'>{each}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {filters.some(e => Object.keys(e)[0] === "brand") &&
                                        <button
                                            onClick={() => remove_group_items_from_filters_realtime_update_fn(set_filters, "brand")
                                            }
                                            className='text-[14px] text-stone-600 my-3 underline underline-offset-4 px-[10px]'>
                                            Clear all
                                        </button>
                                    }
                                </div>
                            </Fade>

                            {/* Price */}
                            <Fade>
                                <div className='mt-[30px] pb-[15px] border-b border-stone-300'>
                                    <h1 className='text-[17px] text-stone-900 mb-3'>Price</h1>
                                    {Boolean(find_filter(filters, "price_lte")) &&
                                        <>
                                            <div className='px-[10px]' >
                                                <Slider
                                                    value={[find_filter(filters, "price_gte").price_gte, find_filter(filters, "price_lte").price_lte]}
                                                    max={Number(filter_options.price_lte)}
                                                    min={0}
                                                    onChange={(e, new_prices) => {
                                                        apply_filter({ price_gte: Number(new_prices[0]) });
                                                        apply_filter({ price_lte: Number(new_prices[1]) });

                                                        filter_method({ price_gte: Number(new_prices[0]) }, set_filters);
                                                        filter_method({ price_lte: Number(new_prices[1]) }, set_filters);
                                                    }}
                                                    valueLabelDisplay="auto"
                                                    step={50}
                                                    valueLabelFormat={(val) => val.toLocaleString("en-US")}
                                                    sx={{
                                                        color: 'black',
                                                        '& .MuiSlider-track': {
                                                            backgroundColor: 'black', // Track color
                                                        },
                                                        '& .MuiSlider-thumb': {
                                                            backgroundColor: 'black', // Thumb color
                                                            '&:hover': {
                                                                backgroundColor: 'black', // Thumb hover color
                                                            },
                                                        },
                                                        '& .MuiSlider-rail': {
                                                            backgroundColor: 'black', // Rail color
                                                        },
                                                        '& .MuiSlider-valueLabel': {
                                                            backgroundColor: 'black', // Value label color (if you want it to match)
                                                        },
                                                    }}
                                                />
                                            </div>

                                            <div className='w-full flex justify-between items-center mt-2' >
                                                {/* Lesser Price */}
                                                <input
                                                    placeholder={find_filter(filters, "price_gte").price_gte}
                                                    onChange={(e) => apply_filter({ price_gte: Number(e.target.value) })}
                                                    className='w-[75px] h-[45px] border border-stone-400 text-stone-900 text-[15px] px-[10px] text-center outline-none placeholder-stone-900' />

                                                {/* Greater Price */}
                                                <input
                                                    value={find_filter(filters, "price_lte").price_lte ?? ""}
                                                    onChange={(e) => apply_filter({ price_lte: Number(e.target.value) })}
                                                    className='w-[75px] h-[45px] border border-stone-400 text-stone-900 text-[15px] px-[10px] text-center outline-none placeholder-stone-900' />
                                            </div>

                                        </>
                                    }

                                </div>
                            </Fade>


                            {/* Apply Button */}
                            <Fade>
                                <div className='mt-[20px] mb-[50px] w-full'>
                                    <button
                                        onClick={() => {
                                            // get_all_products_api(axios, convert_to_query_string(filters), set_products, set_show_more_payload, set_is_loading)
                                            toggle_drawer("filter_drawer");
                                        }}
                                        className='bg-black font-bold text-white hover:opacity-75 active:opacity-50 transition-all py-[10px] w-full' >
                                        Apply
                                    </button>
                                </div>
                            </Fade>
                            {/* end */}
                        </>
                    }
                </div>
            </div>
        </SwipeableDrawer>
    )
}

export default Filter_drawer