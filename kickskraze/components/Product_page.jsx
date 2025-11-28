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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';
import { IconButton, Skeleton } from '@mui/material';
import { calculate_discount_precentage, resolve_meta_category, resolve_meta_content_id, select_thumbnail_from_media, sort_product_media } from '@/utils/functions/produc_fn';
import Fade from 'react-reveal/Fade';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { MetaPixel } from '@/lib/fpixel';
import ShareIcon from '@mui/icons-material/Share';
import { color_list } from '@/utils/product_info_list';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const VideoThumbnail = ({ videoUrl }) => {
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        const generateThumbnail = async (videoUrl) => {
            return new Promise((resolve, reject) => {
                const video = document.createElement("video");
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                video.src = videoUrl;
                video.crossOrigin = "anonymous"; // Prevent CORS issues
                video.load();

                video.onloadedmetadata = () => {
                    // Seek to middle of the video
                    video.currentTime = video.duration / 2;
                };

                video.onseeked = () => {
                    // Set canvas size
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Convert canvas to image
                    const thumbnailUrl = canvas.toDataURL("image/jpeg");
                    resolve(thumbnailUrl);
                };

                video.onerror = (err) => reject(err);
            });
        };

        generateThumbnail(videoUrl)
            .then((url) => setThumbnail(url))
            .catch(() => setThumbnail(null)); // Handle errors gracefully
    }, [videoUrl]);

    if (!thumbnail) return <p></p>;

    return (
        <div className='relative' >
            <img src={thumbnail} alt="Video Thumbnail" className="w-full h-[56.25px] md:h-[69px] object-cover" />
            <div className='absolute inset-0 right-0 left-0 top-0 bottom-0 w-full h-full bg-[rgba(0,0,0,.3)] flex items-center justify-center'  >
                <PlayArrowIcon className='text-[rgba(255,255,255,0.8)] text-[34px]' />
            </div>
        </div>
    );
};



