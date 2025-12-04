import React from 'react'
import Link from 'next/link';
import { FaArrowLeftLong } from "react-icons/fa6";
import Drawer from '@mui/material/Drawer';
import styles from "@/styles/home.module.css";

const Apparel_collection_drawer = ({ drawer_state, toggle_drawer }) => {

    const collections_menu = [
        {
            option: "Go To All Collection",
            link: "/collection/apparel",
        },
        {
            option: "Casual (T-shirts, Jeans)",
            link: "/collection/apparel?type=casual",
        },
        {
            option: "Formal (Suits)",
            link: "/collection/apparel?type=formal",
        },
        {
            option: "Sportswear (Gym-wear, Tracksuits)",
            link: "/collection/apparel?type=sportswear",
        },
        {
            option: "Traditional (Shalwar-kameez, Kurti)",
            link: "/collection/apparel?type=traditional",
        },
        {
            option: "Sleepwear (Pajamas, Night-suits)",
            link: "/collection/apparel?type=sleepwear",
        },
        {
            option: "Undergarments (Sando, Bra, Underwear)",
            link: "/collection/apparel?type=undergarments",
        },
        {
            option: "Outerwear (Jackets, Rain-Suits)",
            link: "/collection/apparel?type=outerwear",
        },
        {
            option: "Modesty (Abaya, Burka)",
            link: "/collection/apparel?type=abaya",
        },
        {
            option: "Modesty (Hijab, Scarf, Khimar, Shawls)",
            link: "/collection/apparel?type=headscarf",
        },


    ]


    return (
        <Drawer
            open={drawer_state.apparel_drawer}
            onClose={() => toggle_drawer("apparel_drawer")}
        >
            <div className={`w-[90vw] md:w-[50vw] lg:w-[25vw] ${styles.scroll_bar} overflow-y-auto`} >

                <div onClick={() => toggle_drawer("apparel_drawer")} className='flex justify-between w-full items-center py-[12px] px-[20px] bg-gray-50' >
                    <button className='active:opacity-75' >
                        <FaArrowLeftLong className='text-stone-700 scale-[1.30]' />
                    </button>
                    <p className='text-[18px] font-bold select-none' >Clothing Collection</p>
                    <p></p>
                </div>

                {collections_menu.map((each, index) => (
                    <div key={index} className='py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                        <Link onClick={() => { toggle_drawer("apparel_drawer"); toggle_drawer("menu_drawer") }} href={each.link} >
                            <p className='text-[16px] font-medium select-none tracking-wider' >{each.option}</p>
                        </Link>
                    </div>
                ))}

            </div>

        </Drawer>
    )
}

export default Apparel_collection_drawer