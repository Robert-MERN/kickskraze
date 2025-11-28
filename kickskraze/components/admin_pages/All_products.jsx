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
    add_query_filters,
    configure_query_filters,
    sort_store_names,
    store_name_filter_display_fn,
} from '@/utils/functions/filter_function';
import Slider from '@mui/material/Slider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TfiLayoutColumn2Alt } from "react-icons/tfi";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";
import { TfiLayoutColumn4Alt } from "react-icons/tfi";
import { MdTableRows } from "react-icons/md";
import Link from 'next/link';
import { LuFilter } from "react-icons/lu";
import useStateContext from '@/context/ContextProvider';
import Popover from '@mui/material/Popover';
import { IoClose } from "react-icons/io5";
import { CircularProgress, Skeleton } from '@mui/material';
import { Fade } from 'react-reveal';
import { useRouter } from 'next/router';
import { calculate_discount_precentage, calculate_product_stock, select_thumbnail_from_media } from '@/utils/functions/produc_fn';

// Sort Popover for Windows Screens
const Sort_popover = ({ anchorEl, close, sort_options, filters, set_filters, axios, get_all_products_api, convert_to_query_string, set_products, set_show_more_payload, set_is_loading }) => {

    const open = Boolean(anchorEl);
    const id = open ? "sort_popover" : undefined;


    const select_option = async (obj) => {
        const FILTERS = await filter_method(obj, set_filters);
        get_all_products_api(axios, convert_to_query_string(FILTERS), set_products, set_show_more_payload, set_is_loading);
        close();
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={close}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >


            <div className={`w-[230px] py-[15px] bg-white rounded-md  text-stone-950 transition-all duration-300`} >

                <div className='flex justify-between w-full items-center px-[20px] border-b border-stone-200' >
                    <p className='text-[15px] font-bold select-none' >SORT BY:</p>
                </div>
                {sort_options.map((each, index) => (
                    <button onClick={() => select_option({ sort_by: each.option })} key={index} className={`w-full text-left py-[4px] px-[20px] ${find_filter(filters, "sort_by").sort_by === each.option ? "underline underline-offset-[5px] text-black" : "text-stone-600"} transition-all`} >
                        <p className='text-[15px] select-none' >
                            {each.title}
                        </p>
                    </button>
                ))
                }
            </div>

        </Popover>
    )
}



