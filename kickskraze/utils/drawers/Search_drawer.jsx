import { SwipeableDrawer } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import SearchIcon from "@mui/icons-material/Search";
import Link from 'next/link';
import style from "@/styles/home.module.css";
import { useRouter } from 'next/router';
import RevealFade from "react-reveal/Fade";
import { Skeleton } from "@mui/material";
import { calculate_discount_precentage, select_thumbnail_from_media } from '@/utils/functions/produc_fn';
import { MetaPixel } from '@/lib/fpixel';



const Search_drawer = ({ drawer_state, toggle_drawer, get_all_products_api, axios }) => {

  const router = useRouter();

  const trending_options = [
    {
      option: "men",
      link: "/collection?category=men",
    },
    {
      option: "women",
      link: "/collection?category=women",
    },
    {
      option: "kids",
      link: "/collection?category=kids",
    },
    {
      option: "converse",
      link: "/collection?brand=Converse",
    },
    {
      option: "nike",
      link: "/collection?brand=Nike",
    },
    {
      option: "asics",
      link: "/collection?brand=ASICS",
    },
    {
      option: "adidas",
      link: "/collection?brand=Adidas",
    },
    {
      option: "new balance",
      link: "/collection?brand=New Balance",
    },
    {
      option: "saucony",
      link: "/collection?brand=Saucony",
    },
    {
      option: "fila",
      link: "/collection?brand=Fila",
    },
  ];


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
        MetaPixel.trackEvent("Search", { search_string: debouncedTerm });
      } catch (err) {
        console.error(err);
      } finally {
        set_is_loading("ended");
      }
    };

    if (drawer_state.search_drawer && debouncedTerm !== null) {
      fetchResults();
    }
  }, [debouncedTerm, drawer_state.search_drawer]);

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
            await get_all_products_api(axios, "featured=true", set_trending_results, set_show_more_payload, set_fake_is_loading);
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
    fetch();
  }, [drawer_state.search_drawer]);

  const view_more_btn = () => {
    toggle_drawer("search_drawer")
    router.push(`/collection?search=${debouncedTerm}`)
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
                              {product.compare_price &&
                                <span className='text-[13px] line-through text-red-600'>
                                  Rs. {product.price.toLocaleString("en-US")}
                                </span>
                              }
                            </p>
                            <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                            <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
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
            <div className='w-full py-[12px] px-[20px] border-b border-stone-200' >
              <p className='text-[17px] font-bold select-none' >TRENDING NOW</p>
            </div>

            <div className={`flex gap-3 flex-wrap w-full items-center py-[12px] px-[20px] h-[110px] overflow-y-auto ${style.scroll_bar}`}>
              {trending_options.map((each, index) => (
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
                                Rs. {product.price.toLocaleString("en-US")}
                              </span>
                            }
                          </p>
                          <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                          <p className='text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
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