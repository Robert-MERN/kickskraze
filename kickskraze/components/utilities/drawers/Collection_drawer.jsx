import React from 'react'
import Link from 'next/link';
import { FaArrowLeftLong } from "react-icons/fa6";
import Drawer from '@mui/material/Drawer';


const Collection_drawer = ({ drawer_state, toggle_drawer }) => {

    const collections_menu = [
        {
            option: "Go To Collection",
            link: "/collection",
        },
        {
            option: "Nike",
            link: "/collection",
        },
        {
            option: "Asics",
            link: "/collection",
        },
        {
            option: "Skechers",
            link: "/collection",
        },
        {
            option: "Converse",
            link: "/collection",
        },
        {
            option: "Adidas",
            link: "/collection",
        },
        {
            option: "Fila",
            link: "/collection",
        },
        {
            option: "Under Armor",
            link: "/collection",
        },
        {
            option: "Saucony",
            link: "/collection",
        },
        {
            option: "New Balance",
            link: "/collection",
        },
        {
            option: "Hoka",
            link: "/collection",
        },
        {
            option: "Reebok",
            link: "/collection",
        },
        {
            option: "Puma",
            link: "/collection",
        },
        {
            option: "On Cloud",
            link: "/collection",
        },
        {
            option: "Orthofeet",
            link: "/collection",
        },
    ]


    return (
        <Drawer
            open={drawer_state.collection_drawer}
            onClose={() => toggle_drawer("collection_drawer")}
        >
            <div className='w-[90vw] md:w-[50vw]' >

                <div onClick={() => toggle_drawer("collection_drawer")} className='flex justify-between w-full items-center py-[12px] px-[20px] bg-gray-50' >
                    <button className='active:opacity-75' >
                        <FaArrowLeftLong className='text-stone-700 scale-[1.30]' />
                    </button>
                    <p className='text-[18px] font-bold select-none' >Collection</p>
                    <p></p>
                </div>

                {collections_menu.map((each, index) => (
                    <div key={index} className='py-[12px] px-[20px] border-b border-stone-200 cursor-pointer active:bg-gray-100 transition-all' >
                        <Link onClick={() => { toggle_drawer("collection_drawer"); toggle_drawer("menu_drawer") }} href={each.link} >
                            <p className='text-[16px] font-medium select-none tracking-wider' >{each.option}</p>
                        </Link>
                    </div>
                ))}

            </div>

        </Drawer>
    )
}

export default Collection_drawer