const All_products = ({ axios }) => {

    const {
        get_all_products_api,
        get_filter_values_api,
        toggle_drawer,
        filters_admin: filters,
        set_filters_admin: set_filters,
        filter_options_admin: filter_options,
        set_filter_options_admin: set_filter_options,
        fetched_products_for_collection: products,
        set_fetched_products_for_collection: set_products,
        products_for_collection_admin_loading: is_loading,
        set_products_for_collection_admin_loading: set_is_loading,
        stored_path_admin: stored_path,
        set_stored_path_admin: set_stored_path,
        show_more_payload_admin: show_more_payload,
        set_show_more_payload_admin: set_show_more_payload,

    } = useStateContext();



    const router = useRouter();


    const [show_more_loading, set_show_more_loading] = useState(false);
    const [filter_options_loading, set_filter_options_loading] = useState(false);



    useEffect(() => {
        document.querySelectorAll(".MuiCheckbox-root").forEach((each, _) => each.style = "color: #292524")
    }, []);





    useEffect(() => {
        if (!Object.entries(filter_options).length) {
            get_filter_values_api(axios, set_filter_options, set_filter_options_loading);
        }
    }, []);

    const [clone_filters, set_clone_filters] = useState([]); // Tihs is has nothing to with showing data but to prevent multiple fetchings.
    useEffect(() => {
        if (Object.keys(filter_options).length && !filters.length) {
            // Initalizing and Reseting Filters
            remove_all_items_from_filters_realtime_update(filter_options, set_filters);
            remove_all_items_from_filters_realtime_update(filter_options, set_clone_filters);
        }
    }, [filter_options]);




    useEffect(() => {
        if (!router.isReady) return;
        const query_filters = configure_query_filters(router.query);
        if (filters.length && query_filters.length && router.asPath !== stored_path) {
            // Initalizing and Reseting Filters
            remove_all_items_from_filters_realtime_update(filter_options, set_filters);
            remove_all_items_from_filters_realtime_update(filter_options, set_clone_filters);
            add_query_filters(query_filters, set_filters);
        } else if (filters.length && !query_filters.length && router.asPath !== stored_path) {
            // Initalizing and Reseting Filters
            remove_all_items_from_filters_realtime_update(filter_options, set_filters);
            remove_all_items_from_filters_realtime_update(filter_options, set_clone_filters);
        }
    }, [router.isReady, router.query, filter_options]);







    useEffect(() => {
        if (!router.isReady) return;

        const fetch = async () => {
            if (router.asPath !== stored_path) {

                let FILTERS = filters;
                const query_filters = configure_query_filters(router.query);
                if (query_filters.length) {
                    FILTERS = await add_query_filters(query_filters, set_clone_filters);
                }
                if ((filters.length === 3 || (filters.length >= 3 && Object.keys(router.query).length)) && filters.every(e => Object.values(e)[0] !== undefined && Object.values(e)[0] !== null)) {
                    get_all_products_api(axios, convert_to_query_string(FILTERS), set_products, set_show_more_payload, set_is_loading);
                }
            }
        }
        fetch();
    }, [router.isReady, filters]);



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





    // Grid state changing dynamicly
    const [grid, setGrid] = useState(4);
    const [lastWidth, setLastWidth] = useState(0); // Store last valid width

    const change_grid = (val) => {
        setGrid(val);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            let timeoutId = null;

            const handleResize = () => {
                const currentWidth = window.innerWidth;

                // Ignore small height-based changes (which happen on mobile scrolling)
                if (currentWidth === lastWidth) return;

                setLastWidth(currentWidth); // Update last valid width

                if (currentWidth >= 1536) {
                    setGrid(4);
                } else if (currentWidth >= 1280) {
                    setGrid(3);
                } else if (currentWidth >= 1024) {
                    setGrid(2);
                } else {
                    setGrid(2);
                }
            };

            // Add event listener with debounce to prevent rapid calls
            const resizeListener = () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(handleResize, 100); // Delay to prevent spam on mobile
            };

            handleResize(); // Initial check
            window.addEventListener("resize", resizeListener);

            return () => {
                clearTimeout(timeoutId);
                window.removeEventListener("resize", resizeListener);
            };
        }
    }, [lastWidth]); // ✅ Only runs when actual width changes
    // <---------Ends Here-------->




    const [anchorEl, setAnchorEl] = useState(null);
    const handle_sort_pop = (e) => {
        setAnchorEl(e.currentTarget);
    }

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

    ];

    const show_more_payload_func = () => {
        set_show_more_payload(prev => ({ ...prev, page: prev.page + 1 }));
    };

    useEffect(() => {
        const fetch = async () => {
            const { page, limit } = show_more_payload;
            if (page > 1) {
                let FILTERS = filters;
                const query_filters = configure_query_filters(router.query);
                if (query_filters.length) {
                    FILTERS = await add_query_filters(query_filters, set_clone_filters);
                }

                get_all_products_api(axios, convert_to_query_string(FILTERS), set_products, set_show_more_payload, set_show_more_loading, convert_to_query_string([{ page }, { limit }]));

            }
        }
        fetch();
    }, [show_more_payload.page]);


    useEffect(() => {
        if (!router.isReady) return;
        const timer = setTimeout(() => {
            if (router.asPath !== stored_path && filters.length && filters.every(e => Object.values(e)[0] !== undefined && Object.values(e)[0] !== null)) {
                set_stored_path(router.asPath);
            }
        }, 500)
        return () => clearTimeout(timer);
    }, [router.isReady, router.asPath, filters]);



    const date_formatter = (date) => {
        // Create a Date object
        const dateObject = new Date(date);

        // Format the date and time with the Pakistan time zone
        const formattedDate = dateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            timeZone: 'Asia/Karachi'
        });

        const formattedTime = dateObject.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Karachi'
        });

        return `${formattedDate}  [${formattedTime}]`;
    };



    return (
        <div className='w-full'>
            <div className='w-full flex gap-4' >

                {/* Filter Section */}
                <div className={`lg:flex-[1.3] xl:flex-[1.2] 2xl:flex-[1.1] py-[10px] hidden lg:block`}>
                    <div className={`w-full h-[calc(100vh-105px)] md:h-[calc(100vh-120px)] overflow-y-auto sticky top-[70px] overflow-x-hidden px-[15px] ${styles.scroll_bar} transition-all duration-500`} >
                        {(filter_options_loading || !Boolean(Object.keys(filter_options).length)) || !Boolean(filters.length) ?
                            <div className='flex flex-col h-full justify-between pb-[30px]'>
                                <div>
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
                                </div>

                                <div>

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
                                            className={`bg-stone-100 h-[14.4px] mt-[10px] w-[65%]`}
                                        />
                                    ))}
                                </div>

                                <div>

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
                                            className={`bg-stone-100 h-[14.4px] mt-[10px] w-[65%]`}
                                        />
                                    ))}
                                </div>


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
                            </div>
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
                                                    <Fade key={index} >
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
                                                    className={`w-[45px] h-[30px] border border-stone-300 text-center text-[14px] text-stone-900 active:bg-gray-300 transition-all text-ellipsis line-clamp-1 overflow-hidden ${filters.some(e => String(e.size) === String(each)) ? "bg-gray-200" : ""}`}
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
                                        <div className={`max-h-[155px] px-[10px] overflow-y-auto overflow-x-hidden ${styles.scroll_bar}`} >
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
                                        <>
                                            <div className='px-[10px]' >
                                                <Slider
                                                    value={[find_filter(filters, "price_gte").price_gte, find_filter(filters, "price_lte").price_lte]}
                                                    max={filter_options.price_lte}
                                                    min={0}
                                                    onChange={(e, new_prices) => {
                                                        apply_filter({ price_gte: Number(new_prices[0]) });
                                                        apply_filter({ price_lte: Number(new_prices[1]) });
                                                        filter_method({ price_gte: Number(new_prices[0]) }, set_filters)
                                                        filter_method({ price_lte: Number(new_prices[1]) }, set_filters)
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
                                                    value={find_filter(filters, "price_lte")?.price_lte ?? ""}
                                                    onChange={(e) => apply_filter({ price_lte: Number(e.target.value) })}
                                                    className='w-[75px] h-[45px] border border-stone-400 text-stone-900 text-[15px] px-[10px] text-center outline-none placeholder-stone-900' />
                                            </div>

                                        </>

                                    </div>
                                </Fade>


                                {/* Apply Button */}
                                <Fade>
                                    <div className='mt-[20px] mb-[50px] w-full'>
                                        <button
                                            onClick={() => get_all_products_api(axios, convert_to_query_string(filters), set_products, set_show_more_payload, set_is_loading)}
                                            className='bg-black font-bold text-white hover:opacity-75 active:opacity-50 transition-all py-[15px] w-full' >
                                            Apply
                                        </button>
                                    </div>
                                </Fade>
                                {/* end */}
                            </>
                        }
                    </div>
                </div>


                {/* Product Section */}
                <div className='flex-[5]'>
                    {/* Header */}
                    <div className='w-full flex justify-between items-center py-[15px] mb-[30px] lg:pt-[10px] lg:mb-[15px] sticky  top-[70px] bg-white z-[4] px-[16px]' >

                        <button onClick={() => toggle_drawer("filter_drawer_admin")} className='flex gap-2 items-center lg:hidden'>
                            {is_loading ?
                                <Skeleton
                                    variant='rounded'
                                    animation="wave"
                                    className='bg-stone-100 w-[80px]'
                                />
                                : !is_loading ?
                                    <>
                                        <LuFilter className='text-[20px] text-stone-600' />
                                        <h1 className='text-[15px] text-stone-900'>Filter</h1>
                                    </>
                                    :
                                    <div className='h-[40px]' ></div>
                            }
                        </button>

                        {is_loading ?
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 w-[90px] md:w-[200px] xl:w-[350px] h-[40px]'

                            />
                            : (Boolean(products.length)) ?

                                <div className='flex items-center gap-2'>
                                    <h1 className='text-[16px] text-stone-700 pr-3 hidden lg:block'>View As</h1>
                                    <button onClick={() => change_grid(1)} className={`border border-stone-500 p-1`} >
                                        <MdTableRows className={`text-[22px] text-stone-800 ${grid === 1 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                    </button>
                                    <button onClick={() => change_grid(2)} className={`border border-stone-500 p-1`} >
                                        <TfiLayoutColumn2Alt className={`text-[22px] text-stone-800 ${grid === 2 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                    </button>
                                    <button onClick={() => change_grid(3)} className={`border border-stone-500 p-1 hidden xl:block`} >
                                        <TfiLayoutColumn3Alt className={`text-[22px] text-stone-800 ${grid === 3 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                    </button>
                                    <button onClick={() => change_grid(4)} className={`border border-stone-500 p-1 hidden xl:block`} >
                                        <TfiLayoutColumn4Alt className={`text-[22px] text-stone-800 ${grid === 4 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                    </button>
                                </div>
                                :
                                <div className='h-[40px]' ></div>
                        }

                        {is_loading ?
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 w-[80px] md:w-[180px] xl:w-[250px] md:h-[40px]'

                            />
                            : (Boolean(products.length) && Boolean(find_filter(filters, "sort_by"))) ?
                                <>
                                    <button
                                        onClick={() => toggle_drawer("sort_drawer_admin")}
                                        className='flex justify-center items-center lg:hidden'
                                    >
                                        <h1 className='text-[15px] text-black'>Sort By</h1>
                                        <KeyboardArrowDownIcon className='text-stone-400 block lg:hidden scale-[.8]' />
                                    </button>

                                    <div className='hidden lg:flex justify-center items-center gap-4'>
                                        <h1 className='text-[15px] text-black'>Sort By</h1>
                                        <button
                                            aria-describedby='sort_popover'
                                            onClick={handle_sort_pop}
                                            className='flex justify-center items-center w-[160px] px-[10px] border border-stone-300 py-[10px]'
                                        >
                                            <p className='w-[120px] text-[15px ] text-nowrap overflow-hidden text-stone-700 text-ellipsis capitalize'>
                                                {sort_options.find(each => each.option === find_filter(filters, "sort_by").sort_by)?.title}
                                            </p>
                                            <KeyboardArrowDownIcon className='text-stone-400' />
                                        </button>
                                    </div>

                                    <Sort_popover
                                        anchorEl={anchorEl}
                                        close={() => setAnchorEl(null)}
                                        sort_options={sort_options}
                                        filters={filters}
                                        set_filters={set_filters}
                                        axios={axios}
                                        get_all_products_api={get_all_products_api}
                                        convert_to_query_string={convert_to_query_string}
                                        set_products={set_products}
                                        set_show_more_payload={set_show_more_payload}
                                        set_is_loading={set_is_loading}
                                    />
                                </>
                                :
                                <div className='h-[40px]' ></div>
                        }
                    </div>

                    {/* Products */}
                    <div style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }} className={`${!is_loading && !Boolean(products.length) ? "flex" : "grid gap-x-2 gap-y-4"} transition-all`}>
                        {is_loading ?
                            [...Array(16)].map((_, i) => (
                                <Fade key={i}>
                                    <div className={`p-2 md:p-4 flex gap-2 ${grid === 1 ? "flex-col sm:flex-row" : "flex-col"}`}>
                                        <Skeleton
                                            variant='rounded'
                                            animation="wave"
                                            className={`
                                                ${grid === 1 ? "w-full sm:w-[250px] md:w-[300px] 2xl:w-[350px] h-[450px] sm:h-[500px] md:h-[320px] xl:h-[380px]" : ""}
                                                ${grid === 2 ? "w-full h-[200px] md:h-[400px] xl:h-[640px]" : ""}
                                                ${grid === 3 ? "w-full h-[320px] xl:h-[420px]" : ""}
                                                ${grid === 4 ? "w-full h-[300px]" : ""}
                                                bg-stone-100
                                            `}
                                        />
                                        <div>
                                            <Skeleton
                                                variant='text'
                                                animation="wave"
                                                className='bg-stone-100 w-[140px] md:w-[160px]'
                                            />
                                            <div className='mt-4 flex flex-col gap-1' >
                                                <Skeleton
                                                    variant='rounded'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[90px] md:w-[100px] h-[14px]'
                                                />
                                                <Skeleton
                                                    variant='rounded'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[70px] md:w-[80px] h-[14px]'
                                                />
                                                <Skeleton
                                                    variant='rounded'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[120px] md:w-[140px] h-[14px]'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Fade>
                            ))
                            : Boolean(products.length) ?
                                products.map((product) => (
                                    <Fade key={product._id}>
                                        <Link href={`/admin/update-product?product_id=${product._id}`} >
                                            <div
                                                className={`p-2 md:p-4 flex gap-2 cursor-pointer ${grid === 1 ? "flex-col sm:flex-row" : "flex-col"}`}
                                            >
                                                <div className='relative'>
                                                    <div className={`overflow-hidden shadow-sm relative`}>
                                                        <img
                                                            alt=""
                                                            src={select_thumbnail_from_media(product.media)}
                                                            onError={(e) => e.target.src = "/images/logo_error.png"}
                                                            className={`

                                                        ${grid === 1 ? "w-full sm:w-[250px] md:w-[300px] 2xl:w-[350px] h-[450px] sm:h-[500px] md:h-[320px] xl:h-[380px]" : ""}
                                                        ${grid === 2 ? "w-full h-[200px] md:h-[400px] xl:h-[640px]" : ""}
                                                        ${grid === 3 ? "w-full h-[320px] xl:h-[420px]" : ""}
                                                        ${grid === 4 ? "w-full h-[300px]" : ""}
                                                            
                                                            overflow-hidden object-cover object-center lg:hover:scale-[1.1] transition-all duration-500`} />

                                                        {calculate_product_stock(product) === 0 &&
                                                            <span className='absolute inset-0 text-center w-full h-full bg-[rgba(0,0,0,.6)] flex justify-center items-center text-gray-200 font-bold text-[17px]'>
                                                                SOLD OUT
                                                            </span>
                                                        }
                                                    </div>
                                                    {Boolean(calculate_discount_precentage(product.price, product.compare_price)) &&
                                                        <p className='w-[45px] h-[45px] text-center text-[13px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-23px] right-[2px] z-[10]' >
                                                            {`-${calculate_discount_precentage(product.price, product.compare_price)}%`}
                                                        </p>
                                                    }

                                                </div>


                                                <div className='flex flex-col gap-1'>
                                                    <p className='text-[16px] font-bold text-stone-600 line-clamp-1 overflow-hidden text-ellipsis' >{product.title}</p>
                                                    <p className='mt-2 line-clamp-1 overflow-hidden text-ellipsis' >
                                                        <span className='text-[15px] font-bold text-black'>
                                                            Rs. {product.price.toLocaleString("en-US")}
                                                        </span>
                                                        {" "}
                                                        {Boolean(product.compare_price) &&
                                                            <span className='text-[13px] line-through text-red-600'>
                                                                Rs. {product.compare_price.toLocaleString("en-US")}
                                                            </span>
                                                        }
                                                    </p>
                                                    {!product.has_variants &&
                                                        <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                                                    }
                                                    {product.condition !== "brand new" &&
                                                        <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                                                    }
                                                    <p className='text-[14px] text-black line-clamp-2 overflow-hidden text-ellipsis' >Date: {date_formatter(product.createdAt)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </Fade>
                                ))
                                :
                                <Fade>
                                    <div className='w-full h-[50vh] flex justify-center items-center' >
                                        <p className='text-center select-none text-stone-600 text-[15px] md:text-[17px] lg:text-[20px] font-bold px-[30px] w-full'>No product was found. Try to remove filters or reload this page</p>
                                    </div>
                                </Fade>
                        }
                    </div>

                    {(show_more_payload.hasMore && !is_loading) &&
                        <Fade>
                            <div className='my-[50px] w-full flex justify-center items-center'>
                                <button
                                    disabled={!show_more_payload.hasMore && is_loading && show_more_loading}
                                    onClick={show_more_payload_func}
                                    className='font-bold text-black hover:text-white active:opacity-50 transition-all py-[12px] w-full md:w-[300px] hover:bg-black bg-white border border-stone-400 duration-300' >

                                    {show_more_loading ?
                                        <CircularProgress size={17} color='inherit' />
                                        :
                                        "Show More"}
                                </button>
                            </div>
                        </Fade>
                    }

                </div>



            </div>
        </div>
    )
}

export default All_products