const Product_page = ({ axios }) => {

    const router = useRouter();

    const { get_product_api, get_all_products_api, stored_product_id, set_stored_product_id, add_item_to_cart, toggle_modal, set_snackbar_alert } = useStateContext();
    const [is_loading, set_is_loading] = useState(true);
    const [product, set_product] = useState({});

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

    useEffect(() => {
        if (!router.isReady) return;
        const { product_id } = router.query;
        set_stored_product_id(product_id);
        if (!Object.entries(product).length || stored_product_id !== product_id) {
            get_product_api(axios, product_id, product, set_product, set_is_loading)
        }
    }, [router.query, router.isReady])

    // Set default selected options on product load
    useEffect(() => {
        if (!product?.has_variants || !product.variants?.length) return;

        const firstVariant = product.variants[0];

        setSelectedOptions(() => ({
            size: firstVariant.options.size ?? null,
            color: firstVariant.options.color ?? null,
        }));

        setSelectedVariant(firstVariant);
    }, [product]);


    const convert_product_to_meta = (product) => {
        const meta_product = {
            content_ids: [[resolve_meta_content_id(product)]],
            content_name: product.title,
            content_type: "product",
            content_category: resolve_meta_category(product),
            value: product.price.toFixed(2),
            currency: "PKR",
        }
        return meta_product;
    }


    // Related Product Fetching
    const [show_more_payload, set_show_more_payload] = useState({
        limit: 52,
        page: 1,
        hasMore: false,
        count: 0,
    });
    const [related_products, set_related_products] = useState([]);
    const [is_RP_loading, set_is_RP_loading] = useState();
    // Fetching Related Products
    useEffect(() => {
        if (Object.entries(product).length && !related_products.length) {

            MetaPixel.trackEvent("ViewContent", convert_product_to_meta(product));
            get_all_products_api(axios, `size=${product.size}&brand=${product.brand}`, set_related_products, set_show_more_payload, set_is_RP_loading);
        }
    }, [product]);



    const renderZoomedImage = (item) => (
        <>
            {item.type === "video" ?
                <div className='flex-[1.6]'>
                    <video
                        src={item.url}
                        controls
                        muted
                        className='w-full h-[450px] sm:h-[650px] md:h-[800px] lg:h-[700px] 2xl:h-[800px] object-contain object-center'
                        onError={(e) => e.target.src = "/images/logo_error.png"}
                    />
                </div>
                :
                <Zoom>
                    <div className='flex-[1.6]'>
                        <img
                            src={item.url}
                            alt="Zoomable"
                            className='w-full h-[450px] sm:h-[650px] md:h-[800px] lg:h-[700px] 2xl:h-[800px] object-cover object-center'
                            onError={(e) => e.target.src = "/images/logo_error.png"}
                        />
                    </div>
                </Zoom>
            }
        </>
    );


    const renderThumbnail = (item) => {

        return (
            <>
                {item.type === "video" ? (
                    <VideoThumbnail videoUrl={item.thumbnail} />
                ) : (
                    <img src={item.thumbnail} alt="Thumbnail" className="w-full h-[56.25px] md:h-[69px] object-cover" onError={(e) => e.target.src = "/images/logo_error.png"} />
                )}
            </>
        )
    };

    // Variants and options logic for product
    const [selectedOptions, setSelectedOptions] = useState({
        size: null,
        color: null,
    });

    const [selectedVariant, setSelectedVariant] = useState(null);

    const [quantity, setQuantity] = useState(1);

    // Option Selection Handler
    const handleSelectOption = (optionName, value) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value,
        }));
    };

    // product might be {} or undefined initially
    const optionsArray = Array.isArray(product?.options) ? product.options : [];

    const sizeOption = optionsArray.find(o => o.name === "size") || null;
    const colorOption = optionsArray.find(o => o.name === "color") || null;

    // Update selectedVariant when selectedOptions change
    useEffect(() => {
        if (!product.variants) return;

        const found = product.variants.find(v => {
            return Object.keys(v.options).every(
                key => v.options[key] === selectedOptions[key]
            );
        });

        setSelectedVariant(found || null);
    }, [selectedOptions]);

    // Auto-update quantity when variant changes
    useEffect(() => {
        if (product.has_variants) {
            const stock = selectedVariant?.stock ?? 0;

            if (stock === 0) {
                setQuantity(0); // Variant unavailable
            } else if (quantity === 0) {
                setQuantity(1); // Reset to valid qty if previously 0
            }
        }
    }, [selectedVariant]);

    // Quantity Handlers
    const increaseQty = () => {
        const maxStock = product.has_variants
            ? selectedVariant?.stock || 0
            : product.stock || 0;

        if (quantity < maxStock) {
            setQuantity(q => q + 1);
        } else {
            set_snackbar_alert({
                open: true,
                message: "Not enough stock available!",
                severity: "warning"
            });
        }
    };

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    // Stock Checker function
    const stock_checker = (product) => {
        if (!Boolean(Object.entries(product).length)) return false;

        const isInStock = product.has_variants
            ? selectedVariant && selectedVariant.stock > 0
            : product.stock > 0;
        return isInStock;
    };

    // Add to Cart Handler
    const handleAddToCart = () => {
        if (product.has_variants) {
            if (!selectedVariant) {
                set_snackbar_alert({
                    open: true,
                    message: "Please select a variant first",
                    severity: "warning"
                });
                return;
            }

            add_item_to_cart({
                ...product,
                price: selectedVariant.price,
                stock: selectedVariant.stock,
                selectedVariant,
                quantity,
            });

        } else {
            add_item_to_cart({
                ...product,
                quantity,
            });
        }
    };

    // Buy Now Handler
    const handleBuyNow = () => {
        if (product.has_variants) {
            if (!selectedVariant) {
                set_snackbar_alert({
                    open: true,
                    message: "Please select a variant first",
                    severity: "warning"
                });
                return;
            }
            add_item_to_cart(
                {
                    ...product,
                    price: selectedVariant ? selectedVariant.price : product.price,
                    stock: selectedVariant ? selectedVariant.stock : product.stock,
                    selectedVariant,
                    quantity,
                },
                "direct" // << 🔥 triggers direct checkout behavior
            );
            router.push("/checkouts");
        } else {
            add_item_to_cart({
                ...product,
                quantity,
            });
            router.push("/checkouts");
        }
    };




    return (
        <div className='w-full px-[20px] lg:px-[60px] pt-[15px] md:pt-[30px] '>
            {is_loading ?
                <>
                    <Fade>
                        <Breadcrumbs className='text-gray-400 text-[13px] md:text-[15px]' separator={<NavigateNextIcon fontSize="small" />} >
                            <Skeleton
                                animation="wave"
                                variant='text'
                                className='bg-stone-100 w-[80px]'
                            />
                            <Skeleton
                                animation="wave"
                                variant='text'
                                className='bg-stone-100 w-[100px]'
                            />

                        </Breadcrumbs>
                    </Fade>


                    <div className='w-full flex flex-col lg:flex-row mt-8 gap-6' >

                        {/* Product Image Gallery */}
                        <Fade>
                            <div className='flex flex-[1] lg:flex-[1.6]' >
                                <div className='w-full' >
                                    <Skeleton
                                        animation="wave"
                                        variant='rounded'
                                        className='w-full h-[450px] sm:h-[650px] md:h-[800px] lg:h-[700px] 2xl:h-[800px]'
                                    />
                                </div>
                            </div>
                        </Fade>

                        {/* Product Details */}
                        <Fade>
                            <div className='flex flex-[1] flex-col' >

                                <div className='w-full text-stone-950'>

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
                                </div>

                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[45%] py-2 mt-6'
                                />
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[55%] py-2'
                                />
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[45%] py-2'
                                />
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[48%] py-2'
                                />
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[40%] py-2'
                                />



                                <div className='w-full mt-6 xl:mt-6'>
                                    <Skeleton
                                        animation="wave"
                                        variant='text'
                                        className='bg-stone-100 w-full py-[26px]'
                                    />
                                </div>

                                <div className='w-full my-6 xl:mt-8'>
                                    <Skeleton
                                        animation="wave"
                                        variant='text'
                                        className='bg-stone-100 w-full py-[26px]'
                                    />
                                </div>

                                <div className='w-full my-6 xl:my-8'>

                                    <Skeleton
                                        animation="wave"
                                        variant='text'
                                        className='bg-stone-100 w-[45%] py-2'
                                    />
                                    <Skeleton
                                        animation="wave"
                                        variant='text'
                                        className='bg-stone-100 w-[55%] py-2'
                                    />
                                </div>
                            </div>
                        </Fade>

                    </div>
                    {/* Related Products */}
                    <Fade>
                        <div className='mt-[100px] lg:mt-[140px]'>
                            <h1 className='text-[20px] text-stone-800 w-full text-center mb-[20px] flex justify-center' >
                                <Skeleton
                                    animation="wave"
                                    variant='text'
                                    className='bg-stone-100 w-[200px] md:w-[300px]'
                                />
                            </h1>
                            <div className='grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
                                {[...Array(6)].map((_, i) => (
                                    <Fade key={i}>
                                        <div className={`p-4 
                                       ${i === 1 ? 'hidden sm:block' : ''} 
                                       ${i === 2 ? 'hidden md:block' : ''} 
                                       ${i === 3 ? 'hidden xl:block' : ''} 
                                       ${i === 4 ? 'hidden 2xl:block' : ''} 
                                       ${i === 5 ? 'hidden 2xl:block' : ''}`
                                        }>
                                            <Skeleton
                                                variant='rounded'
                                                animation="wave"
                                                className='bg-stone-100 w-full h-[140px]  md:h-[170px]'
                                            />
                                            <Skeleton
                                                variant='text'
                                                animation="wave"
                                                className='bg-stone-100 w-[140px] md:w-[160px]'
                                            />
                                            <div className='mt-4 flex flex-col gap-1' >
                                                <Skeleton
                                                    variant='rounded'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[90px] md:w-[100px] h-[14px]'
                                                />
                                                <Skeleton
                                                    variant='rounded'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[70px] md:w-[80px] h-[14px]'
                                                />
                                                <Skeleton
                                                    variant='rounded'
                                                    animation="wave"
                                                    className='bg-stone-100 w-[120px] md:w-[140px] h-[14px]'
                                                />
                                            </div>
                                        </div>
                                    </Fade>
                                ))}
                            </div>
                        </div>
                    </Fade>
                </>
                : Boolean(Object.entries(product).length) ?
                    <>
                        {/* Breadcrumbs */}
                        <Fade>
                            <div className="w-full overflow-hidden">
                                <nav className="flex items-center text-gray-400 text-[13px] md:text-[15px]">
                                    {/* Home Link */}
                                    <a href="/collection" className="hover:underline active:text-gray-600 flex-shrink-0">
                                        Home
                                    </a>

                                    {/* Separator Icon (MUI) */}
                                    <NavigateNextIcon className="h-5 w-5 mx-2 text-gray-500" fontSize="small" />

                                    {/* Product Title (Truncated) */}
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                                            {product?.title || "Product"}
                                        </p>
                                    </div>
                                </nav>
                            </div>
                        </Fade>



                        <div className='w-full flex flex-col lg:flex-row mt-8 gap-6' >
                            <Fade>
                                {/* Product Image Gallery */}
                                <div className='flex flex-[1] lg:flex-[1.6]' >
                                    <div className='w-full' >
                                        <ImageGallery
                                            items={sort_product_media(product.media)}
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
                                    </div>
                                </div>
                            </Fade>


                            {/*Product Order Section  */}
                            <Fade>
                                <div className='flex flex-[1] flex-col' >

                                    <div className='w-full text-stone-950'>


                                        <p className='text-[16px] xl:text-[18px] font-bold'>{product.title}</p>

                                        <p className='line-clamp-1 overflow-hidden text-ellipsis mt-1' >
                                            <span className='text-[18px] xl:text-[22px] font-medium text-stone-700'>
                                                Rs. {Number(selectedVariant ? selectedVariant.price : product.price).toLocaleString("en-US")}
                                            </span>
                                            {" "}
                                            <span className='opacity-0 select-none'>1</span>
                                            {Boolean(product.compare_price) &&
                                                <span className='text-[13px] xl:text-[14px] text-red-600 line-through'>
                                                    Rs. {Number(product.compare_price).toLocaleString("en-US")}
                                                </span>
                                            }
                                        </p>

                                    </div>

                                    {!product.has_variants &&
                                        <div className='py-[14px] xl:py-[16px] border-y border-stone-200 text-stone-700 mt-6' >
                                            <p className='text-[15px] xl:text-[17px] font-medium capitalize'><strong>Availability:</strong> {product.stock ? "In Stock" : "Out Of Stock"}</p>
                                        </div>
                                    }


                                    {(!product.has_variants && product.size) &&
                                        <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                                            <p className='text-[15px] xl:text-[17px] font-medium capitalize text-ellipsis line-clamp-1 overflow-hidden'><strong>Size:</strong> {product.size}</p>
                                        </div>
                                    }


                                    {(!product.has_variants && product.color) &&
                                        <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700 flex items-center' >
                                            <p className='text-[15px] xl:text-[17px] font-medium capitalize text-ellipsis line-clamp-1 overflow-hidden'>
                                                <strong>Color:</strong> {product.color}
                                            </p>
                                            <div
                                                className={`ml-3 w-[18px] md:w-[20px] h-[18px] md:h-[20px] rounded-sm md:rounded-md shadow-sm ${color_list.find(e => e.color === product.color)?.bg}`}
                                            />
                                        </div>
                                    }


                                    <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                                        <p className='text-[15px] xl:text-[17px] font-medium capitalize text-ellipsis line-clamp-1 overflow-hidden'><strong>Brand:</strong> {product.brand}</p>
                                    </div>

                                    <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                                        <p className='text-[15px] xl:text-[17px] font-medium capitalize text-ellipsis line-clamp-1 overflow-hidden'><strong>Category:</strong> {product.category}</p>
                                    </div>

                                    {product.is_thrifted &&
                                        <div className='py-[14px] xl:py-[16px] border-b border-stone-200 text-stone-700' >
                                            <p className='text-[15px] xl:text-[17px] font-medium capitalize text-ellipsis line-clamp-1 overflow-hidden'><strong>Condition:</strong> {product.condition}</p>
                                        </div>
                                    }


                                    {/* Size Selector */}
                                    {Boolean(sizeOption) && (

                                        <div className='pt-[17px] pb-[24px] xl:pt-[19px] xl:pb-[26px] border-b border-stone-200'>
                                            <p className='text-stone-700 text-[15px] xl:text-[17px] mb-2'>Size: {selectedOptions.size}</p>

                                            <div className='flex flex-wrap items-center gap-2 md:gap-4'>
                                                {sizeOption.values.map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => handleSelectOption("size", size)}
                                                        className={`border border-stone-200 w-[50px] md:w-[60px] py-[6px] md:py-[8px] rounded-md text-[15px] md:text-[17px] ${selectedOptions.size === size ? "text-stone-50 bg-stone-600" : "text-stone-700 bg-transparent"}`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}

                                            </div>
                                        </div>
                                    )}


                                    {/* Color Selector */}
                                    {Boolean(colorOption) && (
                                        <div className='pt-[17px] pb-[24px] xl:pt-[19px] xl:pb-[26px] border-b border-stone-200'>
                                            <p className='text-stone-700 text-[15px] xl:text-[17px] mb-2'>Color: {selectedOptions.color}</p>

                                            <div className='flex flex-wrap items-center gap-4 md:gap-6'>
                                                {colorOption.values.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleSelectOption("color", color)}
                                                        className={`${color_list.find(e => e.color === color)?.bg} w-[34px] h-[34px] md:w-[40px] md:h-[40px] rounded-full border-[3px] ring-offset-1 ring-offset-white transition-all ${selectedOptions.color === color ? "ring-2  ring-stone-700" : "ring-0"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity Counter */}
                                    <div className='py-[17px] xl:py-[19px] flex items-center gap-4'>
                                        <p className='text-gray-400 text-[15px] xl:text-[17px]'>Quantity:</p>
                                        <div
                                            className={`select-none border border-gray-200 rounded-md flex items-center gap-6 md:gap-10
                                                ${selectedVariant?.stock === 0 ? "opacity-50 pointer-events-none" : ""}
                                                `}
                                        >
                                            <button
                                                onClick={decreaseQty}
                                                className='px-[10px] md:px-[14px] py-[10px] md:py-[12px] text-stone-800 active:text-stone-400 transition-all'
                                            >
                                                <RemoveIcon className='text-[20px] font-bold' />
                                            </button>

                                            <p className='text-stone-700 font-semibold text-[15px] md:text-[17px]'>{quantity}</p>

                                            <button
                                                onClick={increaseQty}
                                                className='px-[10px] md:px-[14px] py-[10px] md:py-[12px] text-stone-800 active:text-stone-400 transition-all'
                                            >
                                                <AddIcon className='text-[20px] font-bold' />
                                            </button>
                                        </div>
                                    </div>



                                    {stock_checker(product) ?
                                        <>
                                            <Fade>
                                                <div className='w-full mt-6 xl:mt-6 flex gap-2 items-center'>
                                                    {/* Checkout Button */}
                                                    <div>
                                                        <IconButton onClick={() => toggle_modal("share_link_modal")}>
                                                            <ShareIcon className='text-[18px] md:text-[23px]' />
                                                        </IconButton>
                                                    </div>
                                                    < button onClick={handleAddToCart} className='w-full py-[12px] flex justify-center items-center text-white bg-stone-950 font-bold text-[13px] xl:text-[15px] hover:bg-white hover:text-stone-950 border border-stone-500  transition-all duration-300'>
                                                        ADD TO CART
                                                    </button>
                                                </div>
                                            </Fade>

                                            <Fade>

                                                <div className='w-full my-6 xl:mt-8'>
                                                    {/* Checkout Button */}
                                                    <button onClick={handleBuyNow} className='w-full py-[12px] flex justify-center items-center text-white bg-blue-500 font-bold text-[13px] xl:text-[15px] hover:bg-white hover:text-stone-950 border border-transparent hover:border-stone-500  transition-all duration-300'>
                                                        BUY IT NOW
                                                    </button>
                                                </div>
                                            </Fade>
                                        </>
                                        :
                                        <Fade>
                                            <div className='w-full mt-6 xl:mt-6'>
                                                {/* Checkout Button */}
                                                < button disabled className='w-full py-[12px] flex justify-center items-center text-white bg-stone-950 font-bold text-[13px] xl:text-[15px] opacity-60'>
                                                    {product.has_variants ? "OUT OF STOCK" : "SOLD OUT"}
                                                </button>
                                            </div>
                                        </Fade>

                                    }

                                    <Fade>
                                        <div className='w-full my-6 xl:my-8'>
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

                                        </div>
                                    </Fade>

                                </div>
                            </Fade>

                        </div>

                        {/* Related Products */}
                        {is_RP_loading ?
                            <Fade>
                                <div className='mt-[100px] lg:mt-[140px]'>
                                    <h1 className='text-[20px] text-stone-800 w-full text-center mb-[20px] flex justify-center' >
                                        <Skeleton
                                            animation="wave"
                                            variant='text'
                                            className='bg-stone-100 w-[200px] md:w-[300px]'
                                        />
                                    </h1>
                                    <div className='grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
                                        {[...Array(6)].map((_, i) => (
                                            <Fade key={i}>
                                                <div className={`p-4 
                                        ${i === 1 ? 'hidden sm:block' : ''} 
                                        ${i === 2 ? 'hidden md:block' : ''} 
                                        ${i === 3 ? 'hidden xl:block' : ''} 
                                        ${i === 4 ? 'hidden 2xl:block' : ''} 
                                        ${i === 5 ? 'hidden 2xl:block' : ''}`
                                                }>
                                                    <Skeleton
                                                        variant='rounded'
                                                        animation="wave"
                                                        className='bg-stone-100 w-full h-[230px] md:h-[250px] '
                                                    />
                                                    <Skeleton
                                                        variant='text'
                                                        animation="wave"
                                                        className='bg-stone-100 w-[140px] md:w-[160px]'
                                                    />
                                                    <div className='mt-4 flex flex-col gap-1' >
                                                        <Skeleton
                                                            variant='rounded'
                                                            animation="wave"
                                                            className='bg-stone-100 w-[90px] md:w-[100px] h-[14px]'
                                                        />
                                                        <Skeleton
                                                            variant='rounded'
                                                            animation="wave"
                                                            className='bg-stone-100 w-[70px] md:w-[80px] h-[14px]'
                                                        />
                                                        <Skeleton
                                                            variant='rounded'
                                                            animation="wave"
                                                            className='bg-stone-100 w-[120px] md:w-[140px] h-[14px]'
                                                        />
                                                    </div>
                                                </div>
                                            </Fade>
                                        ))}
                                    </div>
                                </div>
                            </Fade>
                            : Boolean(related_products.filter(e => e._id !== product._id).length) ?
                                <Fade>
                                    <div className='mt-[100px] lg:mt-[140px]'>
                                        <h1 className='text-[20px] text-stone-800 w-full text-center mb-[20px] flex justify-center' >
                                            RELATED PRODUCTS
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

                                            {related_products.filter(e => e._id !== product._id).slice(0, 18).map((product) => (
                                                <Fade key={product._id}>
                                                    <Link href={`/product?product_id=${product._id}`} >
                                                        <div
                                                            className={`p-2 md:p-4 flex flex-col gap-2 cursor-pointer w-fit`}
                                                        >
                                                            <div className='relative'>

                                                                <div className={`"shadow-sm`}>
                                                                    <img alt="" src={select_thumbnail_from_media(product.media)} className={`w-[220px] h-[230px] md:h-[250px] object-cover object-center`} />
                                                                </div>

                                                                {Boolean(calculate_discount_precentage(product.price, product.compare_price)) &&
                                                                    < p className='w-[35px] h-[35px] text-center text-[12px] flex items-center justify-center bg-[#FF0000] text-white rounded-full font-bold absolute top-[-8px] right-[2px] z-[10]' >
                                                                        -{calculate_discount_precentage(product.price, product.compare_price)}%
                                                                    </p>
                                                                }
                                                            </div>


                                                            <div className='flex flex-col gap-1'>
                                                                <p className='text-[14px] md:text-[16px] font-bold text-stone-600 line-clamp-1 overflow-hidden text-ellipsis' >{product.title}</p>
                                                                <p className='mt-2 line-clamp-1 overflow-hidden text-ellipsis' >
                                                                    <span className='text-[13px] md:text-[15px] font-bold text-black'>
                                                                        Rs. {product.price.toLocaleString("en-US")}
                                                                    </span>
                                                                    {" "}
                                                                    {Boolean(product.compare_price) &&
                                                                        <span className='text-[12px] md:text-[13px] line-through text-red-600'>
                                                                            Rs. {product.compare_price.toLocaleString("en-US")}
                                                                        </span>
                                                                    }
                                                                </p>
                                                                {!product.has_variants &&
                                                                    <p className='text-[13px] md:text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Size: {product.size}</p>
                                                                }
                                                                {product.condition !== "brand new" &&
                                                                    <p className='text-[13px] md:text-[14px] text-black line-clamp-1 overflow-hidden text-ellipsis' >Condition: <span className='capitalize text-stone-700 text-[13px]'>{product.condition}</span></p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </Fade>

                                            ))}

                                        </Carousel>
                                    </div>
                                </Fade>
                                :
                                <></>
                        }

                    </>
                    :
                    <div></div>
            }

        </div >
    )
}

export default Product_page