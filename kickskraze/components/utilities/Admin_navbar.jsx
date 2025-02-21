import React, { useEffect, useState, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import useStateContext from "@/context/ContextProvider";
import Link from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import SearchPopperAdmin from "@/utils/popper/Search_popper_admin";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";


const Admin_navbar = () => {

    const router = useRouter();
    const { toggle_drawer, toggle_modal, get_all_products_api } = useStateContext();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #292524")
    }, []);


    // <--------------------------------- Search Logic and Search Popper Display Logic --------------------------------->
    // Search Product Logic
    const [searchTerm, setSearchTerm] = useState(null); // Input value
    const [debouncedTerm, setDebouncedTerm] = useState(null); // Debounced value
    const [results, set_results] = useState([]); // Search results
    const [trending_results, set_trending_results] = useState([]); // Trending results
    const [is_loading, set_is_loading] = useState("default");
    const [is_trending_loading, set_is_trending_loading] = useState(false);
    const [fake_is_loading, set_fake_is_loading] = useState(false);


    // Fetching Search products
    const [show_more_payload, set_show_more_payload] = useState({
        limit: 52,
        page: 1,
        hasMore: false,
        count: 0,
    });
    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.search) {
            setSearchTerm(router.query.search);
        }
    }, [router.query, router.isReady])


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



    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500); // Wait for 500ms after user stops typing

        return () => clearTimeout(timer); // Cleanup previous timer
    }, [searchTerm]);


    // Fetch results when the debounced term changes
    useEffect(() => {
        // Set loading state **before** starting the fetch
        set_is_loading("started");

        const fetchResults = async () => {
            try {
                await get_all_products_api(axios, `search=${debouncedTerm}`, set_results, set_show_more_payload, set_fake_is_loading);
            } catch (err) {
                console.error(err);
            } finally {
                set_is_loading("ended");
            }
        };
        if (anchorEl && debouncedTerm !== null) {
            fetchResults();
        }
    }, [debouncedTerm, anchorEl]);

    useEffect(() => {
        if (is_loading === "ended" && !searchTerm) {
            set_is_loading("default");
        };
    }, [is_loading, searchTerm]);

    const search_btn = () => {
        if (results.length) {
            setAnchorEl(null);
            router.push(`/collection?search=${debouncedTerm}`)
        }
    }

    // Fetching Trending Products
    useEffect(() => {
        const fetch = async () => {
            if (anchorEl) {
                set_is_trending_loading(true)
                try {
                    await get_all_products_api(axios, "featured=true", set_trending_results, set_show_more_payload, set_fake_is_loading);
                } catch (err) {
                    console.error(err);
                } finally {
                    set_is_trending_loading(false)
                }
            }
        }
        if (!trending_results.length) {
            fetch();
        }
    }, [anchorEl]);

    // <=============================================== *** ENTIRE SEARCH LOGIC ENDS HERE *** ============================================>


    return (
        <div className="px-[30px] w-full h-[70px] flex lg:justify-between items-center fixed top-0 z-10 bg-white  backdrop-blur-[10px] border-b border-b-slate-200">
            <div className="w-full flex lg:hidden items-center gap-6 transition-all">
                <button onClick={() => toggle_drawer("admin_menu_drawer")}>
                    <RxHamburgerMenu className="text-[26px] text-stone-800 active:text-stone-500 cursor-pointer" />
                </button>
            </div>
            <div className="flex lg:hidden w-full justify-center">
                <Link href="/">
                    <Image alt="logo" priority src={logo} className="w-[220px] object-contain" />
                </Link>
            </div>

            {/* Logo and Optoins Div */}
            <div className="hidden lg:flex items-center h-full w-full gap-16">
                {/* Logo Div */}
                <div className="w-[220px]">
                    <Link href="/" >
                        <Image alt="logo" priority src={logo} className="w-[220px] object-contain" />
                    </Link>
                </div>
            </div>

            {/* Logout Button */}
            <div className="w-full h-full flex justify-end items-center gap-2 lg:gap-6 ">

                <div className="lg:hidden" >
                    <IconButton onClick={() => toggle_drawer("search_drawer_admin")}>
                        <SearchIcon className="text-stone-800 scale-[1.1] active:text-stone-500 cursor-pointer" />
                    </IconButton>
                </div>

                <div className="hidden lg:flex h-full items-center">
                    <input
                        className="outline-none px-[15px] py-[3px] border border-stone-300 text-[16px] h-[40px] w-[230px]"
                        placeholder="Search"
                        type="text"
                        value={searchTerm || ""}
                        ref={anchorRef}
                        onFocus={handleSearchOpen} // Open popper on focus
                        onChange={(event) => { setSearchTerm(event.target.value); handleSearchOpen(event) }} // Open popper on focus
                    />
                    <button onClick={search_btn} className="bg-stone-800 flex items-center justify-center text-[16px] w-[40px] h-[40px] active:opacity-70 transition-all">
                        <SearchIcon className="text-white" />
                    </button>
                </div>

                <SearchPopperAdmin
                    forwardRef={popperRef}
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleSearchClose}
                    debouncedTerm={debouncedTerm}
                    searchTerm={searchTerm}
                    results={results}
                    trending_results={trending_results}
                    is_loading={is_loading}
                    is_trending_loading={is_trending_loading}
                    show_more_payload={show_more_payload}
                    router={router}
                />

                <div>
                    <IconButton onClick={() => toggle_modal("logout_modal")}>
                        <LogoutIcon className="text-[24px] md:text-[26px] text-stone-900" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default Admin_navbar;
