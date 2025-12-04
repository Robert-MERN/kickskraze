import React from 'react'
import Link from 'next/link';
import { FaArrowLeftLong } from "react-icons/fa6";
import Drawer from '@mui/material/Drawer';
import styles from "@/styles/home.module.css";

const Sports_sneakers_collection_drawer = ({ drawer_state, toggle_drawer }) => {

    const collections_menu = [
        {
            option: "Go To All Collection",
            link: "/collection/footwear?store_name=Kickskraze",
        },
        {
            option: "Nike",
            link: "/collection/footwear?store_name=Kickskraze&brand=Nike",
        },
        {
            option: "Asics",
            link: "/collection/footwear?store_name=Kickskraze&brand=ASICS",
        },
        {
            option: "Skechers",
            link: "/collection/footwear?store_name=Kickskraze&brand=Skechers",
        },
        {
            option: "Adidas",
            link: "/collection/footwear?store_name=Kickskraze&brand=Adidas",
        },
        {
            option: "Fila",
            link: "/collection/footwear?store_name=Kickskraze&brand=Fila",
        },
        {
            option: "Under Armour",
            link: "/collection/footwear?store_name=Kickskraze&brand=Under%20Armour",
        },
        {
            option: "Saucony",
            link: "/collection/footwear?store_name=Kickskraze&brand=Saucony",
        },
        {
            option: "New Balance",
            link: "/collection/footwear?store_name=Kickskraze&brand=New%20Balance",
        },
        {
            option: "Hoka",
            link: "/collection/footwear?store_name=Kickskraze&brand=Hoka",
        },
        {
            option: "Reebok",
            link: "/collection/footwear?store_name=Kickskraze&brand=Reebok",
        },
        {
            option: "Puma",
            link: "/collection/footwear?store_name=Kickskraze&brand=Puma",
        },
        {
            option: "On Cloud",
            link: "/collection/footwear?store_name=Kickskraze&brand=On%20Cloud",
        },
        {
            option: "Orthofeet",
            link: "/collection/footwear?store_name=Kickskraze&brand=Orthofeet",
        },
    ]


    return (
        <Drawer
            open={drawer_state.sports_sneakers_drawer}
            onClose={() => toggle_drawer("sports_sneakers_drawer")}
        >
            <div className={`w-[90vw] md:w-[50vw] lg:w-[25vw] ${styles.scroll_bar} overflow-y-auto`} >

                <div onClick={() => toggle_drawer("sports_sneakers_drawer")} className='flex justify-between w-full items-center py-[12px] px-[20px] bg-gray-50' >
                    <button className='active:opacity-75' >
                        <FaArrowLeftLong className='text-stone-700 scale-[1.30]' />
                    </button>
                    <p className='text-[18px] font-bold select-none' >Sport Sneakers</p>
                    <p></p>
                </div>

                {collections_menu.map((each, index) => (
                    <div key={index} className='py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                        <Link onClick={() => {
                            toggle_drawer("sports_sneakers_drawer");
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

export default Sports_sneakers_collection_drawer