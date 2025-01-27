import { Drawer } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import SearchIcon from "@mui/icons-material/Search";
import Link from 'next/link';
import style from "@/styles/home.module.css";
import Image from 'next/image';
import { products } from '@/models/product_schema';
import product_image from "@/public/images/product_image.webp"



const Search_drawer = ({ drawer_state, toggle_drawer }) => {

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

  return (
    <Drawer
      open={drawer_state.search_drawer}
      onClose={() => toggle_drawer("search_drawer")}
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
            type="text"
            onChange={(event) => { setSearchTerm(event.target.value) }}
          />
          <button className="bg-stone-800 flex items-center justify-center text-[16px] w-[50px] h-[50px] active:opacity-70 transition-all">
            <SearchIcon className="text-white" />
          </button>
        </div>

        {searchTerm ?

          <>
            <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-4' >
              <p className='text-[17px] font-bold select-none' >PRODUCT RESULTS</p>
            </div>
            {results.length ?
              <>
                <div className="grid grid-cols-2 px-[20px] gap-2">
                  {products.slice(0, 2).map((product, i) => (
                    <Link href={`/product?id=${product._id}`} key={i}>
                      <div
                        className={`p-1 flex flex-col gap-2 cursor-pointer`}
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

            <div className='w-full py-[12px] px-[20px] border-b border-stone-200' >
              <p className='text-[17px] font-bold select-none' >TRENDING NOW</p>
            </div>

            <div className={`flex gap-3 flex-wrap w-full items-center py-[12px] px-[20px] h-[110px] overflow-y-auto ${style.scroll_bar}`}>
              {trending_options.map((each, index) => (
                <Link href={each.link} key={index}>
                  <div className='px-[10px] py-[8px] bg-gray-100 active:bg-gray-300 text-gray-500  rounded-md flex items-center gap-2 text-[14px] font-semibold transition-all' >
                    <SearchIcon className="text-[20px]" />
                    <p>{each.option}</p>
                  </div>
                </Link>
              ))}
            </div>


            <div className='w-full py-[12px] px-[20px] border-b border-stone-200 mb-4' >
              <p className='text-[17px] font-bold select-none' >POPULAR PRODUCTS</p>
            </div>


            <div className="grid grid-cols-2 gap-2 px-[20px]">
              {products.slice(0, 2).map((product, i) => (
                <Link href={`/product?id=${product._id}`} key={i}>
                  <div
                    className={`p-1 flex flex-col gap-2 cursor-pointer`}
                  >
                    <div className='relative'>
                      <div className={`"w-full h-[150px] overflow-hidden shadow-sm`}>

                        <Image alt="Product" src={product_image} className={`w-full h-full hover:scale-[1.1] object-contain transition-all duration-500`} />

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
          </>
        }
      </div>
    </Drawer>
  )
}

export default Search_drawer