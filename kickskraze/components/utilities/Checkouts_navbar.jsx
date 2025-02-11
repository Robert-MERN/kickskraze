import React from 'react'
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { FiShoppingCart } from "react-icons/fi";
import Link from 'next/link';


const Checkouts_navbar = () => {
    return (
        <div className='w-full h-full flex justify-center items-center px-[20px]'>
            <div className='w-full flex justify-between items-center md:px-[40px]'>

                <div>
                    <Link href="/"> 
                        <Image
                            alt="logo"
                            src={logo}
                            className='w-[220px] object-contain'
                        />
                    </Link>
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