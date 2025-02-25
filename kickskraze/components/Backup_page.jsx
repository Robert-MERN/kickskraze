import React from 'react'
import turbin from "@/public/images/turbin.png";
import Image from 'next/image';

const Backup_page = () => {

    return (
        <div className='w-full px-[20px] pt-[20px] md:py-[40px] tracking-wider flex justify-center gap-12 font-sans'>

            <div className='flex justify-between w-[1000px] h-[100px] items-center border-b-[3px] border-blue-800 mt-[200px] px-[10px]'>
                <div className='flex items-center gap-16' >

                    <Image src={turbin} className='w-[40px] scale-[6] pl-1' alt="logo" />
                    <h1 className='text-blue-800 font-black text-[52px] scale-[1.1] whitespace-nowrap'>CAI Energy Inc.</h1>

                </div>

                <p className='text-stone-600 text-[16px] text-right font-bold'>
                    11211 Katy Freeway, Suite #350
                    <br />
                    Houston, TX 77079
                    <br />
                    Cell: 713 459 47491
                </p>


                {/* Reviews */}
                <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    <div class="break-inside-avoid bg-white p-4 shadow rounded">Content 1</div>
                    <div class="break-inside-avoid bg-white p-4 shadow rounded">Content 2</div>
                    <div class="break-inside-avoid bg-white p-4 shadow rounded">Content 3</div>
                    <div class="break-inside-avoid bg-white p-4 shadow rounded">Content 4</div>
                </div>

            </div>

        </div >
    )
}

export default Backup_page