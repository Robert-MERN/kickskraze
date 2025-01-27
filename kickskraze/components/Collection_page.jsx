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
import Slider from '@mui/material/Slider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TfiLayoutColumn2Alt } from "react-icons/tfi";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";
import { TfiLayoutColumn4Alt } from "react-icons/tfi";
import { MdTableRows } from "react-icons/md";
import product_image from "@/public/images/product_image.webp"
import Image from 'next/image';
import Link from 'next/link';
import { LuFilter } from "react-icons/lu";
import useStateContext from '@/context/ContextProvider';
import Popover from '@mui/material/Popover';
import { IoClose } from "react-icons/io5";
import { products } from '@/models/product_schema';
import { Skeleton } from '@mui/material';


// Sort Popover for Windows Screens
const Sort_popover = ({ anchorEl, close, sort_options, filters, set_filters }) => {

    const open = Boolean(anchorEl);
    const id = open ? "sort_popover" : undefined;


    const select_option = (obj) => {
        filter_method(obj, set_filters);
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



const Collection_page = ({ axios }) => {

    const [is_loading, set_is_loading] = useState(false);

    const { filters,
        set_filters,
        default_filters,
        filter_started,
        set_filter_started,

    } = useStateContext();

    useEffect(() => {
        set_filters(default_filters);
    }, [])

    const { toggle_drawer } = useStateContext();

    const conditions = ["excellent", "premium", "premium+", "very good"];
    const brands = ["asics", "rebook", "nike", "fila", "brooks", "hoka", "converse", "adidas", "sacouny", "under armor", "vty", "vans"];

    useEffect(() => {
        document.querySelectorAll(".MuiCheckbox-root").forEach((each, _) => each.style = "color: #292524")
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


    // Grid state changing dynamicly
    const [grid, set_grid] = useState(4);
    const [screenWidth, setScreenWidth] = useState(0); // Default to 0 (for SSR safety)

    const change_grid = (val) => {
        set_grid(val); // Manually set the grid value
    };


    useEffect(() => {
        // Ensure the code runs only on the client-side (browser)
        if (typeof window !== "undefined") {
            const handleResize = () => {
                const currentWidth = window.innerWidth;

                // Update screenWidth state
                setScreenWidth(currentWidth);

                // Automatically adjust the grid based on screen width
                if (currentWidth >= 1536) {
                    set_grid(4);
                } else if (currentWidth >= 1280) {
                    set_grid(3);
                } else if (currentWidth >= 1024) {
                    set_grid(2);
                } else {
                    set_grid(2);
                }
            };

            // Initial check
            handleResize();

            // Add resize event listener
            window.addEventListener("resize", handleResize);

            // Cleanup on unmount
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [screenWidth]); // Dependency ensures effect runs when screenWidth changes


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

    console.log(filters)

    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] '>
            <div className='w-full flex gap-4' >

                {/* Filter Section */}
                <div className={`xl:flex-[1.2] 2xl:flex-[1.1] py-[10px] hidden lg:block`}>
                    <div className={`w-full h-[calc(100vh-105px)] md:h-[calc(100vh-120px)] overflow-y-auto sticky top-0 overflow-x-hidden px-[15px] ${styles.scroll_bar}`} >
                        {(is_loading || Boolean(!products.length)) ?
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 w-full h-full'

                            />

                            :
                            <>
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
                                            className='flex items-center'
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

                                <div className='mt-[20px] mb-[50px] w-full'>
                                    <button onClick={fetch_filter} className='bg-black font-bold text-white hover:opacity-75 active:opacity-50 transition-all py-[15px] w-full' >
                                        Apply
                                    </button>
                                </div>
                                {/* end */}
                            </>

                        }

                    </div>
                </div>


                {/* Product Section */}
                <div className='flex-[5]'>


                    {/* Header */}
                    <div className='w-full flex justify-between items-center py-[15px] lg:py-0 mb-[30px] sticky lg:static top-0 bg-white z-[12] lg:z-0 px-[16px]' >

                        <button onClick={() => toggle_drawer("filter_drawer")} className='flex gap-2 items-center lg:hidden'>
                            {(is_loading || Boolean(!products.length)) ?
                                <Skeleton
                                    variant='rounded'
                                    animation="wave"
                                    className='bg-stone-100 w-[80px]'

                                />
                                :
                                <>
                                    <LuFilter className='text-[20px] text-stone-600' />
                                    <h1 className='text-[15px] text-stone-900'>Filter</h1>
                                </>
                            }
                        </button>

                        {(is_loading || Boolean(!products.length)) ?
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 w-[90px] md:w-[200px] xl:w-[350px] h-[40px]'

                            />
                            :

                            <div className='flex items-center gap-2'>
                                <h1 className='text-[16px] text-stone-700 pr-3 hidden lg:block'>View As</h1>
                                <button onClick={() => change_grid(1)} className={`border border-stone-500 p-1`} >
                                    <MdTableRows className={`text-[22px] text-stone-800 ${grid === 1 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                </button>
                                <button onClick={() => change_grid(2)} className={`border border-stone-500 p-1`} >
                                    <TfiLayoutColumn2Alt className={`text-[22px] text-stone-800 ${grid === 2 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                </button>
                                <button onClick={() => change_grid(3)} className={`border border-stone-500 p-1 hidden lg:block`} >
                                    <TfiLayoutColumn3Alt className={`text-[22px] text-stone-800 ${grid === 3 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                </button>
                                <button onClick={() => change_grid(4)} className={`border border-stone-500 p-1 hidden lg:block`} >
                                    <TfiLayoutColumn4Alt className={`text-[22px] text-stone-800 ${grid === 4 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                                </button>
                            </div>
                        }

                        {(is_loading || Boolean(!products.length)) ?
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='bg-stone-100 w-[80px] md:w-[180px] xl:w-[250px] md:h-[40px]'

                            />
                            :
                            <>
                                <button
                                    onClick={() => toggle_drawer("sort_drawer")}
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
                                            {sort_options.find(each => each.option === find_filter(filters, "sort_by").sort_by).title}
                                        </p>
                                        <KeyboardArrowDownIcon className='text-stone-400' />
                                    </button>
                                </div>
                            </>

                        }

                        <Sort_popover
                            anchorEl={anchorEl}
                            close={() => setAnchorEl(null)}
                            sort_options={sort_options}
                            filters={filters}
                            set_filters={set_filters}
                        />
                    </div>

                    {/* Products */}
                    <div style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }} className={`grid gap-x-2 gap-y-4 transition-all`}>
                        {(is_loading || Boolean(!products.length)) ?
                            [...Array(16)].map((_, i) => (
                                <div key={i} className='p-4 cursor-pointer'>
                                    <Skeleton
                                        variant='rounded'
                                        animation="wave"
                                        className='bg-stone-100 w-full h-[170px]'
                                    />
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
                            ))
                            :
                            products.map((product, i) => (
                                <Link href={`/product?id=${product._id}`} key={i}>
                                    <div
                                        className={`p-2 md:p-4 flex gap-2 cursor-pointer ${grid === 1 ? "flex-col sm:flex-row" : "flex-col"}`}
                                    >
                                        <div className='relative'>
                                            <div className={`${grid === 1 ? "w-full sm:w-[250px] md:[300px] 2xl:w-[350px] h-[275px] md:h-[250px] xl:h-[265px]" : grid === 2 ? "w-full h-[150px] sm:h-[200px] md:h-[260px] xl:h-[430px]" : grid === 3 ? "w-full h-[220px]  xl:h-[275px]" : "w-full h-[140px] xl:h-[200px]"} overflow-hidden shadow-sm`}>

                                                <Image alt="Product" src={product_image} className={`${grid === 1 ? "w-full sm:w-[250px] md:[300px] 2xl:w-[350px] h-[275px] md:h-[250px] xl:h-[265px]" : grid === 2 ? "w-full h-[150px] sm:h-[200px] md:h-[260px] xl:h-[430px]" : grid === 3 ? "w-full h-[220px]  xl:h-[275px]" : "w-full h-[140px] xl:h-[200px]"} object-contain`} />


                                            </div>
                                            <p className='w-[45px] h-[45px] text-center text-[13px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-23px] right-[2px] z-[10]' >
                                                -66%
                                            </p>
                                        </div>


                                        <div className='flex flex-col gap-1'>
                                            <p className='text-[16px] font-bold text-stone-600 line-clamp-1 overflow-hidden text-ellipsis' >{product.title}</p>
                                            <p className='mt-2 line-clamp-1 overflow-hidden text-ellipsis' >
                                                <span className='text-[15px] font-bold text-black'>
                                                    Rs. {product.price.toLocaleString("en-US")}
                                                </span>
                                                {" "}
                                                <span className='text-[13px] line-through text-red-600'>
                                                    Rs. {product.price.toLocaleString("en-US")}
                                                </span>
                                            </p>
                                            <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                                            <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    <div className='my-[50px] w-full flex justify-center items-center'>
                        <button onClick={fetch_filter} className='font-bold text-black hover:text-white active:opacity-50 transition-all py-[12px] w-full md:w-[300px] hover:bg-black bg-white border border-stone-400 duration-300' >
                            Show More
                        </button>
                    </div>

                </div>



            </div>
        </div>
    )
}

export default Collection_page



