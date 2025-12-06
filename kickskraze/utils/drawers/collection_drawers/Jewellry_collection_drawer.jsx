import React from 'react'
import Link from 'next/link';
import { FaArrowLeftLong } from "react-icons/fa6";
import Drawer from '@mui/material/Drawer';
import styles from "@/styles/home.module.css";

const Jewellry_collection_drawer = ({ drawer_state, toggle_drawer }) => {

    const collections_menu = [
        {
            option: "Go To All Collection",
            link: "/collection/jewellry",
        },
        {
            option: "Pendants",
            link: "/collection/jewellry?type=pendants",
        },
        {
            option: "Bracelets (Cuffs)",
            link: "/collection/jewellry?type=bracelets",
        },
        {
            option: "Rings",
            link: "/collection/jewellry?type=rings",
        },
        {
            option: "Earrings",
            link: "/collection/jewellry?type=earrings",
        },
        {
            option: "Necklaces",
            link: "/collection/jewellry?type=necklaces",
        },
        {
            option: "Anklet",
            link: "/collection/jewellry?type=anklets",
        },
        {
            option: "Jewellry Set",
            link: "/collection/jewellry?type=jewelry-set",
        },
        {
            option: "Watches",
            link: "/collection/jewellry?type=watches",
        },
    ]


    return (
        <Drawer
            open={drawer_state.jewelry_drawer}
            onClose={() => toggle_drawer("jewelry_drawer")}
        >
            <div className={`w-[90vw] md:w-[50vw] lg:w-[25vw] ${styles.scroll_bar} overflow-y-auto`} >

                <div onClick={() => toggle_drawer("jewelry_drawer")} className='flex justify-between w-full items-center py-[12px] px-[20px] bg-gray-50' >
                    <button className='active:opacity-75' >
                        <FaArrowLeftLong className='text-stone-700 scale-[1.30]' />
                    </button>
                    <p className='text-[18px] font-bold select-none' >Jewellry Collection</p>
                    <p></p>
                </div>

                {collections_menu.map((each, index) => (
                    <div key={index} className='py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                        <Link onClick={() => { toggle_drawer("jewelry_drawer"); toggle_drawer("menu_drawer") }} href={each.link} >
                            <p className='text-[16px] font-medium select-none tracking-wider' >{each.option}</p>
                        </Link>
                    </div>
                ))}

            </div>

        </Drawer>
    )
}

export default Jewellry_collection_drawer