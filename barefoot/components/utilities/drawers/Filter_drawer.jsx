import React, { useEffect, useState, useRef } from 'react'
import styles from "@/styles/home.module.css";
import Checkbox from '@mui/material/Checkbox';
import {
    convert_to_query_string,
    filter_method,
    filters_realtime_update,
    remove_item_from_filters_realtime_update,
    remove_group_items_from_filters_realtime_update,
    remove_all_items_from_filters_realtime_update,
    find_filter,
} from '@/utils/functions/filter_function';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import { IoClose } from "react-icons/io5";
import useStateContext from '@/context/ContextProvider';



const Filter_drawer = ({ drawer_state, toggle_drawer, axios }) => {

    const { filters,
        set_filters,
        filter_started,
        set_filter_started,
    } = useStateContext();


    const conditions = ["excellent", "premium", "premium+", "very good"];
    const brands = ["asics", "rebook", "nike", "fila", "brooks", "hoka", "converse", "adidas", "sacouny", "under armor", "vty", "vans"];

    useEffect(() => {
        document.querySelectorAll(".MuiCheckbox-colorPrimary").forEach((each, _) => each.style = "color: #292524")
    }, []);


    const apply_filter = (filter_obj) => {
        filter_method(filter_obj, set_filters);
    }

    const fetch_filter = async () => {
        try {
            const res = await axios.get("/api/filter?" + convert_to_query_string(filters));
        } catch (err) {
            console.error(err);
        } finally {

        }
    };

    useEffect(() => {
        fetch_filter();
        if (filters.length > 3) {
            set_filter_started(true);
        } else {
            set_filter_started(false);
        }
    }, [filters]);


    return (
        <Drawer
            open={drawer_state.filter_drawer}
            onClose={() => toggle_drawer("filter_drawer")}

        >
            <div className='w-[65vw] pt-[10px] pb-[40px] tracking-wider text-stone-950 transition-all duration-300'>

                <div className='flex justify-between w-full items-center py-[12px] px-[15px]' >
                    <p className='text-[20px] font-bold select-none' >Filters</p>
                    <button onClick={() => toggle_drawer("filter_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-700 scale-[1.60]' />
                    </button>

                </div>



                <div className={`w-full px-[15px] ${styles.scroll_bar}`} >

                    {/* Filter Realtime Updates */}
                    {filter_started &&
                        <div className='pb-[15px] border-b border-stone-300 mb-[30px]'>

                            <button
                                onClick={() => remove_all_items_from_filters_realtime_update(set_filters)}
                                className='text-[16px] text-stone-600 mb-3 underline underline-offset-4'
                            >
                                Clear all
                            </button>

                            <div className='flex flex-wrap gap-2' >
                                {filters_realtime_update(filters).map((e, index) => (
                                    <button
                                        key={index}
                                        onClick={() => remove_item_from_filters_realtime_update(set_filters, e, set_filter_started)
                                        }
                                        className='flex items-center justify-center pl-[10px] pr-[6px] py-[4px] bg-stone-100 text-stone-600 rounded hover:bg-stone-500 hover:text-white active:opacity-65 transition-all duration-300 gap-1'
                                    >
                                        {e} <IoClose />
                                    </button>
                                ))}
                            </div>
                        </div>
                    }

                    {/* size */}
                    <div className='pb-[15px] border-b border-stone-300'>
                        <h1 className='text-[17px] text-stone-900 mb-3'>Size</h1>
                        <div className={`grid grid-cols-4 gap-2 h-[150px] px-[10px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
                            {[...Array(30)].map((_, i) => (
                                <button
                                    key={i + 19}
                                    onClick={() => apply_filter({ size: i + 19 })}
                                    className={`w-[45px] h-[30px] border border-stone-300 text-center text-[14px] text-stone-900 active:bg-gray-300 transition-all ${filters.some(e => e.size === i + 19) ? "bg-gray-200" : ""}`}
                                >
                                    {i + 19}
                                </button>
                            ))
                            }

                        </div>
                        {filters.some(e => Object.keys(e)[0] === "size") &&
                            <button
                                onClick={() => remove_group_items_from_filters_realtime_update(set_filters, "size", set_filter_started)
                                }
                                className='text-[14px] text-stone-600 my-3 underline underline-offset-4 px-[10px]'>
                                Clear all
                            </button>
                        }
                    </div>
                    {/* Condition */}
                    <div className='mt-[30px] pb-[10px] border-b border-stone-300'>
                        <h1 className='text-[17px] text-stone-900 mb-3'>Condition</h1>
                        {conditions.map((each, index) => (
                            <button
                                key={index + each}
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
                        {filters.some(e => Object.keys(e)[0] === "condition") &&
                            <button
                                onClick={() => remove_group_items_from_filters_realtime_update(set_filters, "condition", set_filter_started)
                                }
                                className='text-[14px] text-stone-600 my-3 underline underline-offset-4 px-[10px]'>
                                Clear all
                            </button>
                        }
                    </div>
                    {/* Brand */}
                    <div className='mt-[30px] pb-[10px] border-b border-stone-300'>
                        <h1 className='text-[17px] text-stone-900 mb-3'>Brand</h1>
                        <div className={`h-[200px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
                            {brands.map((each, index) => (
                                <button
                                    onClick={() => apply_filter({ brand: each })}
                                    key={index + each} 
                                    className='flex items-center w-full'
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
                                onClick={() => remove_group_items_from_filters_realtime_update(set_filters, "brand", set_filter_started)
                                }
                                className='text-[14px] text-stone-600 my-3 underline underline-offset-4 px-[10px]'>
                                Clear all
                            </button>
                        }
                    </div>

                    {/* Price */}
                    <div className='mt-[30px] pb-[15px] border-b border-stone-300'>
                        <h1 className='text-[17px] text-stone-900 mb-3'>Price</h1>
                        <div className='px-[10px]' >
                            <Slider
                                value={[Number(find_filter(filters, "price_lte").price_lte), Number(find_filter(filters, "price_gte").price_gte)]}
                                max={20000}
                                min={0}
                                onChange={(e, new_prices) => {
                                    apply_filter({ price_lte: Number(new_prices[0]) });
                                    apply_filter({ price_gte: Number(new_prices[1]) });
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
                            <div className='w-[75px] h-[45px] border border-stone-400 flex items-center justify-center text-stone-900 text-[15px]' >
                                {find_filter(filters, "price_lte").price_lte.toLocaleString("en-US")}
                            </div>
                            {/* Greater Price */}
                            <div className='w-[75px] h-[45px] border border-stone-400 flex items-center justify-center text-stone-900 text-[15px]' >
                                {find_filter(filters, "price_gte").price_gte.toLocaleString("en-US")}
                            </div>
                        </div>

                    </div>

                    {/* Apply Button */}

                    <div className='mt-[20px] w-full'>
                        <button onClick={fetch_filter} className='bg-black font-extrabold text-white hover:opacity-75 active:opacity-50 transition-all py-[15px] w-full' >
                            Apply
                        </button>
                    </div>

                </div>
            </div>
        </Drawer>
    )
}

export default Filter_drawer