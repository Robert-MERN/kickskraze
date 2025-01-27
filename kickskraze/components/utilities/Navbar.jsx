import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import Badge from "@mui/material/Badge";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import useStateContext from "@/context/ContextProvider";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import style from "@/styles/home.module.css";
import { products } from '@/models/product_schema';
import product_image from "@/public/images/product_image.webp"
import Fade from '@mui/material/Fade';


import { Popper } from "@mui/material";

const SearchPopper = ({ anchorEl, open, onClose, forwardRef, searchTerm, results }) => {

    const trending_options = [
        {
            option: "men",
            link: "#",
        },
        {
            option: "women",
            link: "#",
        },
        {
            option: "kids",
            link: "#",
        },
        {
            option: "converse",
            link: "#",
        },
        {
            option: "nike",
            link: "#",
        },
        {
            option: "asics",
            link: "#",
        },
        {
            option: "adidas",
            link: "#",
        },
        {
            option: "new balance",
            link: "#",
        },
        {
            option: "saucony",
            link: "#",
        },
        {
            option: "fila",
            link: "#",
        },
    ]
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
            className="z-[11] hidden lg:block"
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <div
                        className="w-[600px] py-[15px] px-[20px] bg-white rounded-md text-stone-950 shadow-lg border"
                    // onMouseLeave={onClose} // Optional: close when mouse leaves
                    >
                        {searchTerm ?

                            <>
                                <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-2' >
                                    <p className='text-[15px] font-bold select-none' >PRODUCT RESULTS</p>
                                </div>
                                {!results.length ?
                                    <>
                                        <div className="grid grid-cols-3 gap-2">
                                            {products.slice(0, 3).map((product, i) => (
                                                <Link href={`/product?id=${product._id}`} key={i}>
                                                    <div
                                                        className={`p-2 md:p-4 flex flex-col gap-2 cursor-pointer w-fit`}
                                                    >
                                                        <div className='relative'>
                                                            <div className={`"w-full h-[150px] overflow-hidden shadow-sm`}>

                                                                <Image alt="Product" src={product_image} className={`w-full h-[150px] hover:scale-[1.1] object-contain transition-all duration-500`} />

                                                                <p className='w-[35px] h-[35px] text-center text-[12px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-8px] right-[2px] z-[10]' >
                                                                    -66%
                                                                </p>
                                                            </div>
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
                                        <div className='w-full flex justify-center py-[20px] px-[20px] border-t border-stone-200' >
                                            <button className='w-full text-[17px] font-medium text-stone-700 select-none text-center' >View all results (4000)</button>
                                        </div>
                                    </>

                                    :
                                    <div className='w-full py-[30px] px-[20px]' >
                                        <p className='text-[15px] font-semibold select-none text-center line-clamp-1 text-ellipsis overflow-hidden' >
                                            <span className="text-stone-500" >couldnt' find for</span>
                                            {" "}
                                            <span className="text-stone-800 text-[16px]">{`"${searchTerm}"`}</span>
                                        </p>
                                    </div>
                                }

                            </>

                            :
                            <>

                                <div className='flex justify-between w-full items-center py-[12px] px-[20px] border-b border-stone-200' >
                                    <p className='text-[15px] font-bold select-none' >TRENDING NOW</p>
                                    <button onClick={onClose} className='active:opacity-75' >
                                        <IoClose className='text-stone-700 scale-[1.30]' />
                                    </button>

                                </div>

                                <div className={`flex gap-3 flex-wrap w-full items-center py-[12px] px-[20px] h-[120px] overflow-y-auto ${style.scroll_bar}`}>
                                    {trending_options.map((each, index) => (
                                        <Link href={each.link} key={index}>
                                            <div className='px-[8px] py-[6px] bg-gray-100 active:bg-gray-300 text-gray-500  rounded-md flex items-center gap-1 text-[15px] font-medium transition-all' >
                                                <SearchIcon className="text-[20px]" />
                                                <p>{each.option}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-2' >
                                    <p className='text-[15px] font-bold select-none' >POPULAR PRODUCTS</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {products.slice(0, 3).map((product, i) => (
                                        <Link href={`/product?id=${product._id}`} key={i}>
                                            <div
                                                className={`p-2 md:p-4 flex flex-col gap-2 cursor-pointer`}
                                            >
                                                <div className='relative'>
                                                    <div className={`"w-full h-[150px] overflow-hidden shadow-sm`}>

                                                        <Image alt="Product" src={product_image} className={`w-full h-[150px] hover:scale-[1.1] object-contain transition-all duration-500`} />


                                                    </div>
                                                    <p className='w-[35px] h-[35px] text-center text-[12px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-8px] right-[2px] z-[10]' >
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
                            </>
                        }
                    </div>
                </Fade>
            )}
        </Popper>
    );
};




const Navbar = () => {
    const { toggle_drawer, cart } = useStateContext();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #292524")
    }, []);





    // <--------------------------------- Search Logic and Search Popper Display Logic --------------------------------->
    // Search Product Logic
    const [searchTerm, setSearchTerm] = useState(""); // Input value
    const [debouncedTerm, setDebouncedTerm] = useState(""); // Debounced value
    const [results, setResults] = useState([]); // Search results

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500); // Wait for 500ms after user stops typing

        return () => clearTimeout(timer); // Cleanup previous timer
    }, [searchTerm]);

    // Fetch results when the debounced term changes
    useEffect(() => {
        if (debouncedTerm) {
            console.log("triggered search")
            // fetchResults();
        } else {
            setResults([]); // Clear results if input is empty
        }
    }, [debouncedTerm]);

    // Search Popper Logic
    const [anchorEl, setAnchorEl] = useState(null);
    const handleSearchOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSearchClose = () => {
        setAnchorEl(null);
    };

    const anchorRef = useRef(null);
    const popperRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            anchorRef.current &&
            !anchorRef.current.contains(event.target) &&
            popperRef.current &&
            !popperRef.current.contains(event.target)
        ) {
            setAnchorEl(null);
        }
    };

    useEffect(() => {
        // Add event listener to handle clicks outside
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Cleanup event listener
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // <===========  LOGIC ENDS HERE  ===============>




    return (
        <div className="px-[30px] w-full h-[70px] flex lg:justify-between items-center bg-white shadow-[0_1px_3px_#0000001a]">
            <div className="w-full flex lg:hidden items-center gap-6 transition-all">
                <button onClick={() => toggle_drawer("menu_drawer")}>
                    <RxHamburgerMenu className="text-[26px] text-stone-800 active:text-stone-500 cursor-pointer" />
                </button>

                <button onClick={() => toggle_drawer("search_drawer")}>
                    <SearchIcon className="text-stone-800 scale-[1.20] active:text-stone-500 cursor-pointer" />
                </button>
            </div>
            <div className="flex lg:hidden w-full justify-center">
                <Link href="/">
                    <Image alt="logo" priority src={logo} className="w-[90px] object-contain" />
                </Link>
            </div>

            {/* Logo and Optoins Div */}
            <div className="hidden lg:flex items-center h-full w-full gap-16">
                {/* Logo Div */}
                <div className="w-[120px]">
                    <Link href="/" >
                        <Image alt="logo" priority src={logo} className="w-[90px] object-contain" />
                    </Link>
                </div>
                {/* Options Div */}
                <div className="flex h-full items-center">
                    <ul className="flex gap-10 items-center justify-center text-center">
                        <li>
                            <Link
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="/collection"
                            >
                                Collections
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="/collection"
                            >
                                Women
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="/collection"
                            >
                                Men
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                href="/collection"
                            >
                                Kids
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`font-semibold text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100 `}
                                href="/collection"
                            >
                                Exclusive
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Search Div */}
            <div className="w-full h-full flex justify-end items-center gap-6 ">

                <div
                    className="hidden lg:flex h-full items-center"
                >
                    <input
                        className="outline-none px-[15px] py-[3px] border border-stone-300 text-[16px] h-[40px] w-[230px]"
                        placeholder="Search"
                        type="text"
                        value={searchTerm}
                        ref={anchorRef}
                        onFocus={handleSearchOpen} // Open popper on focus
                        onChange={(event) => { setSearchTerm(event.target.value); handleSearchOpen(event) }} // Open popper on focus
                    />
                    <button className="bg-stone-800 flex items-center justify-center text-[16px] w-[40px] h-[40px] active:opacity-70 transition-all">
                        <SearchIcon className="text-white" />
                    </button>
                </div>

                <SearchPopper
                    forwardRef={popperRef}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleSearchClose}
                    searchTerm={searchTerm}
                    results={results}
                />


                <div>
                    <Link href={"/cart"}>
                        <button className="active:text-stone-(400 text-stone-800 transition-all">
                            <Badge badgeContent={cart.reduce((sum, current) => (sum + current.quantity), 0)} color="info" showZero>
                                <FiShoppingCart className="text-[24px]" />
                            </Badge>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
