import React from 'react'
import { IoClose } from "react-icons/io5";
import style from "@/styles/home.module.css";
import Fade from '@mui/material/Fade';
import RevealFade from "react-reveal/Fade";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { Popper, Skeleton } from "@mui/material";
import { calculate_discount_precentage, calculate_product_stock, select_thumbnail_from_media } from '../functions/produc_fn';
import useStateContext from '@/context/ContextProvider';

const SearchPopper = ({ anchorEl, setAnchorEl, open, onClose, forwardRef, debouncedTerm, searchTerm, results, trending_results,
    is_loading, is_trending_loading, show_more_payload, router, store_name }) => {

    const { filters } = useStateContext()

    const trending_options = {
        "Footwear": [
            {
                option: "converse",
                link: "/collection/footwear?brand=Converse",
            },
            {
                option: "vans",
                link: "/collection/footwear?brand=Nike",
            },
            {
                option: "heels",
                link: "/collection/footwear?type=heels",
            },
            {
                option: "flats",
                link: "/collection/footwear?type=flats",
            },
            {
                option: "sandals",
                link: "/collection/footwear?type=sandals",
            },
            {
                option: "women sandals",
                link: "/collection/footwear?type=heels,flats,sandals",
            },
            {
                option: "men",
                link: "/collection/footwear?category=men",
            },
            {
                option: "women",
                link: "/collection/footwear?category=women",
            },
            {
                option: "kids",
                link: "/collection/footwear?category=kids",
            },
        ],
        "Jewelry": [
            {
                option: "bracelets",
                link: "/collection/jewellry?type=bracelets",
            },
            {
                option: "cuffs",
                link: "/collection/jewellry?type=bracelets",
            },
            {
                option: "pendants",
                link: "/collection/jewellry?type=pendants",
            },
            {
                option: "chains",
                link: "/collection/jewellry?type=pendants",
            },
            {
                option: "lockets",
                link: "/collection/jewellry?type=pendants",
            },
            {
                option: "rings",
                link: "/collection/jewellry?type=rings",
            },
            {
                option: "men rings",
                link: "/collection/jewellry?type=rings&category=men",
            },
            {
                option: "earrings",
                link: "/collection/jewellry?type=earrings",
            },
        ],
        "Apparel": [
            {
                option: "t-shirts",
                link: "/collection/apparel?type=casual",
            },
            {
                option: "jeans",
                link: "/collection/apparel?type=casual",
            },
            {
                option: "suits",
                link: "/collection/apparel?type=formal&category=men",
            },
            {
                option: "dress shirts",
                link: "/collection/apparel?type=formal&category=men",
            },
            {
                option: "tracksuits",
                link: "/collection/apparel?type=sportswear",
            },
            {
                option: "night suits",
                link: "/collection/apparel?type=sleepwear",
            },
            {
                option: "pajamas",
                link: "/collection/apparel?type=sleepwear",
            },
            {
                option: "jackets",
                link: "/collection/apparel?type=outerwear",
            },
            {
                option: "Sweatshirts",
                link: "/collection/apparel?type=casual",
            },
            {
                option: "underwear",
                link: "/collection/apparel?type=undergarments&category=men",
            },
            {
                option: "sando",
                link: "/collection/apparel?type=undergarments&category=men",
            },
            {
                option: "women traditional",
                link: "/collection/apparel?type=traditional&category=women",
            },
            {
                option: "kurti",
                link: "/collection/apparel?type=traditional&category=women",
            },
            {
                option: "shalwar kameez",
                link: "/collection/apparel?type=traditional&category=men",
            },

        ],
        "Footwear-accessories": [
            {
                option: "polish",
                link: "/collection/footwear-accessories?type=polish",
            },
            {
                option: "shoe laces",
                link: "/collection/footwear-accessories?type=shoelaces",
            },
            {
                option: "socks",
                link: "/collection/footwear-accessories?type=socks",
            },
            {
                option: "insole",
                link: "/collection/footwear-accessories?type=insole",
            },
            {
                option: "shiner",
                link: "/collection/footwear-accessories?type=shiner",
            },

        ],
    }


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
            pathname: `/collection/${store_name === "Jewelry" ? "jewellry" : store_name.toLowerCase()}`,
            query
        }, undefined, { shallow: true });
    };

    const view_more_btn = () => {
        setAnchorEl(null);
        updateUrlFromFilters([{ search: debouncedTerm }, ...filters]);
    }

    return (
        <Popper
            ref={forwardRef}
            open={open}
            disablePortal={true}
            anchorEl={anchorEl}
            placement="bottom-end"
            transition
            strategy="fixed" // Ensures the Popper stays in the viewport
            modifiers={[
                {
                    name: 'flip',
                    enabled: true,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'viewport', // Keeps Popper within the viewport
                        padding: 8,
                    },
                },
                {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                        altAxis: true, // Prevents overflow on alternate axes
                        altBoundary: true,
                        tether: true,
                        rootBoundary: 'viewport', // Restricts to the viewport
                        padding: 8,
                    },
                },
                {
                    name: 'offset',
                    options: {
                        offset: [0, 10], // Adds spacing between Popper and anchor
                    },
                },
            ]}
            className="z-[15] hidden lg:block"
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <div
                        className="w-[600px] py-[15px] px-[20px] bg-white rounded-md text-stone-950 shadow-lg border"
                    >
                        {searchTerm ?
                            <>
                                <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-2' >
                                    <RevealFade>
                                        <p className='text-[15px] font-bold select-none' >PRODUCT RESULTS</p>
                                    </RevealFade>
                                </div>
                                {((is_loading === "started" || is_loading === "default")) ?
                                    <div className="grid grid-cols-3 gap-2">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index}>
                                                <Skeleton
                                                    variant="rounded"
                                                    animation="wave"
                                                    className='bg-stone-100 w-full h-[150px]'
                                                />
                                                <Skeleton
                                                    variant='text'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[75%]'
                                                />
                                                <div className='mt-4 flex flex-col gap-1' >
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[45%] md:w-[100px] h-[14px]'
                                                    />
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[55%] md:w-[80px] h-[14px]'
                                                    />
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[65%] md:w-[140px] h-[14px]'
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    : (Boolean(results.length)) ?
                                        <>
                                            <div className="grid grid-cols-3 gap-2">
                                                {results.slice(0, 3).map((product) => (
                                                    <Link
                                                        href={`/product?product_id=${product._id}`}
                                                        key={product._id}
                                                        onClick={onClose}
                                                    >
                                                        <div
                                                            className={`p-2 md:p-4 flex flex-col gap-2 cursor-pointer w-fit`}
                                                        >
                                                            <div className='relative'>
                                                                <div className={`"w-full h-[150px] overflow-hidden shadow-sm`}>

                                                                    <img
                                                                        alt=""
                                                                        src={select_thumbnail_from_media(product.media)}
                                                                        className={`w-full h-[150px] lg:hover:scale-[1.1] object-cover transition-all duration-500`}
                                                                        onError={(e) => e.target.src = "/images/logo_error.png"}
                                                                    />

                                                                    {calculate_product_stock(product) === 0 &&
                                                                        <span className='absolute inset-0 text-center w-full h-full bg-[rgba(0,0,0,.6)] flex justify-center items-center text-gray-200 font-bold text-[14px]'>
                                                                            SOLD OUT
                                                                        </span>
                                                                    }

                                                                    {Boolean(calculate_discount_precentage(product.price, product.compare_price)) &&
                                                                        <p className='w-[35px] h-[35px] text-center text-[12px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-8px] right-[2px] z-[10]' >
                                                                            -{calculate_discount_precentage(product.price, product.compare_price)}%
                                                                        </p>
                                                                    }
                                                                </div>
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
                                                                {!product.has_variants && Boolean(product.size) &&
                                                                    <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                                                                }
                                                                {product.condition !== "brand new" &&
                                                                    <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className='w-full flex justify-center py-[20px] px-[20px] border-t border-stone-200' >
                                                <button onClick={view_more_btn} className='w-full text-[17px] font-medium text-stone-700 select-none text-center' >View all results ({show_more_payload.count})</button>
                                            </div>
                                        </>
                                        :
                                        <div className='w-full py-[30px] px-[20px]' >
                                            <p className='text-[15px] font-semibold select-none text-center line-clamp-1 text-ellipsis overflow-hidden' >
                                                <span className="text-stone-500" >couldnt' find for</span>
                                                {" "}
                                                <span className="text-stone-800 text-[16px]">{`"${debouncedTerm}"`}</span>
                                            </p>
                                        </div>

                                }

                            </>

                            :
                            <>
                                {(Boolean(store_name) && Boolean(trending_options[store_name])) && (
                                    <>
                                        <div className='flex justify-between w-full items-center py-[12px] px-[20px] border-b border-stone-200' >
                                            <p className='text-[15px] font-bold select-none' >TRENDING NOW</p>
                                            <button onClick={onClose} className='active:opacity-75' >
                                                <IoClose className='text-stone-700 scale-[1.30]' />
                                            </button>

                                        </div>

                                        <div className={`flex gap-3 flex-wrap w-full items-center py-[12px] px-[20px] h-[120px] overflow-y-auto ${style.scroll_bar}`}>
                                            {trending_options[store_name].map((each, index) => (
                                                <Link onClick={onClose} href={each.link} key={index}>
                                                    <div className='px-[8px] py-[6px] bg-gray-100 active:bg-gray-300 text-gray-500  rounded-md flex items-center gap-1 text-[15px] font-medium transition-all' >
                                                        <SearchIcon className="text-[20px]" />
                                                        <p className='capitalize'>{each.option}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {is_trending_loading ?
                                    <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-2' >
                                        <Skeleton
                                            variant="rounded"
                                            animation="wave"
                                            className='bg-stone-100 w-[38%] h-[19px]'
                                        />
                                    </div>
                                    : (trending_results.length) ?

                                        <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-2' >
                                            <p className='text-[15px] font-bold select-none' >POPULAR PRODUCTS</p>
                                        </div>
                                        :
                                        <></>
                                }

                                {is_trending_loading ?


                                    <div className="grid grid-cols-3 gap-2">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index}>
                                                <Skeleton
                                                    variant="rounded"
                                                    animation="wave"
                                                    className='bg-stone-100 w-full h-[150px]'
                                                />
                                                <Skeleton
                                                    variant='text'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[75%]'
                                                />
                                                <div className='mt-4 flex flex-col gap-1' >
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[45%] md:w-[100px] h-[14px]'
                                                    />
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[55%] md:w-[80px] h-[14px]'
                                                    />
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[65%] md:w-[140px] h-[14px]'
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    : (trending_results.length) ?
                                        <div className="grid grid-cols-3 gap-2">
                                            {trending_results.slice(0, 3).map((product) => (
                                                <Link
                                                    href={`/product?product_id=${product._id}`}
                                                    key={product._id}
                                                    onClick={onClose}
                                                >
                                                    <div
                                                        className={`p-2 md:p-4 flex flex-col gap-2 cursor-pointer w-fit`}
                                                    >
                                                        <div className='relative'>
                                                            <div className={`"w-full h-[150px] overflow-hidden shadow-sm`}>

                                                                <img
                                                                    alt=""
                                                                    src={select_thumbnail_from_media(product.media)}
                                                                    className={`w-full h-[150px] lg:hover:scale-[1.1] object-cover transition-all duration-500`}
                                                                    onError={(e) => e.target.src = "/images/logo_error.png"}
                                                                />

                                                                {!Boolean(product.stock) &&
                                                                    <span className='absolute inset-0 text-center w-full h-full bg-[rgba(0,0,0,.6)] flex justify-center items-center text-gray-200 font-bold text-[14px]'>
                                                                        SOLD OUT
                                                                    </span>
                                                                }

                                                                {Boolean(calculate_discount_precentage(product.price, product.compare_price)) &&

                                                                    <p className='w-[35px] h-[35px] text-center text-[12px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-8px] right-[2px] z-[10]' >
                                                                        -{calculate_discount_precentage(product.price, product.compare_price)}%
                                                                    </p>
                                                                }
                                                            </div>
                                                        </div>


                                                        <div className='flex flex-col gap-1'>
                                                            <p className='text-[16px] font-bold text-stone-600 line-clamp-1 overflow-hidden text-ellipsis' >{product.title}</p>
                                                            <p className='mt-2 line-clamp-1 overflow-hidden text-ellipsis' >
                                                                <span className='text-[15px] font-bold text-black'>
                                                                    Rs. {product.price.toLocaleString("en-US")}
                                                                </span>
                                                                {" "}
                                                                {product.compare_price &&
                                                                    <span className='text-[13px] line-through text-red-600'>
                                                                        Rs. {product.compare_price.toLocaleString("en-US")}
                                                                    </span>
                                                                }
                                                            </p>
                                                            {!product.has_variants && Boolean(product.size) &&
                                                                <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                                                            }
                                                            {product.condition !== "brand new" &&
                                                                <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                                                            }
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        :
                                        <></>

                                }
                            </>
                        }
                    </div>
                </Fade>
            )}
        </Popper>
    );
};


export default SearchPopper