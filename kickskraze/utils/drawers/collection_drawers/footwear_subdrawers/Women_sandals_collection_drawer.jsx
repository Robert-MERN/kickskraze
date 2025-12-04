import React from 'react'
import Link from 'next/link';
import { FaArrowLeftLong } from "react-icons/fa6";
import Drawer from '@mui/material/Drawer';
import styles from "@/styles/home.module.css";

const Women_sandals_collection_drawer = ({ drawer_state, toggle_drawer }) => {

    const collections_menu = [
        {
            option: "Go To All Collection",
            link: "/collection/footwear?store_name=heels,sandals,flats",
        },
        {
            option: "Heels",
            link: "/collection/footwear?store_name=heels",
        },
        {
            option: "Sandals",
            link: "/collection/footwear?store_name=sandals",
        },
        {
            option: "Flats",
            link: "/collection/footwear?store_name=flats",
        },
    ]


    return (
        <Drawer
            open={drawer_state.women_sandals_drawer}
            onClose={() => toggle_drawer("women_sandals_drawer")}
        >
            <div className={`w-[90vw] md:w-[50vw] lg:w-[25vw] ${styles.scroll_bar} overflow-y-auto`} >

                <div onClick={() => toggle_drawer("women_sandals_drawer")} className='flex justify-between w-full items-center py-[12px] px-[20px] bg-gray-50' >
                    <button className='active:opacity-75' >
                        <FaArrowLeftLong className='text-stone-700 scale-[1.30]' />
                    </button>
                    <p className='text-[18px] font-bold select-none' >Sandals Collection</p>
                    <p></p>
                </div>

                {collections_menu.map((each, index) => (
                    <div key={index} className='py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                        <Link onClick={() => {
                            toggle_drawer("women_sandals_drawer");
                            toggle_drawer("footwear_drawer");
                            toggle_drawer("menu_drawer");
                        }} href={each.link} >
                            <p className='text-[16px] font-medium select-none tracking-wider' >{each.option}</p>
                        </Link>
                    </div>
                ))}

            </div>

        </Drawer>
    )
}

export default Women_sandals_collection_drawer