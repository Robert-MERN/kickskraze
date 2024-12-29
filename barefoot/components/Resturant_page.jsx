import React, { useEffect, useRef, useState } from 'react';
import styles from "@/styles/home.module.css";
import Image from 'next/image';
import { Link as ScrollLink, Element } from 'react-scroll'; // Import Link and Element from react-scroll
import AddIcon from '@mui/icons-material/Add';

import menu_banner from "@/public/images/menu_banner.jpg";
import menu_image from "@/public/images/menu_image.jpg";

const Resturant_page = () => {
    const menu = [
        "PIZZA",
        "ZA DHAMAKA DEALS",
        "FISH SEASON",
        "STARTER",
        "SOUP",
        "THALI",
        "BIRYANI",
        "DESI ITEMS",
        "EXTRA",
        "Broast",
        "Double Dacker Burger",
        "Burger",
        "SANDWICHES & FRIES",
        "TIKKA",
        "BOTI",
        "Kabab",
        "PLATTER",
        "PARATHA",
        "Beef Roll",
        "CHICKEN ROLL",
        "CHINESE",
        "CHINESE RICE",
        "NOODLES",
        "STEAKS",
        "PIZZAS",
        "PIZZA SPECIAL ITEMS",
        "PIZZA FRIES",
        "PASTA",
        "CHICKEN KARAHI",
        "MUTTON KARAHI",
        "CHICKEN HANDI",
        "MUTTON HANDI",
        "Katakat Chatkhara",
        "Chicken Katakat",
        "MF Special Karahi",
        "Brain Masala",
        "ROTI & TAFTAAN",
        "SALAD & RAITA",
        "BEVERAGES",
        "DESSERT",
    ];

    const [active_section, set_active_section] = useState("");

    useEffect(() => {
        set_active_section(menu[0]);
    }, []);

    const navRef = useRef(null);

    const handleNavScroll = (id) => {
        set_active_section(id); // Update the active section
        // Find the active nav item
        const activeNavItem = document.querySelector(`[data-section="${id}"]`);
        if (activeNavItem && navRef.current) {
            // Scroll the active nav item into view (center)
            const navWidth = navRef.current.offsetWidth;
            const itemLeft = activeNavItem.offsetLeft;
            const itemWidth = activeNavItem.offsetWidth;
            navRef.current.scrollTo({
                left: itemLeft - navWidth / 2 + itemWidth / 2,
                behavior: 'smooth',
            });
        }
    };



    return (
        <div className='w-full pt-[15px] md:pt-[30px] tracking-wider'>
            {/* Navigation Bar */}
            <nav
                className={`w-full h-fit overflow-x-scroll overflow-y-hidden flex items-center gap-2 md:gap-4 px-[20px] border border-stone-200 shadow rounded-md ${styles.horizontal_scroll_bar} sticky top-0 bg-white z-10`}
                ref={navRef}
            >
                {menu.map((each, index) => (
                    <ScrollLink
                        key={index}
                        to={each.trim()}
                        smooth={true}
                        spy={true}
                        offset={-100} // Adjust to account for sticky header
                        duration={0}
                        onSetActive={(id) => handleNavScroll(id)}
                        data-section={each.trim()}
                        className={`h-[50px] md:h-[60px] flex items-center px-4 uppercase text-nowrap font-semibold border-y-4 border-t-transparent active:bg-stone-100 ${active_section === each ? "border-b-stone-900 text-stone-700 " : "border-b-transparent text-gray-400 "
                            } text-[13px] md:text-[16px] transition-all duration-200 cursor-pointer`}
                    >
                        {each}
                    </ScrollLink>
                ))}
            </nav>

            {/* Sections */}
            {menu.map((each, index) => (
                <Element
                    key={index}
                    name={each.trim()}
                    id={each.trim()}
                    className='w-full px-[20px] mt-[40px] mb-[100px] flex flex-col items-center'
                >
                    {/* Section Title */}
                    <h1 className='w-full text-center uppercase text-[22px] md:text-[24px] lg:text-[26px] font-semibold text-stone-800'>
                        {each}
                    </h1>

                    {/* Banner Image */}
                    <Image
                        className='w-full object-contain mt-[20px] lg:mt-[30px] mb-[20px]'
                        src={menu_banner}
                        alt="Section Banner"
                    />

                    {/* Menu Catalog */}
                    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 relative'>
                        {[...Array(6)].map((_, idx) => (
                            <div
                                key={idx}
                                className='pl-[20px] cursor-pointer border border-stone-200 flex items-start gap-6 lg:gap-12 rounded-xl shadow-md w-full overflow-hidden bg-white hover:opacity-75 active:opacity-55 transition-all duration-300 relative'
                            >
                                {/* Menu Info */}
                                <div className='w-full py-[20px] flex flex-col gap-6 lg:gap-8'>
                                    <div className='flex flex-col lg:gap-2'>
                                        <p className='line-clamp-1 text-ellipsis overflow-hidden text-[15px] md:text-[16px] lg:text-[18px] font-semibold text-stone-800'>
                                            Fish Broast
                                        </p>
                                        <p className='line-clamp-1 md:line-clamp-2 text-ellipsis overflow-hidden text-[15px] text-stone-500'>
                                            This is an example of a very long piece of text that will wrap across multiple lines but be truncated to only two lines with an ellipsis at the end if it overflows.
                                        </p>
                                    </div>
                                    {/* Price */}
                                    <div className='flex gap-2 sm:gap-4 font-semibold text-[13px] md:text-[14px] flex-wrap'>
                                        <p className='line-through'>Rs. {Number("2299").toLocaleString("en-US")}</p>
                                        <p className='text-red-600'>Rs. {Number("1499").toLocaleString("en-US")}</p>
                                    </div>
                                </div>
                                {/* Menu Image */}
                                <Image
                                    src={menu_image}
                                    alt="Menu Image"
                                    className='w-[120px] md:w-[160px] lg:w-[180px] xl:w-[200px] object-contain'
                                />
                                <button className='p-[6px] bg-white border border-stone-200 shadow-md rounded-[100%] absolute bottom-[4px] lg:bottom-[10px] right-[6px] lg:right-[10px] hover:scale-[1.1] transition-all duration-300 active:bg-stone-300 hover:rotate-90'>
                                    <AddIcon className='text-stone-500 text-[24px] lg:text-[28px] font-bold' />
                                </button>
                            </div>
                        ))}
                    </div>
                </Element>
            ))}
        </div>
    );
};

export default Resturant_page;
