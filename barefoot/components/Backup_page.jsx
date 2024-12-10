import React, { useEffect } from 'react'
import Image from 'next/image';
import turbin from "@/public/images/turbin.png";

const Backup_page = () => {

    



    return (
        <div className='w-fit px-[20px] flex gap-52 items-center pb-[10px] border-b-2 border-blue-800 mt-40'>
            <div className='flex items-center gap-4'>
                <Image className='w-[80px] object-fill scale-[3.2]' alt="Turbin" src={turbin} />
                <h1 className='text-[66px] text-blue-800 font-sans font-black'>Cai Energy Inc.</h1>
            </div>

            <div className='text-[16px] text-gray-500 text-right' >
                <p className='font-sans' >11211 Katy Freeway, Suite 340</p>
                <p className='font-sans' >Houston, TX 77079</p>
                <p className='font-sans' >Cell: 713 459 4749</p>
            </div>


        </div>
    )
}

export default Backup_page