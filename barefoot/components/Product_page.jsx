import React, { useState, useEffect } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from "next/link";
// import "@/styles/home.module.css";
import ImageGallery from "react-image-gallery";
import Zoom from "react-medium-image-zoom";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-medium-image-zoom/dist/styles.css";
import ReactImageMagnify from "react-image-magnify";

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


    const renderMagnifyImage = (item) => (
        <>
            <ReactImageMagnify
                {...{
                    smallImage: {
                        alt: "Product Image",
                        isFluidWidth: true,
                        src: item.original, // Use the current image's original URL
                    },
                    largeImage: {
                        src: item.thumbnail, // Use the large version for zoom
                        width: 1200,
                        height: 1000,

                    },
                    enlargedImagePosition: "beside", // Zoom position ('over', 'beside', etc.)
                    // isHintEnabled: true,
                }}
            />
        </>
    );



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
                            renderItem={(item) => renderMagnifyImage(item)}
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

                    <div className='w-full my-6 xl:my-8'>
                        {/* Checkout Button */}
                        <button className='w-full py-[12px] flex justify-center items-center text-white bg-blue-500 font-black text-[13px] xl:text-[15px] hover:bg-white hover:text-stone-950 border border-transparent hover:border-stone-500 tracking-widest transition-all duration-300'>
                            BUY IT NOW
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Product_page