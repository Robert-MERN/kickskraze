import React, { useEffect, useState, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import useStateContext from "@/context/ContextProvider";
import Link from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Popover } from "@mui/material";
import { useRouter } from "next/router";
import SearchPopperAdmin from "@/utils/popper/Search_popper_admin";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StoreIcon from '@mui/icons-material/Store';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SettingsIcon from '@mui/icons-material/Settings';



const User_popover = ({ anchorEl, close, user, toggleLogout, router }) => {
    const open = Boolean(anchorEl);
    const id = open ? "user_popover" : undefined;

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={close}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            PaperProps={{
                className: "!rounded-xl !shadow-md",
            }}
        >
            {Boolean(user) &&
                <div className="w-[240px] py-3 bg-white text-stone-900">

                    {/* Header */}
                    <div className="px-4 pb-3 border-b border-stone-200 flex items-center gap-3">
                        <div className="w-[45px] h-[45px] bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                            <PersonIcon className="text-[30px]" />
                        </div>

                        <div className="flex flex-col">
                            <p className="font-semibold text-[17px] text-stone-800">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="flex items-center gap-1 text-[14px] text-stone-500 capitalize">
                                <StoreIcon className="text-[17px]" />
                                <span>{user.store_name}</span>
                            </p>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col mt-1">


                        <button
                            onClick={() => { router.push("/admin/store-settings"); close(); }}
                            className="flex items-center gap-3 px-4 py-2 text-[15px] hover:bg-stone-100 transition-all"
                        >
                            <AddBusinessIcon className="text-[20px] text-stone-700" />
                            <span>Store Settings</span>
                        </button>

                        <button
                            onClick={() => { router.push("/admin/update-user"); close(); }}
                            className="flex items-center gap-3 px-4 py-2 text-[15px] hover:bg-stone-100 transition-all"
                        >
                            <ManageAccountsIcon className="text-[20px] text-stone-700" />
                            <span>Account Settings</span>
                        </button>



                        <button
                            onClick={() => { toggleLogout(); close(); }}
                            className="flex items-center gap-3 px-4 py-2 text-[15px] text-red-600 hover:bg-red-50 transition-all"
                        >
                            <LogoutIcon className="text-[20px]" />
                            <span>Logout</span>
                        </button>

                    </div>
                </div>
            }
        </Popover>
    );
};


const Admin_navbar = () => {

    const router = useRouter();

    const { toggle_drawer, toggle_modal, get_all_products_api, user, filters } = useStateContext();

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
    const [store_name, set_store_name] = useState("");


    // Setting store name
    useEffect(() => {
        const path = router.pathname.split("?")[0].slice(1).split("/");
        if (path.length === 3 && path[1] === "all-products") {
            const normalizedPathStoreName = path[2].charAt(0).toUpperCase() + path[2].slice(1);
            if (normalizedPathStoreName === "Jewellry") {
                set_store_name("Jewelry");
            } else {
                set_store_name(normalizedPathStoreName);
            }
        } else {
            set_store_name("");
        }

    }, [router.pathname]);


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
                await get_all_products_api(axios, `search=${debouncedTerm}&main_store=${store_name}`, set_results, set_show_more_payload, set_fake_is_loading);
            } catch (err) {
                console.error(err);
            } finally {
                set_is_loading("ended");
            }
        };
        if (anchorEl && debouncedTerm !== null && store_name) {
            fetchResults();
        }
    }, [debouncedTerm, anchorEl, store_name]);

    useEffect(() => {
        if (is_loading === "ended" && !searchTerm) {
            set_is_loading("default");
        };
    }, [is_loading, searchTerm]);



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
            pathname: `/admin/all-products/${store_name === "Jewelry" ? "jewellry" : store_name.toLowerCase()}`,
            query
        }, undefined, { shallow: true });
    };

    const search_btn = () => {
        setAnchorEl(null);
        updateUrlFromFilters([{ search: searchTerm }, ...filters]);
    }

    // Fetching Trending Products
    useEffect(() => {
        const fetch = async () => {
            if (anchorEl) {
                set_is_trending_loading(true)
                try {
                    await get_all_products_api(axios, `featured=true&main_store=${store_name}`, set_trending_results, set_show_more_payload, set_fake_is_loading);
                } catch (err) {
                    console.error(err);
                } finally {
                    set_is_trending_loading(false)
                }
            }
        }
        if (!trending_results.length && store_name) {
            fetch();
        }
    }, [anchorEl, store_name]);

    // <=============================================== *** ENTIRE SEARCH LOGIC ENDS HERE *** ============================================>


    // USER Popover
    const [anchorElUser, setAnchorElUser] = useState(null);
    const handle_user_pop = (e) => {
        setAnchorElUser(e.currentTarget);
    }


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
                {["Footwear", "Footwear-accessories", "Jewelry", "Apparel"].includes(store_name) && (
                    <div className="lg:hidden" >
                        <IconButton onClick={() => toggle_drawer("search_drawer_admin")}>
                            <SearchIcon className="text-stone-800 scale-[1.1] active:text-stone-500 cursor-pointer" />
                        </IconButton>
                    </div>
                )}

                {["Footwear", "Footwear-accessories", "Jewelry", "Apparel"].includes(store_name) && (
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
                )}

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
                    store_name={store_name}
                />

                <div>
                    <IconButton
                        aria-describedby='user_popover'
                        onClick={handle_user_pop}
                    >
                        <MoreVertIcon className="text-[24px] md:text-[26px] text-stone-900" />
                    </IconButton>
                    <User_popover
                        anchorEl={anchorElUser}
                        close={() => setAnchorElUser(null)}
                        user={user}
                        toggleLogout={() => toggle_modal("logout_modal")}
                        router={router}
                    />
                </div>
            </div>
        </div>
    );
};

export default Admin_navbar;
