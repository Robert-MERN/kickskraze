import React, { useEffect, useState } from 'react'
import { TfiLayoutColumn2Alt } from "react-icons/tfi";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";
import { TfiLayoutColumn4Alt } from "react-icons/tfi";
import { MdTableRows } from "react-icons/md";
import Link from 'next/link';


const Collection_cards = () => {


    // Grid state changing dynamicly
    const [grid, setGrid] = useState(4);
    const [lastWidth, setLastWidth] = useState(0); // Store last valid width

    const change_grid = (val) => {
        setGrid(val);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            let timeoutId = null;

            const handleResize = () => {
                const currentWidth = window.innerWidth;

                // Ignore small height-based changes (which happen on mobile scrolling)
                if (currentWidth === lastWidth) return;

                setLastWidth(currentWidth); // Update last valid width

                if (currentWidth >= 1536) {
                    setGrid(4);
                } else if (currentWidth >= 1280) {
                    setGrid(3);
                } else if (currentWidth >= 1024) {
                    setGrid(2);
                } else {
                    setGrid(2);
                }
            };

            // Add event listener with debounce to prevent rapid calls
            const resizeListener = () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(handleResize, 100); // Delay to prevent spam on mobile
            };

            handleResize(); // Initial check
            window.addEventListener("resize", resizeListener);

            return () => {
                clearTimeout(timeoutId);
                window.removeEventListener("resize", resizeListener);
            };
        }
    }, [lastWidth]); // ✅ Only runs when actual width changes
    // <---------Ends Here-------->



    // Collection card Setup 
    const collections = [
        {
            collection_thumbnail: "/images/footwear.jpg",
            collection_title: "Footwear",
            collection_description: "Find every style — from sports sneakers to casual footwear",
            collection_tags: "Sneakers • Sandals • Heels • Formals",
            collection_link: "/collection/footwear",
        },
        {
            collection_thumbnail: "/images/footwear_accessories.jpg",
            collection_title: "Footwear Accessories",
            collection_description: "Everything your shoes need — polish, laces, insoles & more",
            collection_tags: "Polish • Laces • Socks • Insoles",
            collection_link: "/collection/footwear-accessories",
        },
        {
            collection_thumbnail: "/images/jewellry.jpg",
            collection_title: "Jewellry",
            collection_description: "Elegant pendants, rings, bracelets & watches",
            collection_tags: "Rings • Earrings • Bracelets • Watches",
            collection_link: "/collection/jewellry",
        },
        {
            collection_thumbnail: "/images/apparel.jpg",
            collection_title: "Clothing",
            collection_description: "Fashion for every season — casual, sportswear & modest wear",
            collection_tags: "Casual • Sportswear • Traditional • Modesty",
            collection_link: "/collection/apparel",
        },
    ]




    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] '>
            <div className='w-full' >



                {/* Header */}
                <div className='w-full flex justify-center items-center py-[15px] mb-[30px] lg:pt-[10px] lg:mb-[15px] sticky  top-0 bg-white z-[12] px-[16px]' >
                    <div className='flex items-center gap-2'>
                        <button onClick={() => change_grid(1)} className={`border border-stone-500 p-1`} >
                            <MdTableRows className={`text-[22px] text-stone-800 ${grid === 1 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                        </button>
                        <button onClick={() => change_grid(2)} className={`border border-stone-500 p-1`} >
                            <TfiLayoutColumn2Alt className={`text-[22px] text-stone-800 ${grid === 2 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                        </button>
                        <button onClick={() => change_grid(3)} className={`border border-stone-500 p-1 hidden xl:block`} >
                            <TfiLayoutColumn3Alt className={`text-[22px] text-stone-800 ${grid === 3 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                        </button>
                        <button onClick={() => change_grid(4)} className={`border border-stone-500 p-1 hidden xl:block`} >
                            <TfiLayoutColumn4Alt className={`text-[22px] text-stone-800 ${grid === 4 ? "opacity-[1]" : "opacity-[.5]"} transition-all`} />
                        </button>
                    </div>
                </div>


                < div style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }} className={`grid gap-x-2 gap-y-4 transition-all`}>

                    {collections.map((each, index) => (
                        <Link key={index} href={each.collection_link} >
                            <div
                                className={`p-2 md:p-4 flex gap-2 cursor-pointer ${grid === 1 ? "flex-col sm:flex-row" : "flex-col"}`}
                            >
                                <div className='relative'>
                                    <div className={`overflow-hidden shadow-sm relative`}>
                                        <img
                                            alt=""
                                            src={each.collection_thumbnail}
                                            onError={(e) => e.target.src = "/images/logo_error.png"}
                                            className={`
                                                       ${grid === 1 ? "w-full sm:w-[250px] md:w-[300px] 2xl:w-[350px] h-[450px] sm:h-[500px] md:h-[320px] xl:h-[380px]" : ""}
                                                        ${grid === 2 ? "w-full h-[240px] md:h-[400px] xl:h-[700px]" : ""}
                                                        ${grid === 3 ? "w-full h-[320px] xl:h-[470px]" : ""}
                                                        ${grid === 4 ? "w-full h-[340px]" : ""}

                                                        overflow-hidden object-cover object-center lg:hover:scale-[1.1] transition-all duration-500 `}
                                        />

                                    </div>

                                </div>


                                <div className='flex flex-col gap-1'>

                                    <p className='text-[16px] font-bold text-stone-700' >
                                        {each.collection_title}
                                    </p>

                                    <p className='mt-2 text-[15px] font-bold text-stone-600' >
                                        {each.collection_description}
                                    </p>

                                    <p className='text-[14px] text-stone-500' >
                                        {each.collection_tags}
                                    </p>

                                </div>
                            </div>
                        </Link>
                    ))}
                </div>



            </div>
        </div >
    )
}

export default Collection_cards