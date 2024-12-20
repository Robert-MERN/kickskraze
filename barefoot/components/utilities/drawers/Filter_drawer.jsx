import React, { useEffect, useState, useRef } from 'react'
import styles from "@/styles/home.module.css";
import Checkbox from '@mui/material/Checkbox';
import { convert_to_query_string, filter_method, find_filter } from '@/utils/functions/filter_function';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import { IoClose } from "react-icons/io5";
import useStateContext from '@/context/ContextProvider';



const Filter_drawer = ({ drawer_state, toggle_drawer, axios }) => {

    const { filters, set_filters } = useStateContext();


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
                    </div>
                    {/* Condition */}
                    <div className='mt-[30px] pb-[10px] border-b border-stone-300'>
                        <h1 className='text-[17px] text-stone-900 mb-3'>Condition</h1>
                        {conditions.map((each, index) => (
                            <button
                                key={index + each}
                                onClick={() => apply_filter({ condition: each })}
                                className='flex items-center'
                            >
                                <Checkbox
                                    checked={filters.some(e => e.condition === each)}
                                    size='small'
                                />
                                <p className='text-[15px] text-stone-900 capitalize'>{each}</p>
                            </button>
                        ))}
                    </div>
                    {/* Brand */}
                    <div className='mt-[30px] pb-[10px] border-b border-stone-300'>
                        <h1 className='text-[17px] text-stone-900 mb-3'>Brand</h1>
                        <div className={`h-[200px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
                            {brands.map((each, index) => (
                                <button
                                    onClick={() => apply_filter({ brand: each })}
                                    key={index + each} className='flex items-center'
                                >
                                    <Checkbox
                                        checked={filters.some(e => e.brand === each)}
                                        size='small'
                                    />
                                    <p className='text-[15px] text-stone-900 capitalize'>{each}</p>
                                </button>
                            ))}
                        </div>
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