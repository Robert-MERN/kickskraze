import { SwipeableDrawer } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import SearchIcon from "@mui/icons-material/Search";
import Link from 'next/link';
import style from "@/styles/home.module.css";
import { useRouter } from 'next/router';
import RevealFade from "react-reveal/Fade";
import { Skeleton } from "@mui/material";
import { calculate_discount_precentage, calculate_product_stock, select_thumbnail_from_media } from '@/utils/functions/product_fn';
import { MetaPixel } from '@/lib/fpixel';
import useStateContext from '@/context/ContextProvider';
import { getBrowserCookie } from '../functions/cookie';
import { v4 as uuidv4 } from "uuid";




const Search_drawer = ({ drawer_state, toggle_drawer, get_all_products_api, axios }) => {

  const { filters, handle_meta_capi } = useStateContext();

  const router = useRouter();

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
        option: "jewellry set",
        link: "/collection/jewellry?type=jewelry-set",
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
        option: "anklets",
        link: "/collection/jewellry?type=anklets",
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
  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // Wait for 500ms after user stops typing

    return () => clearTimeout(timer); // Cleanup previous timer
  }, [searchTerm]);


  const sendSearchEvent = async (searchTerm) => {
    const eventId = uuidv4();

    // Pixel
    MetaPixel.trackEvent("Search", {
      search_string: searchTerm,
      event_id: eventId,
    });

    // CAPI
    await handle_meta_capi({
      event_name: "Search",
      event_id: eventId,
      event_source_url: window.location.href,
      search_string: searchTerm,
      fbp: getBrowserCookie("_fbp"),
      fbc: getBrowserCookie("_fbc"),
    });
  };



  // Fetch results when the debounced term changes
  useEffect(() => {
    // Set loading state **before** starting the fetch
    set_is_loading("started");

    const fetchResults = async () => {
      try {
        await get_all_products_api(axios, `search=${debouncedTerm}&main_store=${store_name}`, set_results, set_show_more_payload, set_fake_is_loading);
        
        if (debouncedTerm) sendSearchEvent(debouncedTerm);
      } catch (err) {
        console.error(err);
      } finally {
        set_is_loading("ended");
      }
    };
    if (drawer_state.search_drawer && debouncedTerm !== null && store_name) {
      fetchResults();
    }
  }, [drawer_state.search_drawer, debouncedTerm, store_name]);



  useEffect(() => {
    if (is_loading === "ended" && !searchTerm) {
      set_is_loading("default");
    };
  }, [is_loading, searchTerm]);










  // Fetching Trending Products
  useEffect(() => {
    const fetch = async () => {
      if (drawer_state.search_drawer) {
        if (!trending_results.length) {
          set_is_trending_loading(true)
          try {
            await get_all_products_api(axios, `featured=true&main_store=${store_name}`, set_trending_results, set_show_more_payload, set_fake_is_loading);
          } catch (err) {
            console.error(err);
          } finally {
            set_is_trending_loading(false)
          }
        };
      } else {
        set_results([]);
        setSearchTerm("");
        setDebouncedTerm("");
      }
    }
    if (store_name) {
      fetch();
    }
  }, [drawer_state.search_drawer, store_name]);



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
    toggle_drawer("search_drawer")
    updateUrlFromFilters([{ search: debouncedTerm }, ...filters]);
  }

  return (
    <SwipeableDrawer
      open={drawer_state.search_drawer}
      onClose={() => toggle_drawer("search_drawer")}
      onOpen={() => toggle_drawer("search_drawer")}
      className={``}
    >
      <div className='w-[90vw] md:w-[50vw] text-stone-950 transition-all duration-300'>

        <div className='flex justify-between w-full items-center py-[12px] px-[20px]' >
          <p className='text-[20px] font-bold select-none' >Search</p>
          <button onClick={() => toggle_drawer("search_drawer")} className='active:opacity-75' >
            <IoClose className='text-stone-700 scale-[1.60]' />
          </button>

        </div>

        <div className='flex w-full items-center py-[12px] px-[20px]' >
          <input
            className="outline-none px-[15px] py-[3px] border border-stone-300 text-[17px] h-[50px] w-full"
            placeholder="Search products..."
            value={searchTerm || ""}
            type="text"
            onChange={(event) => { setSearchTerm(event.target.value) }}
          />
          <button onClick={view_more_btn} className="bg-stone-800 flex items-center justify-center text-[16px] w-[50px] h-[50px] active:opacity-70 transition-all">
            <SearchIcon className="text-white" />
          </button>
        </div>

        {Boolean(searchTerm) ?

          <>
            <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-4' >
              <RevealFade>
                <p className='text-[17px] font-bold select-none' >PRODUCT RESULTS</p>
              </RevealFade>
            </div>

            {((is_loading === "started" || is_loading === "default")) ?
              <div className="grid grid-cols-2 gap-2 px-[20px]">
                {[...Array(2)].map((_, index) => (
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
                  <div className="grid grid-cols-2 px-[20px] gap-2">
                    {results.slice(0, 2).map((product) => (
                      <Link
                        href={`/product?product_id=${product._id}`}
                        key={product._id}
                        onClick={() => toggle_drawer("search_drawer")}
                      >
                        <div

                          className={`p-1 flex flex-col gap-2 cursor-pointer`}
                        >
                          <div className='relative'>
                            <div className={`"w-full h-[150px] overflow-hidden shadow-sm`}>

                              <img
                                alt=""
                                src={select_thumbnail_from_media(product.media)}
                                onError={(e) => e.target.src = "/images/logo_error.png"}
                                className={`w-full h-[150px] hover:scale-[1.1] object-cover transition-all duration-500`}
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
                              {Boolean(product.compare_price) &&
                                <span className='text-[13px] line-through text-red-600'>
                                  Rs. {product.price.toLocaleString("en-US")}
                                </span>
                              }
                            </p>
                            {!product.has_variants && Boolean(product.size) && (
                              <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                            )}
                            {product.condition !== "brand new" && (
                              <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                            )}
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
                <div className='w-full py-[12px] px-[20px] border-b border-stone-200' >
                  <p className='text-[17px] font-bold select-none' >TRENDING NOW</p>
                </div>

                <div className={`flex gap-3 flex-wrap w-full items-center py-[12px] px-[20px] h-[110px] overflow-y-auto ${style.scroll_bar}`}>
                  {trending_options[store_name].map((each, index) => (
                    <Link
                      onClick={() => toggle_drawer("search_drawer")}
                      href={each.link}
                      key={index}
                    >
                      <div className='px-[10px] py-[8px] bg-gray-100 active:bg-gray-300 text-gray-500  rounded-md flex items-center gap-2 text-[14px] font-semibold transition-all' >
                        <SearchIcon className="text-[20px]" />
                        <p className='capitalize'>{each.option}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}


            {is_trending_loading ?
              <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-4' >
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className='bg-stone-100 w-[38%] h-[19px]'
                />
              </div>
              : (trending_results.length) ?
                <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-4' >
                  <p className='text-[17px] font-bold select-none' >POPULAR PRODUCTS</p>
                </div>
                :
                <></>
            }

            {is_trending_loading ?
              <div className="grid grid-cols-2 gap-2 px-[20px]">
                {[...Array(2)].map((_, index) => (
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
                <div className="grid grid-cols-2 px-[20px] gap-2">
                  {trending_results.slice(0, 2).map((product) => (
                    <Link
                      href={`/product?product_id=${product._id}`}
                      key={product._id}
                      onClick={() => toggle_drawer("search_drawer")}
                    >
                      <div
                        className={`p-1 flex flex-col gap-2 cursor-pointer`}
                      >
                        <div className='relative'>
                          <div className={`"w-full h-[150px] overflow-hidden shadow-sm`}>

                            <img
                              alt=""
                              src={select_thumbnail_from_media(product.media)}
                              onError={(e) => e.target.src = "/images/logo_error.png"}
                              className={`w-full h-[150px] hover:scale-[1.1] object-cover transition-all duration-500`}
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
                                Rs. {product.price.toLocaleString("en-US")}
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
    </SwipeableDrawer>
  )
}

export default Search_drawer