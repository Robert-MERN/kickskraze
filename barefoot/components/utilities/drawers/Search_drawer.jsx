import { Drawer } from '@mui/material'
import React from 'react'
import { IoClose } from "react-icons/io5";
import SearchIcon from "@mui/icons-material/Search";
import Link from 'next/link';
import style from "@/styles/home.module.css";


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

  return (
    <Drawer
      open={drawer_state.search_drawer}
      onClose={() => toggle_drawer("search_drawer")}
      className={``}
    >
      <div className='w-[90vw] md:w-[50vw] tracking-wider text-stone-950 transition-all duration-300'>

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
          />
          <button className="bg-stone-800 flex items-center justify-center text-[16px] w-[50px] h-[50px] active:opacity-70 transition-all">
            <SearchIcon className="text-white" />
          </button>
        </div>

        <div className='w-full py-[12px] px-[20px] border-b border-stone-200' >
          <p className='text-[17px] font-bold select-none' >TRENDING NOW</p>
        </div>

        <div className={`flex gap-3 flex-wrap w-full items-center py-[12px] px-[20px] h-[120px] overflow-y-auto ${style.scroll_bar}`}>
          {trending_options.map((each, index) => (
            <Link href={each.link} key={index}>
              <div className='p-[10px] bg-gray-100 active:bg-gray-300 text-gray-500  rounded-md flex items-center gap-2 text-[15px] font-semibold transition-all' >
                <SearchIcon className="text-[22px]" />
                <p>{each.option}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className='w-full py-[12px] px-[20px] border-b border-stone-200' >
          <p className='text-[17px] font-bold select-none' >POPULAR PRODUCTS</p>
        </div>

      </div>
    </Drawer>
  )
}

export default Search_drawer