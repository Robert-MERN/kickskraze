import React from 'react'
import { FaAngleRight } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import Drawer from '@mui/material/Drawer';
import styles from "@/styles/home.module.css";
import { useRouter } from 'next/router';

const Footwear_collection_drawer = ({ drawer_state, toggle_drawer }) => {

    const router = useRouter();

    const collections_menu = [
        {
            option: "Go To All Collection",
            route: () => router.push("/collection/footwear"),
        },
        {
            option: "Fashion Sneakers (Converse, Vans)",
            toggle: () => toggle_drawer("fashion_sneakers_drawer"),
        },
        {
            option: "Sports Sneakers (Nike, Adidas, etc.)",
            toggle: () => toggle_drawer("sports_sneakers_drawer"),
        },
        {
            option: "Women Sandals & Heels",
            toggle: () => toggle_drawer("women_sandals_drawer"),
        },
        {
            option: "Casual Footwear (Slippers, Crocs)",
            route: () => router.push("/collection/footwear?store_name=Casual-footwear"),
        },
        {
            option: "Formal Footwear (Men's Footwear)",
            route: () => router.push("/collection/footwear?store_name=Formal-footwear"),
        },

    ]


    return (
        <Drawer
            open={drawer_state.footwear_drawer}
            onClose={() => toggle_drawer("footwear_drawer")}
        >
            <div className={`w-[90vw] md:w-[50vw] lg:w-[25vw] ${styles.scroll_bar} overflow-y-auto`} >

                <div onClick={() => toggle_drawer("footwear_drawer")} className='flex justify-between w-full items-center py-[12px] px-[20px] bg-gray-50' >
                    <button className='active:opacity-75' >
                        <FaArrowLeftLong className='text-stone-700 scale-[1.30]' />
                    </button>
                    <p className='text-[18px] font-bold select-none' >Footwear Collection</p>
                    <p></p>
                </div>

                {collections_menu.map((each, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (each.route) each.route();
                            if (each.toggle) {
                                each.toggle();
                            } else {
                                toggle_drawer("footwear_drawer");
                                toggle_drawer("menu_drawer");
                            }
                        }}
                        className='w-full flex justify-between items-center py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all text-left'
                    >
                        <p className='text-[16px] font-medium select-none tracking-wider' >{each.option}</p>
                        {!each.route &&
                            <FaAngleRight className='scale-[1.05]' />
                        }

                    </button>
                ))}

            </div>

        </Drawer>
    )
}

export default Footwear_collection_drawer