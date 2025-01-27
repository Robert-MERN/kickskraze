import React, { useState, useEffect } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from "next/link";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import product_image from "@/public/images/product_image.webp"
import Image from 'next/image';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';
import { Skeleton } from '@mui/material';
import { products } from '@/models/product_schema';


const Product_page = ({ product }) => {


    const [loading, set_loading] = useState(false);



    const { add_item_to_cart } = useStateContext();

    const router = useRouter();

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
            original: "https://replay.pk/cdn/shop/files/IMG_1191.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1191.jpg?v=1732897162",
            type: "image",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1187.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1187.jpg?v=1732897162",
            type: "image",
        },
        {
            original: "https://res.cloudinary.com/dceqyrfhu/video/upload/f_auto,q_auto/v1737608925/KicksKraze/kyxeiwymkteey0xskbrk.mp4",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1185.jpg?v=1732897162",
            type: "video",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1188.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1188.jpg?v=1732897162",
            type: "image",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1186.jpg?v=1732897161",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1186.jpg?v=1732897161",
            type: "image",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1189.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1189.jpg?v=1732897162",
            type: "image",
        },
        {
            original: "https://replay.pk/cdn/shop/files/IMG_1190.jpg?v=1732897162",
            thumbnail: "https://replay.pk/cdn/shop/files/IMG_1190.jpg?v=1732897162",
            type: "image",
        },
    ];


    const renderZoomedImage = (item) => (
        <>
            {item.type === "video" ?
                <div className='flex-[1.6]'>
                    <video
                        src={item.original}
                        controls
                        muted
                        className='w-full h-[280px] sm:h-[400px] md:h-[530px] lg:h-[500px] xl:h-[550px] object-cover'
                    />
                </div>
                :
                <Zoom>
                    <div className='flex-[1.6]'>
                        <img
                            src={item.original}
                            alt="Zoomable"
                            className='w-full h-[280px] sm:h-[400px] md:h-[530px] lg:h-[500px] xl:h-[550px] object-cover'
                        />
                    </div>
                </Zoom>
            }
        </>
    );


    const renderThumbnail = (item) => (
        <>
            {item.type === "video" ? (
                <video
                    src={item.original}
                    className='w-full h-[56.25px] md:h-[69px] object-cover'
                    muted
                    controls={false}
                />
            ) : (
                <img
                    src={item.original}
                    alt="Thumbnail"
                    className='w-full h-[56.25px] md:h-[69px] object-cover'
                />
            )}
        </>
    );



    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] '>
            {/* Breadcrumbs */}
            <Breadcrumbs className='text-gray-400 text-[13px] md:text-[15px]' separator={<NavigateNextIcon fontSize="small" />} >
                {(loading || !product) ?
                    <Skeleton
                        animation="wave"
                        variant='text'
                        className='bg-stone-100 w-[80px]'
                    />
                    :
                    <>
                        <Link
                            className='hover:underline active:text-gray-600'
                            underline="hover"
                            key="1"
                            color="inherit"
                            href="/"
                        >
                            Home
                        </Link>
                    </>
                }

                {(loading || !product) ?
                    <Skeleton
                        animation="wave"
                        variant='text'
                        className='bg-stone-100 w-[100px]'
                    />
                    :
                    <p>
                        {product?.title || "Product"}
                    </p>
                }
            </Breadcrumbs>



            <div className='w-full flex flex-col lg:flex-row mt-8 gap-6' >
                {/* Product Image Gallery */}
                <div className='flex flex-[1] lg:flex-[1.6]' >
                    <div className='w-full' >
                        {(loading || !product) ?
                            <Skeleton
                                animation="wave"
                                variant='rounded'
                                className='bg-stone-100 w-full h-[35vh] lg:h-[60vh]'
                            />
                            :
                            <ImageGallery
                                items={images}
                                showThumbnails={true}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                showBullets={false}
                                infinite={true}
                                useBrowserFullscreen={false}
                                isRTL={false}
                                renderThumbInner={(item) => renderThumbnail(item)}
                                renderItem={(item) => renderZoomedImage(item)}
                                thumbnailPosition={thumbnailPosition} // Align thumbnails to the left
                                slideDuration={500} // Transition duration
                                slideInterval={2000}
                                slideOnThumbnailOver={false}
                            />
                        }
                    </div>
                </div>

                {/*Product Order Section  */}
                <div className='flex flex-[1] flex-col' >

                    <div className='w-full text-stone-950'>
                        {(loading || !product) ?
                            <>
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[200px]'
                                />

                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[120px]'
                                />
                            </>
                            :
                            <>
                                <p className='text-[16px] xl:text-[18px] font-bold'>{product.title}</p>

                                <p className='line-clamp-1 overflow-hidden text-ellipsis mt-1' >
                                    <span className='text-[18px] xl:text-[22px] font-medium text-stone-700'>
                                        Rs. {Number(product.price).toLocaleString("en-US")}
                                    </span>
                                    {" "}
                                    <span className='opacity-0 select-none'>1</span>
                                    <span className='text-[13px] xl:text-[14px] text-red-600 line-through'>
                                        Rs. {Number(product.price).toLocaleString("en-US")}
                                    </span>
                                </p>
                            </>
                        }
                    </div>
                    {(loading || !product) ?
                        <>
                            <Skeleton
                                animation="wave"
                                variant='text'
                                className='bg-stone-100 w-full md:w-[400px] py-2'
                            />
                            <Skeleton
                                animation="wave"
                                variant='text'
                                className='bg-stone-100 w-full md:w-[400px] py-2'
                            />
                            <Skeleton
                                animation="wave"
                                variant='text'
                                className='bg-stone-100 w-full md:w-[400px] py-2'
                            />
                        </>
                        :
                        <>
                            <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                                <p className='text-[15px] xl:text-[17px] font-medium capitalize'>Availability: {product.stock ? "In Stock" : "Out Of Stock"}</p>
                            </div>

                            <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                                <p className='text-[15px] xl:text-[17px] font-medium capitalize text-ellipsis line-clamp-1 overflow-hidden'>Size: {product.size}</p>
                            </div>

                            <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                                <p className='text-[15px] xl:text-[17px] font-medium capitalize text-ellipsis line-clamp-1 overflow-hidden'>Condition: {product.condition}</p>
                            </div>
                        </>
                    }

                    <div className='w-full mt-6 xl:mt-6'>
                        {(loading || !product) ?
                            <Skeleton
                                animation="wave"
                                variant='text'
                                className='bg-stone-100 w-full py-[26px]'
                            />
                            :
                            <>
                                {/* Checkout Button */}
                                < button onClick={() => add_item_to_cart(product)} className='w-full py-[12px] flex justify-center items-center text-white bg-stone-950 font-bold text-[13px] xl:text-[15px] hover:bg-white hover:text-stone-950 border border-stone-500  transition-all duration-300'>
                                    ADD TO CART
                                </button>
                            </>
                        }
                    </div>

                    <div className='w-full my-6 xl:mt-8'>
                        {(loading || !product) ?
                            <Skeleton
                                animation="wave"
                                variant='text'
                                className='bg-stone-100 w-full py-[26px]'
                            />
                            :
                            <>
                                {/* Checkout Button */}
                                <button onClick={() => {
                                    add_item_to_cart(product, "direct");
                                    router.push("/checkouts");
                                }} className='w-full py-[12px] flex justify-center items-center text-white bg-blue-500 font-bold text-[13px] xl:text-[15px] hover:bg-white hover:text-stone-950 border border-transparent hover:border-stone-500  transition-all duration-300'>
                                    BUY IT NOW
                                </button>
                            </>
                        }
                    </div>

                    <div className='w-full my-6 xl:my-8'>
                        {(loading || !product) ?
                            <>
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-full md:w-[260px] py-2'
                                />
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-full md:w-[260px] py-2'
                                />
                            </>
                            :
                            <>
                                {/* Description*/}
                                <Accordion
                                    elevation={0}
                                    sx={{
                                        border: 'none',
                                        borderTop: '1px solid #D1D5DB',
                                        '&:before': {
                                            display: 'none',
                                        },
                                    }}
                                    className="shadow-none p-0"
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='px-0'
                                    >
                                        <p className='hover:underline underline-offset-2 text-[16px] text-stone-800'>Description</p>
                                    </AccordionSummary>
                                    <AccordionDetails className='px-0'>
                                        <p>Shoe Size: {product.size_desc}</p>

                                    </AccordionDetails>
                                    <AccordionDetails className='px-0'>
                                        <p>{product.shoes_desc}</p>
                                    </AccordionDetails>
                                    <AccordionDetails className='px-0'>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                All products are guaranteed to be 100% authentic and genuine and not a fake, first copy, or replica.
                                            </li>
                                        </ul>
                                    </AccordionDetails>
                                    <AccordionDetails className='px-0'>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                We inspect each item for originality and provide actual, unedited product pictures for a transparent shopping experience so that you can see exactly what you'll receive.
                                            </li>
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>

                                {/* Condition Guide */}
                                <Accordion
                                    elevation={0}
                                    sx={{
                                        border: 'none',
                                        borderTop: '1px solid #D1D5DB',
                                        '&:before': {
                                            display: 'none',
                                        },
                                    }}
                                    className="shadow-none p-0"
                                >
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
                                        <ul className="list-disc pl-5">
                                            <li>Item is brand new and hasn't been worn before.</li>
                                        </ul>
                                    </AccordionDetails>
                                    <AccordionDetails className='p-[15px] flex items-center bg-stone-100'>
                                        <p className='w-[130px]'>PREMIUM</p>
                                        <ul className="list-disc pl-5">
                                            <li>Item is in almost brand-new condition.</li>
                                        </ul>
                                    </AccordionDetails>
                                    <AccordionDetails className='p-[15px] flex items-center'>
                                        <p className='w-[130px]'>EXCELLENT</p>
                                        <ul className="list-disc pl-5">
                                            <li>Item has very little signs of wear.</li>
                                        </ul>
                                    </AccordionDetails>
                                    <AccordionDetails className='p-[15px] flex items-center bg-stone-100'>
                                        <p className='w-[130px]'>VERY GOOD</p>
                                        <ul className="list-disc pl-5">
                                            <li>Item has visible signs of wear and use.</li>
                                        </ul>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        }

                    </div>
                </div>

            </div>
            {/* Related Products */}
            <div className='mt-[100px] lg:mt-[140px]'>
                <h1 className='text-[20px] text-stone-800 w-full text-center mb-[20px] flex justify-center' >
                    {(loading || !product) ?
                        <Skeleton
                            animation="wave"
                            variant='text'
                            className='bg-stone-100 w-[200px] md:w-[300px]'
                        /> :
                        "RELATED PRODUCTS"
                    }
                </h1>
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
                            items: 6,
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

                    {(loading || !product) ?

                        [...Array(8)].map((_, i) => (
                            <div key={i} className='w-full px-1 md:px-3'>

                                <Skeleton
                                    index={i}
                                    animation="wave"
                                    variant='rounded'
                                    className='bg-stone-100 w-full h-[160px] lg:h-[200px]'
                                />
                            </div>
                        ))

                        :

                        products.slice(0, 20).map((product, i) => (
                            <Link href={`/product?id=${product._id}`} key={i}>
                                <div
                                    className={`p-2 md:p-4 flex flex-col gap-2 cursor-pointer w-fit`}
                                >
                                    <div className='relative'>
                                        <div className={`"w-[220px] h-[160px] md:h-[200px] overflow-hidden shadow-sm`}>

                                            <Image alt="Product" src={product_image} className={`w-[220px] h-[160px] md:h-[200px] hover:scale-[1.1] object-contain transition-all duration-500`} />


                                        </div>
                                        <p className='w-[35px] h-[35px] text-center text-[12px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-8px] right-[2px] z-[10]' >
                                            -66%
                                        </p>
                                    </div>


                                    <div className='flex flex-col gap-1'>
                                        <p className='text-[14px] md:text-[16px] font-bold text-stone-600 line-clamp-1 overflow-hidden text-ellipsis' >{product.title}</p>
                                        <p className='mt-2 line-clamp-1 overflow-hidden text-ellipsis' >
                                            <span className='text-[13px] md:text-[15px] font-bold text-black'>
                                                Rs. {product.price.toLocaleString("en-US")}
                                            </span>
                                            {" "}
                                            <span className='text-[12px] md:text-[13px] line-through text-red-600'>
                                                Rs. {product.price.toLocaleString("en-US")}
                                            </span>
                                        </p>
                                        <p className='text-[13px] md:text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                                        <p className='text-[13px] md:text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                                    </div>
                                </div>
                            </Link>
                        ))}


                </Carousel>
            </div>


        </div >
    )
}

export default Product_page