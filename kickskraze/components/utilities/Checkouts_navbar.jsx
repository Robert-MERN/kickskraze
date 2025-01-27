import React from 'react'
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { FiShoppingCart } from "react-icons/fi";



const Checkouts_navbar = () => {
    return (
        <div className='w-full h-full flex justify-center items-center px-[20px]'>
            <div className='w-full flex justify-between items-center md:px-[40px]'>

                <div>
                    <Image
                        alt="logo"
                        src={logo}
                        className='w-[100px] object-contain'
                    />
                </div>

                <div>
                    <button className="active:text-stone-400 text-stone-800 transition-all">
                        <FiShoppingCart className="text-[24px]" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Checkouts_navbar