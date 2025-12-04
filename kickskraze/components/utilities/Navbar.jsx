import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import Badge from "@mui/material/Badge";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import useStateContext from "@/context/ContextProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchPopper from "@/utils/popper/Search_poppper";
import axios from "axios"
import { MetaPixel } from "@/lib/fpixel";




const Navbar = () => {

    const router = useRouter();
    const { toggle_drawer, cart, get_all_products_api, filters } = useStateContext();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #292524")
    }, []);

    const [cartQuantity, setCartQuantity] = useState(0);

    useEffect(() => {
        setCartQuantity(cart.reduce((sum, current) => sum + current.quantity, 0));
    }, [cart]);


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
        if (path.length === 2 && path[0] === "collection") {
            const normalizedPathStoreName = path[1].charAt(0).toUpperCase() + path[1].slice(1);
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
                MetaPixel.trackEvent("Search", { search_string: debouncedTerm });
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
            pathname: `/collection/${store_name === "Jewelry" ? "jewellry" : store_name.toLowerCase()}`,
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


    const nav_links = {
        "Footwear": [
            {
                option: "collection",
                link: "/collection/footwear",
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
            {
                option: "exclusive",
                link: "/collection/footwear?featured=true",
            },
        ],
        "Apparel": [
            {
                option: "collection",
                link: "/collection/apparel",
            },
            {
                option: "men",
                link: "/collection/apparel?category=men",
            },
            {
                option: "women",
                link: "/collection/apparel?category=women",
            },
            {
                option: "kids",
                link: "/collection/apparel?category=kids",
            },
            {
                option: "exclusive",
                link: "/collection/apparel?featured=true",
            },
        ],
        "Jewelry": [
            {
                option: "collection",
                link: "/collection/jewellry",
            },
            {
                option: "pendants",
                link: "/collection/jewellry?type=pendants",
            },
            {
                option: "bracelets",
                link: "/collection/jewellry?type=bracelets",
            },
            {
                option: "rings",
                link: "/collection/jewellry?type=rings",
            },
            {
                option: "exclusive",
                link: "/collection/jewellry?featured=true",
            },
        ],
        "Footwear-accessories": [
            {
                option: "collection",
                link: "/collection/footwear-accessories",
            },
            {
                option: "polish",
                link: "/collection/footwear-accessories?type=polish",
            },
            {
                option: "shoe laces",
                link: "/collection/footwear-accessories?type=shoelaces",
            },
            {
                option: "shiner",
                link: "/collection/footwear-accessories?type=shiner",
            },
            {
                option: "insole",
                link: "/collection/footwear-accessories?type=insole",
            },
        ],

    }

    return (
        <div className="px-[30px] gap-2 w-full h-[70px] flex lg:justify-between items-center bg-white shadow-[0_1px_3px_#0000001a]">
            <div className="w-full flex lg:hidden items-center gap-6 transition-all">
                <button onClick={() => toggle_drawer("menu_drawer")}>
                    <RxHamburgerMenu className="text-[26px] text-stone-800 active:text-stone-500 cursor-pointer" />
                </button>
                {["Footwear", "Footwear-accessories", "Jewelry", "Apparel"].includes(store_name) && (
                    <button onClick={() => toggle_drawer("search_drawer")}>
                        <SearchIcon className="text-stone-800 scale-[1.20] active:text-stone-500 cursor-pointer" />
                    </button>
                )}
            </div>
            <div className="flex lg:hidden w-full justify-center">
                <Link href="/">
                    <Image alt="logo" priority src={logo} className="w-[220px] object-contain" />
                </Link>
            </div>

            {/* Logo and Optoins Div */}
            <div className="hidden lg:flex items-center h-full w-full gap-6 xl:gap-16">
                {/* Logo Div */}
                <div className="flex items-center gap-10">
                    <button onClick={() => toggle_drawer("menu_drawer")}>
                        <RxHamburgerMenu className="text-[26px] text-stone-800 active:text-stone-500 cursor-pointer" />
                    </button>

                    <div className="w-[220px]">
                        <Link href="/" >
                            <Image alt="logo" priority src={logo} className="w-[220px] object-contain" />
                        </Link>
                    </div>
                </div>

                {/* Options Div */}
                {(Boolean(store_name) && Boolean(nav_links[store_name])) && (

                    <div className="flex h-full items-center">
                        <ul className="flex md:gap-6 xl:gap-10 items-center justify-center text-center">
                            {nav_links[store_name].map((each, i) => (
                                <li key={i + each.option}>
                                    <Link
                                        className={`font-semibold capitalize text-[15] xl:text-[17px] text-stone-800 active:text-stone-600 flex items-center border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100`}
                                        href={each.link}
                                    >
                                        {each.option}
                                    </Link>
                                </li>
                            ))}

                        </ul>
                    </div>
                )}
            </div>

            {/* Search Div */}
            <div className="w-full h-full flex justify-end items-center gap-6 ">
                {["Footwear", "Footwear-accessories", "Jewelry", "Apparel"].includes(store_name) && (
                    <div className="hidden lg:flex h-full items-center">
                        <input
                            className="outline-none px-[15px] py-[3px] border border-stone-300 text-[16px] h-[40px] w-[160px] xl:w-[230px]"
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

                <SearchPopper
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
                    <Link href={"/cart"}>
                        <button className="active:text-stone-(400 text-stone-800 transition-all">
                            <Badge badgeContent={cartQuantity} color="info" showZero>
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
