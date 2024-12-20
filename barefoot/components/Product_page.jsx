import React, { useState, useEffect } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from "next/link";
import ImageGallery from "react-image-gallery";
import Zoom from "react-medium-image-zoom";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-medium-image-zoom/dist/styles.css";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import product_image from "@/public/images/product_image.webp"
import Image from 'next/image';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Product_page = () => {


    const [thumbnailPosition, setThumbnailPosition] = useState("bottom"); // Default for mobile

    // Update thumbnail position based on screen size using Tailwind breakpoints
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setThumbnailPosition("left"); // Use "left" for md screens and up
            } else {
                setThumbnailPosition("bottom"); // Use "bottom" for small screens
            }
        };

        handleResize(); // Initial check on mount
        window.addEventListener("resize", handleResize); // Listen to window resize
        return () => window.removeEventListener("resize", handleResize); // Cleanup listener
    }, []);

    const images = [
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1185.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1185.jpg?v=1732897162",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1191.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1191.jpg?v=1732897162",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1187.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1187.jpg?v=1732897162",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1188.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1188.jpg?v=1732897162",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1186.jpg?v=1732897161",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1186.jpg?v=1732897161",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1189.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1189.jpg?v=1732897162",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1190.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1190.jpg?v=1732897162",
        },
    ];



    const renderZoomedImage = (item) => (
        <Zoom>
            <img src={item.original} alt="Zoomable" style={{ width: "100%" }} />
        </Zoom>
    );



    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] tracking-wider'>
            {/* Breadcrumbs */}
            <Breadcrumbs className='text-gray-400 text-[13px] md:text-[15px]' separator={<NavigateNextIcon fontSize="small" />} >
                <Link
                    className='hover:underline active:text-gray-600'
                    underline="hover"
                    key="1"
                    color="inherit"
                    href="/cart"
                >
                    Home
                </Link>
                <p>
                    {"Product"}
                </p>
            </Breadcrumbs>


            <div className='w-full flex flex-col lg:flex-row mt-8 gap-6' >
                {/* Product Image Gallery */}
                <div className='flex flex-[1] lg:flex-[1.6]' >
                    <div className='w-full' >
                        <ImageGallery
                            items={images}
                            showThumbnails={true}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            showBullets={false}
                            infinite={true}
                            useBrowserFullscreen={false}
                            isRTL={false}
                            renderItem={(item) => renderZoomedImage(item)}
                            thumbnailPosition={thumbnailPosition} // Align thumbnails to the left
                            slideDuration={500} // Transition duration
                            slideInterval={2000}
                            slideOnThumbnailOver={false}
                        />
                    </div>
                </div>

                {/*Product Order Section  */}
                <div className='flex flex-[1] flex-col' >

                    <div className='w-full text-stone-950'>
                        <p className='text-[16px] xl:text-[18px] font-bold'>{"H&M"}</p>
                        <p className='text-[16px] xl:text-[18px] font-bold'>Rs. {Number("6500").toLocaleString("en-US")}</p>
                    </div>

                    <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                        <p className='text-[15px] xl:text-[17px] font-medium capitalize'>Availability: {"In Stock"}</p>
                    </div>

                    <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                        <p className='text-[15px] xl:text-[17px] font-medium capitalize'>Size: {"42"}</p>
                    </div>

                    <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                        <p className='text-[15px] xl:text-[17px] font-medium capitalize'>Condition: {"Premium+"}</p>
                    </div>

                    <div className='w-full mt-6 xl:mt-6'>
                        {/* Checkout Button */}
                        <button className='w-full py-[12px] flex justify-center items-center text-white bg-stone-950 font-black text-[13px] xl:text-[15px] hover:bg-white hover:text-stone-950 border border-stone-500 tracking-widest transition-all duration-300'>
                            ADD TO CART
                        </button>
                    </div>

                    <div className='w-full my-6 xl:mt-8'>
                        {/* Checkout Button */}
                        <button className='w-full py-[12px] flex justify-center items-center text-white bg-blue-500 font-black text-[13px] xl:text-[15px] hover:bg-white hover:text-stone-950 border border-transparent hover:border-stone-500 tracking-widest transition-all duration-300'>
                            BUY IT NOW
                        </button>
                    </div>

                    <div className='w-full my-6 xl:my-8'>
                        {/* Description*/}
                        <Accordion className='shadow-none border-t border-stone-300 p-0'>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                className='px-0'
                            >
                                <p className='hover:underline underline-offset-2 text-[16px] text-stone-800'>Description</p>
                            </AccordionSummary>
                            <AccordionDetails className='px-0'>
                                <p>Shoe Size: EUR 44 / UK 9.5 / US 10.5 / 28.5 CM </p>

                            </AccordionDetails>
                            <AccordionDetails className='px-0'>
                                <p> Introducing the Puma Smash sneakers, a timeless choice for casual elegance. Crafted with durable materials and featuring the iconic Puma Formstrip, these shoes offer both style and versatility. With their classic silhouette and cushioned footbed, they provide support for all-day wear. Step into sporty sophistication with the Puma Smash sneakers, perfect for adding a touch of flair to any outfit..</p>
                            </AccordionDetails>
                            <AccordionDetails className='px-0'>
                                <ol >
                                    <li className='list-disc'>All products are guaranteed to be 100% authentic and genuine. and not a fake, first copy, or replica.</li>
                                </ol>
                            </AccordionDetails>
                            <AccordionDetails className='px-0'>
                                <ol >
                                    <li className='list-disc'>We inspect each item for originality and provide actual, unedited product pictures for a transparent shopping experience. So that you can see exactly what you'll receive.</li>
                                </ol>
                            </AccordionDetails>
                        </Accordion>
                        {/* Condition Guide */}
                        <Accordion className='shadow-none border-t border-stone-300 p-0'>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                className='px-0'
                            >
                                <p className='hover:underline underline-offset-2 text-[16px] text-stone-800'>Condition Guide</p>
                            </AccordionSummary>
                            <AccordionDetails className='p-[15px] flex items-center'>
                                <p className='w-[130px]'>PREMIUM+</p>
                                <ol >
                                    <li className='list-disc'>Item is brand new and hasn't been worn before.</li>
                                </ol>
                            </AccordionDetails>
                            <AccordionDetails className='p-[15px] flex items-center bg-stone-100'>
                                <p className='w-[130px]'>PREMIUM</p>
                                <ol >
                                    <li className='list-disc'>Item is in almost brand-new condition.</li>
                                </ol>
                            </AccordionDetails>
                            <AccordionDetails className='p-[15px] flex items-center'>
                                <p className='w-[130px]'>EXCELLENT</p>
                                <ol >
                                    <li className='list-disc'>Item has very little signs of wear.</li>
                                </ol>
                            </AccordionDetails>
                            <AccordionDetails className='p-[15px] flex items-center bg-stone-100'>
                                <p className='w-[130px]'>VERY GOOD</p>
                                <ol >
                                    <li className='list-disc'>Item has visible signs of wear and use.</li>
                                </ol>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>

            </div>
            {/* Related Products */}
            <div className='mt-[100px] lg:mt-[140px]'>
                <h1 className='text-[20px] text-stone-800 w-full text-center mb-[20px]' >RELATED PRODUCTS</h1>
                <Carousel
                    arrows
                    autoPlaySpeed={3000}
                    containerClass="container-with-dots"
                    draggable
                    infinite
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    responsive={{
                        superLargeDesktop: {
                            breakpoint: { max: 4000, min: 1536 }, // 2xl
                            items: 5,
                        },
                        desktop: {
                            breakpoint: { max: 1536, min: 1280 }, // xl
                            items: 4,
                        },
                        laptop: {
                            breakpoint: { max: 1280, min: 1024 }, // lg
                            items: 3,
                        },
                        tablet: {
                            breakpoint: { max: 1024, min: 640 }, // md
                            items: 3,
                        },
                        mobile: {
                            breakpoint: { max: 640, min: 0 }, // sm
                            items: 2,
                        },
                    }}
                    shouldResetAutoplay
                    slidesToSlide={1}
                    swipeable
                >
                    {[...Array(20)].map((_, i) => (
                        <Link href={"/product"} key={i}>
                            <div
                                className={`p-4 flex gap-2 cursor-pointer overflow-hidden flex-col`}
                            >
                                <div className='overflow-hidden'>
                                    <Image alt="Product" src={product_image} className={`w-full hover:scale-[1.1] transition-all duration-500 object-contain"} `} />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <p className='text-[16px] font-bold text-stone-600' >Product {i + 1}</p>
                                    <p className='text-[14px] font-bold text-black mt-2' >Rs. {((i + 1) * 10000).toLocaleString("en-US")}</p>
                                    <p className='text-[14px] text-black' >Size: {"42"}</p>
                                    <p className='text-[14px] text-black' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{"Excelllent"}</span></p>
                                </div>
                            </div>
                        </Link>
                    ))}

                </Carousel>
            </div>

        </div>
    )
}

export default Product_page