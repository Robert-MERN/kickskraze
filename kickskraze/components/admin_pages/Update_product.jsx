import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import styles from "@/styles/home.module.css";
import { IoClose } from "react-icons/io5";
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import useStateContext from '@/context/ContextProvider';
import { nanoid } from 'nanoid';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import { apparel_type_list, brand_list, category_list, color_list, condition_list, footwear_accessories_type_list, jewelry_type_list, sandals_type_list, size_list, store_list } from '@/utils/product_info_list';
import { TbShoppingBagEdit } from "react-icons/tb";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { GiConverseShoe } from "react-icons/gi";
import { useRouter } from 'next/router';
import mongoose from 'mongoose';
import { build_variants, capitalizeWords, fill_missing_variant_values } from '@/utils/functions/produc_fn';
import StoreIcon from '@mui/icons-material/Store';
import { CircularProgress } from '@mui/material';
import { GiClothes } from "react-icons/gi";




const Update_product = ({ axios, user: USER }) => {

    const loadedTypeRef = useRef(false);


    const {
        update_product_api,
        product_id, set_product_id,
        update_product_details,
        set_update_product_details,
        default_update_product_details,
        set_API_loading,
        API_loading,
        toggle_modal,
        get_all_products_title_api,
        get_product_api,
        products_title,
        set_products_title,
        user,
        set_user,
        get_user_api,
        set_snackbar_alert,
        get_filter_values_api,
        filter_options,
        set_filter_options,
    } = useStateContext();

    const router = useRouter();

    const [fetched_brand_list, set_fetched_brand_list] = useState([])

    const build_brand_list = (newBrandsFromDB, oldBrandList) => {
        // Normalize inputs
        const safeNewBrands = Array.isArray(newBrandsFromDB) ? newBrandsFromDB : [];
        const safeOldList = Array.isArray(oldBrandList) ? oldBrandList : [];

        // Convert ["Nike", "Adidas"] → [{ brand:"Nike", _id:"..." }]
        const formattedNewBrands = safeNewBrands.map(b => ({
            brand: b,
            _id: nanoid(8)
        }));

        // Merge old + new
        const merged = [...safeOldList, ...formattedNewBrands];

        // Remove duplicates (case-insensitive)
        const uniqueBrandList = [
            ...new Map(
                merged.map(item => [String(item.brand).toLowerCase(), item])
            ).values()
        ];

        set_fetched_brand_list(uniqueBrandList);
    };

    // Fetching user with USER.id to know the current values of user.
    useEffect(() => {
        if (USER) {
            get_user_api(axios, USER.id, set_user, set_API_loading);
        }
    }, [USER]);


    // validate Order ID
    const isValidObjectId = (id) => {
        if (typeof id !== "string") return false;
        try {
            return new mongoose.Types.ObjectId(id); // If valid, it returns the ObjectId
        } catch (error) {
            return false; // Invalid ID
        }
    };

    useEffect(() => {
        if (!router.isReady) return;

        if (isValidObjectId(router.query?.product_id)) {
            set_product_id(router.query.product_id);
        }

    }, [router.isReady, router.query]);


    // Search Debounce Functionality
    const [searchTerm, setSearchTerm] = useState("");
    const [is_loading_local, set_is_loading_local] = useState(true);

    useEffect(() => {
        if (user) {

            if (!Object.entries(filter_options).length) {
                get_filter_values_api(axios, set_filter_options, set_is_loading_local);
            }

            const delayDebounce = setTimeout(() => {
                if (searchTerm.trim()) {
                    // Search when user types something
                    get_all_products_title_api(axios, set_products_title, set_is_loading_local, `search=${encodeURIComponent(searchTerm)}&store_name=${encodeURIComponent(user.store_name)}`);
                } else {
                    // Default: load latest 100 products
                    get_all_products_title_api(axios, set_products_title, set_is_loading_local, `store_name=${encodeURIComponent(user.store_name)}`);
                }

            }, 600);

            return () => clearTimeout(delayDebounce);
        }
    }, [searchTerm, user]);

    useEffect(() => {
        if (Object.keys(filter_options).length) {
            build_brand_list(filter_options.brands, brand_list);
        } else {
            build_brand_list([], brand_list);
        }
    }, [filter_options]);


    const style_textfield = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgb(214 211 209)', // Default border color
            },
            '&:hover fieldset': {
                borderColor: 'black', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: 'black', // Focused border color
            },
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: 'black', // Focused label color
        },
    };

    const style_textfield_2 = {
        '& .MuiOutlinedInput-root': {
            cursor: "default", // Set cursor to pointer for the entire input
            '& fieldset': {
                borderColor: 'rgb(214 211 209)', // Default border color
                borderWidth: "2px",
            },
            '&:hover fieldset': {
                borderColor: 'rgb(214 211 209)', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgb(214 211 209)', // Focused border color
            },
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: 'rgb(214 211 209)', // Focused label color
        },
    };





    useEffect(() => {
        if (product_id) {
            get_product_api(axios, product_id, update_product_details, set_update_product_details, set_API_loading);
        }

    }, [product_id])





    const handleChange = async (event) => {
        const { name, value, _id } = event.target;
        if (name === "media") {
            const files = event.target.files;
            if (!files?.length) return;

            let mediaUpdates = [];

            for (const file of files) {
                const ext = file.name.split(".").pop().toLowerCase();
                let fileType = file.type || (ext.includes("heic") ? "image/heic" : null);
                let fileUrl = URL.createObjectURL(file);
                mediaUpdates.push({
                    type: fileType.startsWith("image/") ? "image" : fileType.startsWith("video/") ? "video" : "unknown",
                    url: fileUrl,
                    thumbnail: false,
                    _id: nanoid(),
                });
            }

            // Ensure the update happens correctly
            set_update_product_details((prevState) => ({
                ...prevState,
                media: [...(prevState.media || []), ...mediaUpdates],
            }));

            event.target.value = "";
            return;
        }

        if (name === "remove_image") {
            set_update_product_details((prevState) => {
                const media = [...(prevState.media || [])];
                const index = media.findIndex((e) => e._id === _id);
                if (index !== -1) {
                    URL.revokeObjectURL(media[index].url);
                    media.splice(index, 1);
                }
                return { ...prevState, media };
            });
            return;
        }

        if (name === "set_thumbnail") {
            set_update_product_details((prevState) => ({
                ...prevState,
                media: prevState.media.map((item) => ({ ...item, thumbnail: item._id === _id ? value : false })),
            }));
            return;
        }

        if (name === "featured") {
            set_update_product_details((prevState) => ({
                ...prevState,
                featured: Boolean(value),
            }));
            return;
        }

        set_update_product_details((prevState) => ({
            ...prevState,
            [name]: value || "",
        }));
    };


    useEffect(() => {
        const element = document.getElementById("add_media");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center", });
        }

    }, [update_product_details.media])


    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'title':
                if (!value) {
                    error = 'Please enter the product title';
                }
                break;
            case 'price':
                if (!value) {
                    error = 'Please enter the price';
                }
                break;
            case 'cost_price':
                if (!value) {
                    error = 'Please enter the cost price';
                }
                break;
            case 'compare_price':
                if (value && !update_product_details.price) {
                    error = "Compare price can't be added without an actual Price."
                };
                if (value && update_product_details.price && (Number(value) < Number(update_product_details.price))) {
                    error = "Compare price should be greater than the actual Price."
                };
                break;
            case 'size':
                if (user?.store_name !== "Jewelry" && update_product_details.store_name !== "Footwear-accessories" && !value) {
                    error = 'Please enter the product size';
                }
                if (update_product_details.type === "socks" && !value) {
                    error = 'Please enter the product size';
                }
                if (value && Array.isArray(value) && value.toString().replaceAll(",", ", ").length > 200) {
                    error = 'Sizes character limit exceeded 200';
                }
                break;
            case 'color':
                if (value && Array.isArray(value) && value.toString().replaceAll(",", ", ").length > 200) {
                    error = 'Colors character limit exceeded 200';
                }
                break;
            case 'type':
                if (
                    (
                        user?.store_name !== "Footwear" ||
                        /Footwear-accessories|Areeba-sandals|SM-sandals/.test(update_product_details.store_name)
                    )
                    && !value
                ) {
                    error = 'Please select the product type';
                }
                break;
            case 'brand':
                if (!value) {
                    error = 'Please select the product brand';
                }
                break;
            case 'condition':
                if (!value) {
                    error = 'Please select the product condition';
                }
                break;
            case 'category':
                if (!value) {
                    error = 'Please select the product category';
                }
                break;
            case 'stock':
                if (value < 0) {
                    error = 'Please enter the product stock quantity atleast greater than -1';
                }
                break;
            // case 'size_desc':
            //     if (!value) {
            //         error = 'Please enter the product size description';
            //     }
            //     break;
            // case 'shoes_desc':
            //     if (!value) {
            //         error = 'Please enter the product description';
            //     }
            //     break;
            case 'store_name':
                if (user?.store_name === "Footwear" && !value) {
                    error = 'Please select the store name';
                }
                if (["Jewelry", "Apparel"].includes(user?.store_name) && !value) {
                    error = 'Store cannot be empty for this account';
                }
                break;
            case 'media':
                if (!value.length) {
                    error = 'Please add the product media';
                }
                if (value.length && value.every(e => e.type !== "image")) {
                    error = 'Please add atleast 1 image to the media';
                }
                break;
            default:
                break;
        }
        return error;
    }
    // <<<<<<<<<<<<<<<<---------------------- Size and Colors Functionality ------------------->>>>>>>>>>>>>>> \\
    const default_size_color = {
        size: "",
        color: "",
    }
    const [size_color, set_size_color] = useState(default_size_color);
    const default_size_color_array = {
        size: [],
        color: [],
    }
    const [size_color_array, set_size_color_array] = useState(default_size_color_array);

    const handle_size_color_change = (e) => {
        const { name, value } = e.target;
        set_size_color(pre => ({ ...pre, [name]: value }));
    }

    const handle_size_color_btn = (e, task) => {
        const { name, value } = e
        if (value) {
            const normalizedValue = isNaN(Number(value)) ? value : Number(value);
            set_size_color_array(prev => {
                const copy_array = [...prev[name]]
                const item_index = copy_array.indexOf(normalizedValue);
                if (item_index !== -1) {
                    if (task === "remove") {
                        copy_array.splice(item_index, 1)
                    } else {
                        set_snackbar_alert({
                            open: true,
                            message: `You can't add the same ${name}`,
                            severity: "warning",
                        });
                    }
                } else {
                    copy_array.push(!isNaN(Number(value)) ? Number(value) : value);
                }

                set_size_color(pre => ({ ...pre, [name]: "" }));

                return { ...prev, [name]: copy_array }

            });
        } else {
            set_snackbar_alert({
                open: true,
                message: `Please select the ${name}!`,
                severity: "warning",
            });
        }
    }

    // Populating Size_color and size_color_array states to update_product_details.size & update_product_details.color once user changes the size or color value. 

    // Sorting Size sequence wise before setting to update_product_details.size
    const sort_sizes = (sizes_array = []) => {
        if (!sizes_array.length) return [];

        const allNumeric = sizes_array.every(e => !isNaN(Number(e)));

        if (allNumeric) {
            // Sort numerically
            return sizes_array.sort((a, b) => Number(a) - Number(b));
        } else {
            // Sort by size order
            const sequence = ["S", "M", "L", "XL", "XXL", "XXXL"];
            return sizes_array.sort(
                (a, b) => sequence.indexOf(a.toUpperCase()) - sequence.indexOf(b.toUpperCase())
            );
        }
    };
    // resetting variants and options condition
    const reset_condition = (array) => {
        if (array.length > 1) return array
        return []
    }
    // Now the useEffect to update product_details
    useEffect(() => {
        if (Array.isArray(size_color_array.size) && size_color_array.size.length) {

            if (size_color_array.size.length > 1) {

                const { variants, options } = build_variants(sort_sizes(size_color_array.size), size_color_array.color);

                set_update_product_details((prevState) => ({
                    ...prevState,
                    size: sort_sizes(size_color_array.size),
                    variants,
                    options,
                    has_variants: true,
                }));
            } else {
                set_update_product_details((prevState) => ({
                    ...prevState,
                    size: !isNaN(Number(size_color_array.size[0])) ? Number(size_color_array.size[0]) : size_color_array.size[0],
                    variants: build_variants([], reset_condition(size_color_array.color)).variants,
                    options: build_variants([], reset_condition(size_color_array.color)).options,
                    has_variants: Boolean(build_variants([], reset_condition(size_color_array.color)).variants.length),
                }));
            }

        } else if (size_color.size) {
            set_update_product_details((prevState) => ({
                ...prevState,
                size: !isNaN(Number(size_color.size)) ? Number(size_color.size) : size_color.size,
                variants: build_variants([], reset_condition(size_color_array.color)).variants,
                options: build_variants([], reset_condition(size_color_array.color)).options,
                has_variants: Boolean(build_variants([], reset_condition(size_color_array.color)).variants.length),
            }));
        } else {
            set_update_product_details((prevState) => ({
                ...prevState,
                size: "",
                variants: build_variants([], reset_condition(size_color_array.color)).variants,
                options: build_variants([], reset_condition(size_color_array.color)).options,
                has_variants: Boolean(build_variants([], reset_condition(size_color_array.color)).variants.length),
            }));
        }


        if (Array.isArray(size_color_array.color) && size_color_array.color.length) {

            if (size_color_array.color.length > 1) {
                const { variants, options } = build_variants(sort_sizes(size_color_array.size), size_color_array.color);
                set_update_product_details((prevState) => ({
                    ...prevState,
                    color: size_color_array.color,
                    variants,
                    options,
                    has_variants: true,
                }));
            } else {
                set_update_product_details((prevState) => ({
                    ...prevState,
                    color: size_color_array.color[0],
                    variants: build_variants(reset_condition(size_color_array.size), []).variants,
                    options: build_variants(reset_condition(size_color_array.size), []).options,
                    has_variants: Boolean(build_variants(reset_condition(size_color_array.size), []).variants.length),
                }));
            }
        } else if (size_color.color) {
            set_update_product_details((prevState) => ({
                ...prevState,
                color: size_color.color,
                variants: build_variants(reset_condition(size_color_array.size), []).variants,
                options: build_variants(reset_condition(size_color_array.size), []).options,
                has_variants: Boolean(build_variants(reset_condition(size_color_array.size), []).variants.length),
            }));
        } else {
            set_update_product_details((prevState) => ({
                ...prevState,
                color: "",
                variants: build_variants(reset_condition(size_color_array.size), []).variants,
                options: build_variants(reset_condition(size_color_array.size), []).options,
                has_variants: Boolean(build_variants(reset_condition(size_color_array.size), []).variants.length),
            }));
        }

    }, [size_color.size, size_color.color, size_color_array.size.length, size_color_array.color.length]);

    // Variant field update function
    const updateVariantField = (variantId, field, value) => {
        set_update_product_details(prev => ({
            ...prev,
            variants: prev.variants.map(v =>
                v.variant_id === variantId ? { ...v, [field]: value } : v
            )
        }));
    };



    // <<<<<<<---------  ************* --------->>>>>>>




    // <================= Managing Stores Conditions: ===================>

    const [size_format, set_size_format] = useState("numeric");

    const switch_size_format = () => {
        if (size_format === "numeric") {
            set_size_format("alphabetic");
        } else if (size_format === "alphabetic") {
            set_size_format("numeric");
        }
        // Finally
        set_size_color(prev => ({ ...prev, size: "" }));
        set_size_color_array(prev => ({ ...prev, size: [] }));
        set_update_product_details(prev => ({ ...prev, size: "" }))
    };

    const prevStoreRef = useRef(update_product_details.store_name);

    const setStoreSafely = (newStoreName) => {
        set_update_product_details(prev => {
            if (["Jewelry", "Apparel"].includes(user?.store_name)) {
                return { ...prev, store_name: user.store_name };
            }

            return { ...prev, store_name: (newStoreName ?? "") };
        });
    };


    // Resetting sizes and color on page load, also setting size format and update_product_details
    useEffect(() => {
        if (user && user.store_name !== "Footwear") {
            set_update_product_details(prev => ({ ...prev, store_name: user.store_name }))
        } else if (user && user.store_name === "Footwear") {
            set_update_product_details(prev => ({ ...prev, store_name: "" }))
        }


        if (!update_product_details.size) {
            if (user && user.store_name === "Footwear") set_size_format("numeric");
            if (user && user.store_name === "Jewelry") set_size_format("numeric");
            if (user && user.store_name === "Apparel") set_size_format("alphabetic");
            set_size_color(prev => ({ ...prev, size: "" }));
            set_size_color_array(prev => ({ ...prev, size: [] }));
            set_update_product_details(prev => ({ ...prev, size: "" }));

        }

        if (!update_product_details.color) {
            set_size_color(prev => ({ ...prev, color: "" }));
            set_size_color_array(prev => ({ ...prev, color: [] }));
            set_update_product_details(prev => ({ ...prev, color: "" }));

        }


    }, [user]);


    // ================== Populate Size + Color when product fetches ==================
    useEffect(() => {
        if (!update_product_details?._id) return;

        // ===== SIZE =====
        if (update_product_details.size && size_color_array.size.length === 0 && !size_color.size) {
            const sizeValue = update_product_details.size;

            const numeric = Array.isArray(sizeValue)
                ? sizeValue.every(e => !isNaN(e))
                : !isNaN(sizeValue);

            set_size_format(numeric ? "numeric" : "alphabetic");

            if (Array.isArray(sizeValue)) {
                set_size_color_array(prev => ({ ...prev, size: sizeValue }));
            } else {
                set_size_color(prev => ({ ...prev, size: sizeValue }));
            }
        }

        // ===== COLOR =====
        if (update_product_details.color && size_color_array.color.length === 0 && !size_color.color) {
            if (Array.isArray(update_product_details.color)) {
                set_size_color_array(prev => ({ ...prev, color: update_product_details.color }));
            } else {
                set_size_color(prev => ({ ...prev, color: update_product_details.color }));
            }
        }


    }, [update_product_details?._id]);




    // Prevent unwanted reset on first fetch — only trigger when user changes store name or type manually
    useEffect(() => {
        if (!update_product_details._id) return;

        const prev = prevStoreRef.current;
        const curr = update_product_details.store_name;

        if (prev === curr) return;

        if (user?.store_name === "Footwear") {

            const sandalsGroup = ["SM-sandals", "Areeba-sandals"];
            const prevIsSandals = sandalsGroup.includes(prev);
            const currIsSandals = sandalsGroup.includes(curr);

            if (!(prevIsSandals && currIsSandals)) {
                // switching store groups → clear type
                set_update_product_details(prevState => ({
                    ...prevState,
                    type: "",
                }));
            }

            if (curr === "Footwear-accessories" || prev === "Footwear-accessories") {
                // reset size/color
                set_size_color(default_size_color);
                set_size_color_array(default_size_color_array);
                set_update_product_details(prevState => ({ ...prevState, size: "" }));
            }
        } else {
            if (["Jewelry", "Apparel"].includes(user?.store_name) &&
                curr !== user.store_name) {
                setStoreSafely(user.store_name);
            }
        }

        prevStoreRef.current = curr;
    }, [update_product_details.store_name, user?.store_name]);



    // ================= TYPE CHANGE RESET ====================

    useEffect(() => {
        if (!update_product_details?._id) return;

        if (update_product_details.type && !loadedTypeRef.current) {
            loadedTypeRef.current = true;

            set_update_product_details(prev => ({
                ...prev,
                type: update_product_details.type
            }));
        }
    }, [update_product_details._id]);


    // <==========   ***************   =============>

    // reset buton/api function
    const reset_all = () => {
        setSearchTerm("");
        set_product_id("");
        set_update_product_details(default_update_product_details);

        // Reset size/color states
        set_size_color(default_size_color);
        set_size_color_array(default_size_color_array);

        // Reset REFS (very important)
        loadedTypeRef.current = false;
        prevStoreRef.current = "";
    };

    // <========================= Updating Product Function / Submit Function ====================>

    const [error_shake, set_error_shake] = useState(false);
    // Error Sound
    const play_error_sound = () => {
        const audio = new Audio("/sounds/error.wav");
        audio.volume = 0.6;
        audio.play();
    };
    // Success Sound
    const play_success_sound = () => {
        const audio = new Audio("/sounds/success.wav");
        audio.volume = 0.6;
        audio.play();
    };

    const handle_submit = async (e) => {
        e.preventDefault();
        set_API_loading(true);

        try {

            const errors = {};
            Object.keys(update_product_details).forEach((fieldName) => {
                const error = validateField(fieldName, update_product_details[fieldName]);
                if (error) {
                    errors[fieldName] = error;
                }
            });
            set_update_product_details((prevState) => ({
                ...prevState,
                errors,
            }));


            if (Object.values(errors).every((error) => !error)) {

                //     // Form is valid, submit it
                const { errors, media, variants, ...otherData } = update_product_details;


                const formData = new FormData();

                // Fixed variants by filling missing values
                otherData.variants = fill_missing_variant_values(variants, otherData);

                // Setting is_thrifted field
                otherData.is_thrifted = otherData.condition === "brand new" ? false : true;

                // Append other data fields
                Object.keys(otherData).forEach((key) => {
                    let value = otherData[key];

                    if (key === "options" || key === "variants") {
                        value = JSON.stringify(value);
                    }

                    // Convert arrays to JSON normally
                    else if (Array.isArray(value)) {
                        value = JSON.stringify(value);
                    }

                    formData.append(key, value);
                });
                // Step 1: Filter media items that already have a BunnyCDN URL
                const unupdated_media = media.length ?
                    media.filter((item) => item.url.includes("kickskraze.b-cdn.net")) : [];

                if (unupdated_media.length) {
                    for (const file of unupdated_media) {
                        formData.append("media", JSON.stringify(file));
                    }
                }


                // Step 2: Append other data fields
                Object.keys(otherData).forEach((key) => {
                    let value = otherData[key];

                    // Convert arrays to JSON
                    if (Array.isArray(value)) {
                        value = JSON.stringify(value);
                    }

                    formData.append(key, value);
                });

                // Step 3: Process each media file
                for (const item of media) {
                    const isThumbnail = item.thumbnail ? "true" : "false";

                    if (!item.url.includes("kickskraze.b-cdn.net")) {
                        const FILE = await fetch(item.url); // Fetch the binary data
                        const file = await FILE.blob();

                        // Step 4: Handle videos and images
                        if (item.type === "video") {
                            formData.append("videos", file); // Add video file
                            formData.append("videoThumbnailFlags", isThumbnail); // Add thumbnail flag
                        } else if (item.type === "image") {
                            formData.append("images", file); // Add image file
                            formData.append("imageThumbnailFlags", isThumbnail); // Add thumbnail flag
                        }
                    }
                }


                play_success_sound();
                await update_product_api(axios, product_id, formData, set_API_loading,
                    isValidObjectId(router.query?.product_id) ? () => { } : reset_all);

                if (product_id) {
                    await get_product_api(axios, product_id, update_product_details, set_update_product_details, set_API_loading);
                }

            } else {
                // trigger shake animation every time on error
                navigator.vibrate?.([80, 40, 80]);
                play_error_sound();
                set_error_shake(true);
                setTimeout(() => set_error_shake(false), 600)
            }
        } catch (err) {
            console.error(err);
        } finally {
            set_API_loading(false);
        }
    };

    // Date Formatter
    const date_formatter = (date) => {
        // Create a Date object
        const dateObject = new Date(date);

        // Format the date and time with the Pakistan time zone
        const formattedDate = dateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            timeZone: 'Asia/Karachi'
        });

        const formattedTime = dateObject.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Karachi'
        });

        return `${formattedDate}  [${formattedTime}]`;
    };


    return (
        <div className='w-full h-full' >
            <form onSubmit={handle_submit} className="flex-[1] md:px-[40px] py-[40px] flex flex-col gap-y-6 border-stone-200 rounded-2xl md:shadow-md">

                {Boolean(product_id) ?
                    <h1 className='w-full text-[17px] lg:text-[19px] font-semibold text-stone-700 mb-[15px] flex items-center gap-4 justify-between'>
                        <div className="flex items-center gap-2">
                            <TbShoppingBagEdit className='text-[24px] lg:text-[30px]' />
                            Update Product
                        </div>
                        {Boolean(update_product_details.createdAt) &&
                            <p className="text-[15px] lg:text-[17px] font-medium text-stone-600">{date_formatter(update_product_details.createdAt)}</p>
                        }
                    </h1>
                    :
                    <h1 className='text-[17px] lg:text-[19px] font-semibold text-stone-700 mb-[15px] flex items-center gap-2'>
                        <ImageSearchIcon className='text-[24px] lg:text-[30px]' />
                        Search Product
                    </h1>

                }

                {!Boolean(product_id) &&
                    <Autocomplete
                        className="w-full"
                        options={products_title}
                        autoHighlight
                        value={products_title.find(e => e._id === product_id) || null}
                        onChange={(event, value) => set_product_id(value ? value._id : "")}
                        onInputChange={(event, newInputValue) => {
                            setSearchTerm(newInputValue); // trigger useEffect debounce
                        }}
                        getOptionLabel={(option) => option.title}
                        filterOptions={(x) => x} // Disable local filtering (important!)
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <li key={option._id} {...optionProps}>
                                    <img
                                        className="mr-4 w-[40px] h-[40px] object-cover rounded-md"
                                        src={option.url}
                                        alt=""
                                    />
                                    {option.title}
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Product"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {is_loading_local ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                }

                {Boolean(product_id) &&
                    <>


                        {/* <h1 className='text-[17px] font-medium mt-5'>Store Names List</h1> */}
                        {user?.store_name === "Footwear" &&
                            <Autocomplete
                                id="store-list"
                                className="w-full"
                                size='medium'
                                options={store_list}
                                getOptionLabel={(option) => option.title || option} // Display title in the input
                                value={update_product_details.store_name || null}
                                inputValue={update_product_details.store_name || ""}
                                onChange={(event, new_value) => {
                                    // Handle both object (from dropdown) and string (free text) cases
                                    handleChange({ target: { name: "store_name", value: new_value?.store_name || new_value } })
                                }}
                                onInputChange={(event, new_value) => {
                                    if (event) {
                                        // Capitalize the input value before updating the state
                                        handleChange({ target: { name: "store_name", value: new_value } })
                                    }
                                }}
                                renderOption={(props, option) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={option.store_name} {...optionProps}>
                                            <StoreIcon className='mr-2 text-stone-600' />
                                            <span className=''>
                                                {option.title}
                                            </span>
                                        </li>
                                    )
                                }}

                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Select Store"
                                        error={Boolean(update_product_details.errors.store_name)}
                                        helperText={update_product_details.errors.store_name}
                                    />}
                            />
                        }


                        {/* <h1 className='text-[17px] font-medium mt-5'>Types</h1> */}
                        {(user?.store_name !== "Footwear" || /Footwear-accessories|Areeba-sandals|SM-sandals/.test(update_product_details.store_name)) &&
                            <Autocomplete
                                id="type-list"
                                className="w-full"
                                size='medium'
                                options={
                                    user?.store_name === "Jewelry" ?
                                        jewelry_type_list
                                        : user?.store_name === "Apparel" ?
                                            apparel_type_list
                                            : update_product_details.store_name === "Footwear-accessories" ?
                                                footwear_accessories_type_list
                                                : /Areeba-sandals|SM-sandals/.test(update_product_details.store_name) ?
                                                    sandals_type_list
                                                    : []
                                }
                                getOptionLabel={(option) => option.title || option} // Display title in the input
                                value={update_product_details.type || null}
                                inputValue={update_product_details.type || ""}
                                onChange={(event, new_value) => {
                                    // Handle both object (from dropdown) and string (free text) cases
                                    handleChange({ target: { name: "type", value: new_value?.type || new_value } })
                                }}
                                onInputChange={(event, new_value) => {
                                    if (event) {
                                        // Capitalize the input value before updating the state
                                        handleChange({ target: { name: "type", value: new_value } })
                                    }
                                }}
                                renderOption={(props, option) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={option.type} {...optionProps}>
                                            <StoreIcon className='mr-2 text-stone-600' />
                                            <span className=''>
                                                {option.title}
                                            </span>
                                        </li>
                                    )
                                }}

                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Select Product Type"
                                        error={Boolean(update_product_details.errors.type)}
                                        helperText={update_product_details.errors.type}
                                    />}
                            />
                        }


                        <TextField
                            label="Product title"
                            variant="outlined"
                            className='w-full'
                            name="title"
                            size="medium"
                            value={update_product_details.title}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.title)}
                            helperText={update_product_details.errors.title}
                            sx={style_textfield}
                        />


                        <FormControl
                            className="w-full flex flex-col items-start"
                            error={Boolean(update_product_details.errors.media)}
                        >
                            <div className='mb-[15px] px-[20px] md:px-0'>
                                <h1 className='text-[17px] font-medium text-stone-500 mt-[15px] mb-[10px]'>
                                    Media {Boolean(update_product_details.media.length) && `(${update_product_details.media.length})`}
                                </h1>
                                <div className={`flex flex-wrap gap-2 md:gap-4 max-h-[400px] md:max-h-[620px] overflow-y-auto ${styles.scroll_bar}`} >
                                    {Boolean(update_product_details.media.length) &&
                                        update_product_details.media.map((file, index) => (
                                            <div key={index}>

                                                <div className='w-[180px] md:w-[300px] h-[180px] md:h-[300px] border px-1 pb-1 border-stone-300 rounded-md relative' >
                                                    {file.type === "video" ?
                                                        <video
                                                            src={file.url}
                                                            className='w-[180px] md:w-[300px] h-[180px] md:h-[300px] object-cover'
                                                            muted
                                                            autoPlay
                                                            loop
                                                            controls
                                                        />
                                                        :
                                                        <img
                                                            src={file.url}
                                                            className='w-[180px] md:w-[300px] h-[180px] md:h-[300px] object-contain'
                                                            alt=" "
                                                        />

                                                    }

                                                    <div className='absolute top-[4px] md:top-[10px] right-[4px] md:right-[10px] bg-[rgba(256,256,256,0.8)] rounded-full shadow-xl' >
                                                        <IconButton onClick={() => handleChange({ target: { name: "remove_image", _id: file._id } })}>
                                                            <IoClose className='text-[20px] md:text-[26px] text-stone-950' />
                                                        </IconButton>
                                                    </div>


                                                </div>

                                                {(file.type !== "video" ? ((update_product_details.media.some(e => e.thumbnail) ? update_product_details.media.find(e => e.thumbnail)._id.includes(file._id) : true)) : false) &&

                                                    <div className='flex justify-between  items-center pl-3' >
                                                        <p className='text-[15px] font-semibold text-stone-600 capitalize'>Set Thumbnail*</p>
                                                        <Switch
                                                            checked={file.thumbnail}
                                                            onChange={(e) => handleChange({ target: { name: "set_thumbnail", value: e.target.checked, _id: file._id } })}
                                                        />
                                                    </div>
                                                }

                                            </div>
                                        ))}

                                    <div className='p-1'>
                                        <input
                                            multiple
                                            id="media_input"
                                            type="file"
                                            name="media"
                                            accept="image/*, video/*"
                                            onChange={handleChange}
                                            className='hidden'
                                        />

                                        <label id="add_media" htmlFor='media_input' className='flex flex-col justify-center items-center w-[90px] md:w-[130px] h-[90px] md:h-[130px] outline-stone-300 outline-2 outline-dashed rounded bg-stone-50 md:gap-y-2 active:bg-stone-100 transition-all cursor-pointer' >
                                            <AddIcon className='text-[26px] md:text-[42px] font-medium text-stone-400' />
                                            <p className='text-stone-400 w-fit px-2 py-1 rounded-md transition-all text-[13px] md:text-[15px]'>
                                                Add media
                                            </p>
                                        </label>

                                    </div>
                                </div>
                                {Boolean(update_product_details.errors.media) && <FormHelperText>{update_product_details.errors.media}</FormHelperText>}
                            </div>
                        </FormControl>



                        {/* <h1 className='text-[17px] font-medium mt-5'>Price</h1> */}
                        <TextField
                            label="Product price"
                            variant="outlined"
                            className='w-full'
                            name="price"
                            size="medium"
                            type='number'
                            value={update_product_details.price}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.price)}
                            helperText={update_product_details.errors.price}
                            sx={style_textfield}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Cost Price</h1> */}
                        <TextField
                            label="Cost price"
                            variant="outlined"
                            className='w-full'
                            name="cost_price"
                            size="medium"
                            type='number'
                            value={update_product_details.cost_price}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.cost_price)}
                            helperText={update_product_details.errors.cost_price}
                            sx={style_textfield}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Compare Price (Optional) </h1> */}
                        <TextField
                            label="Compare price"
                            variant="outlined"
                            className='w-full'
                            name="compare_price"
                            size="medium"
                            type='number'
                            value={update_product_details.compare_price}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.compare_price)}
                            helperText={update_product_details.errors.compare_price}
                            sx={style_textfield}
                        />



                        {/* <h1 className='text-[17px] font-medium mt-5'>Size </h1> */}
                        {(update_product_details.store_name !== "Footwear-accessories" || ["socks", "insole"].includes(update_product_details.type)) &&
                            <div className='flex flex-col gap-3'>

                                <div className='flex flex-wrap gap-2' >
                                    {Boolean(size_color_array.size.length) &&
                                        sort_sizes(size_color_array.size).map((each, index) => (
                                            <button
                                                onClick={() => handle_size_color_btn({ name: "size", value: each }, "remove")}
                                                type="button"
                                                key={index}
                                                className='flex items-center justify-center pl-[10px] pr-[6px] py-[4px] bg-stone-100 text-stone-600 rounded hover:bg-stone-500 hover:text-white active:opacity-65 transition-all duration-300 gap-1'
                                            >
                                                {each}
                                                <IoClose />
                                            </button>
                                        ))
                                    }
                                </div>

                                <div className='flex gap-3 md:gap-4 items-center' >
                                    {size_format === "numeric" ?
                                        <TextField
                                            label="Size (Numeric)"
                                            variant="outlined"
                                            className='w-full'
                                            name="size"
                                            size="medium"
                                            type='number'
                                            value={size_color.size}
                                            onChange={handle_size_color_change}
                                            error={Boolean(update_product_details.errors.size)}
                                            helperText={update_product_details.errors.size}
                                            sx={style_textfield}
                                        />
                                        :
                                        <Autocomplete
                                            id="size-list"
                                            className="w-full"
                                            size='medium'
                                            options={size_list}
                                            getOptionLabel={(option) => option.title || option} // Display title in the input
                                            value={size_color.size || null}
                                            inputValue={size_color.size || ""}
                                            onChange={(event, new_value) => {
                                                // Handle both object (from dropdown) and string (free text) cases
                                                handle_size_color_change({ target: { name: "size", value: new_value?.size || new_value } })
                                            }}
                                            onInputChange={(event, new_value) => {
                                                if (event) {
                                                    // Capitalize the input value before updating the state
                                                    handle_size_color_change({ target: { name: "size", value: new_value } })
                                                }
                                            }}
                                            renderOption={(props, option) => {
                                                const { key, ...optionProps } = props;
                                                return (
                                                    <li key={option.size} {...optionProps}>
                                                        <GiClothes className='mr-2 text-stone-600 text-[21px]' />
                                                        <span className='capitalize'>
                                                            {option.title}
                                                        </span>
                                                    </li>
                                                )
                                            }}

                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    label="Size (Alphabetic)"
                                                    error={Boolean(update_product_details.errors.size)}
                                                    helperText={update_product_details.errors.size}
                                                />}
                                        />
                                    }

                                    <button
                                        type="button"
                                        onClick={() => handle_size_color_btn({ name: "size", value: size_color.size })}
                                        className='bg-blue-500 text-white  whitespace-nowrap px-2 md:px-4 py-2 rounded-md hover:opacity-90 active:opacity-60 transition-all select-none text-[13px] md:text-[16px]' >
                                        Add more
                                    </button>
                                </div>

                                <div className='flex items-center w-full  justify-end'>
                                    <p className='text-[13px] md:text-[14px] text-stone-500 px-2' >{`Switch to ${size_format === "numeric" ? "alphabetic" : "numeric"} size format`}</p>
                                    <Switch
                                        checked={size_format === "numeric"}
                                        onChange={switch_size_format}
                                    // size='small'
                                    />
                                </div>
                            </div>
                        }


                        {/* <h1 className='text-[17px] font-medium mt-5'>Colors</h1> */}
                        {(user?.store_name !== "Footwear" || update_product_details.store_name === "Footwear-accessories") &&
                            <div className='flex flex-col gap-3'>

                                <div className='flex flex-wrap gap-2' >
                                    {Boolean(size_color_array.color.length) &&
                                        sort_sizes(size_color_array.color).map((each, index) => (
                                            <button
                                                onClick={() => handle_size_color_btn({ name: "color", value: each }, "remove")}
                                                type="button"
                                                key={index}
                                                className='flex items-center justify-center pl-[10px] pr-[6px] py-[4px] bg-stone-100 text-stone-600 rounded hover:bg-stone-500 hover:text-white active:opacity-65 transition-all duration-300 gap-1'
                                            >
                                                {each}
                                                <IoClose />
                                            </button>
                                        ))
                                    }
                                </div>

                                <div className='flex gap-3 md:gap-4 items-center' >


                                    <Autocomplete
                                        id="colors-list"
                                        className="w-full"
                                        size='medium'
                                        freeSolo
                                        options={color_list}
                                        getOptionLabel={(option) => option.color || option} // Display title in the input
                                        value={size_color.color || null}
                                        inputValue={size_color.color || ""}
                                        onChange={(event, new_value) => {
                                            // Handle both object (from dropdown) and string (free text) cases
                                            handle_size_color_change({ target: { name: "color", value: new_value?.color || new_value } })
                                        }}
                                        onInputChange={(event, new_value) => {
                                            if (event) {
                                                // Capitalize the input value before updating the state
                                                handle_size_color_change({ target: { name: "color", value: new_value } })
                                            }
                                        }}
                                        renderOption={(props, option) => {
                                            const { key, ...optionProps } = props;
                                            return (
                                                <li key={option.color} {...optionProps}>
                                                    <div className={`mr-2 md:mr-3 p-3 md:p-4 ${option.bg} rounded-full shadow-lg`} />
                                                    <span className='capitalize'>
                                                        {option.color}
                                                    </span>
                                                </li>
                                            )
                                        }}

                                        renderInput={(params) =>
                                            <TextField {...params}
                                                label="Select Color"
                                                error={Boolean(update_product_details.errors.color)}
                                                helperText={update_product_details.errors.color}
                                            />}
                                    />


                                    <button
                                        type="button"
                                        onClick={() => handle_size_color_btn({ name: "color", value: size_color.color })}
                                        className='bg-blue-500 text-white  whitespace-nowrap px-2 md:px-4 py-2 rounded-md hover:opacity-90 active:opacity-60 transition-all select-none text-[13px] md:text-[16px]' >
                                        Add more
                                    </button>
                                </div>
                            </div>
                        }

                        {/* <h1 className='text-[17px] font-medium mt-5'>Variants</h1> */}
                        {Boolean(update_product_details.variants.length > 0) &&
                            <div className="overflow-x-auto mb-6">
                                <table className="min-w-full border-collapse rounded-md">
                                    <thead>
                                        <tr className="bg-gray-100 rounded-md">
                                            <th className="px-3 py-2 w-1/2 text-left text-[14px] md:text-[16px] font-semibold truncate text-stone-600">
                                                Variant ({update_product_details.variants.length})
                                            </th>
                                            <th className="px-3 py-2 w-1/3 text-left text-[14px] md:text-[16px] font-semibold truncate text-stone-600">
                                                Price
                                            </th>
                                            <th className="px-3 py-2 w-1/4 text-left text-[14px] md:text-[16px] font-semibold truncate text-stone-600">
                                                Stock
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {update_product_details.variants.map((variant, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="px-3 py-2  text-[15px] md:text-[17px] truncate text-stone-700">
                                                    {[variant.options.size, variant.options.color].filter(Boolean).join(" / ")}
                                                </td>

                                                <td className="px-3 py-2 text-[15px] md:text-[17px] truncate text-stone-700">
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => updateVariantField(variant.variant_id, "price", e.target.value)}
                                                        className="w-full bg-gray-50 border rounded px-2 py-1 text-md outline-none"
                                                    />
                                                </td>

                                                <td className="px-3 py-2 text-[15px] md:text-[17px] truncate text-stone-700">
                                                    <input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) => updateVariantField(variant.variant_id, "stock", e.target.value)}
                                                        className="w-full bg-gray-50 border rounded px-2 py-1 text-md outline-none"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }


                        {/* <h1 className='text-[17px] font-medium mt-5'>Brands</h1> */}
                        <Autocomplete
                            id="section-list"
                            className="w-full"
                            size='medium'
                            freeSolo
                            options={fetched_brand_list}
                            getOptionLabel={(option) => option.brand || option} // Display title in the input
                            value={update_product_details.brand || null}
                            inputValue={update_product_details.brand || ""}
                            onChange={(event, new_value) => {
                                // Handle both object (from dropdown) and string (free text) cases
                                set_update_product_details(prev_state => ({
                                    ...prev_state,
                                    brand: new_value?.brand || capitalizeWords(new_value) || ""
                                }));
                            }}
                            onInputChange={(event, new_value) => {
                                if (event) {
                                    // Capitalize the input value before updating the state
                                    set_update_product_details(prev_state => ({
                                        ...prev_state,
                                        brand: capitalizeWords(new_value) || ""
                                    }));
                                }
                            }}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={option._id} {...optionProps}>
                                        < GiConverseShoe className='mr-4 text-[22px]' />
                                        <span className='capitalize'>
                                            {option.brand}
                                        </span>
                                    </li>
                                )
                            }}

                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Select Brand"
                                    error={Boolean(update_product_details.errors.brand)}
                                    helperText={update_product_details.errors.brand}
                                />}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Condition</h1> */}
                        <Autocomplete
                            className="w-full"
                            size='medium'
                            options={condition_list}
                            getOptionLabel={(option) => option.condition} // Display title in the input
                            value={condition_list.find((option) => option.condition === update_product_details.condition) || null}
                            onChange={(event, new_value) => {
                                set_update_product_details(prev_state => ({ ...prev_state, condition: new_value?.condition || "" })); // Handle cases where new_value is null
                            }}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={option._id} {...optionProps}>
                                        {option.icon}
                                        <span className='capitalize'>
                                            {option.condition}
                                        </span>
                                    </li>
                                )
                            }}

                            renderInput={(params) => <TextField
                                {...params}
                                error={Boolean(update_product_details.errors.condition)}
                                helperText={update_product_details.errors.condition}
                                label="Select Condition"
                            />}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Category</h1> */}
                        <Autocomplete
                            className="w-full"
                            size='medium'
                            options={category_list}
                            getOptionLabel={(option) => option.category} // Display title in the input
                            value={category_list.find((option) => option.category === update_product_details.category) || null}
                            onChange={(event, new_value) => {
                                set_update_product_details(prev_state => ({ ...prev_state, category: new_value?.category || "" })); // Handle cases where new_value is null
                            }}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li className='capitalize' key={option._id} {...optionProps}>
                                        {option.icon}
                                        <span className='capitalize'>
                                            {option.category}
                                        </span>
                                    </li>
                                )
                            }}

                            renderInput={(params) => <TextField
                                error={Boolean(update_product_details.errors.category)}
                                helperText={update_product_details.errors.category}
                                {...params}
                                label="Select Category"
                            />}
                        />



                        {/* <h1 className='text-[17px] font-medium mt-5'>Stock Quantity</h1> */}
                        <TextField
                            label="Stock Quantiy"
                            variant="outlined"
                            className='w-full'
                            name="stock"
                            size="medium"
                            type='number'
                            value={update_product_details.stock}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.stock)}
                            helperText={update_product_details.errors.stock}
                            sx={style_textfield}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Size Description</h1> */}
                        <TextField
                            label="Size Description"
                            variant="outlined"
                            className='w-full'
                            name="size_desc"
                            size="medium"
                            value={update_product_details.size_desc}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.size_desc)}
                            helperText={update_product_details.errors.size_desc}
                            sx={style_textfield}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Product Description</h1> */}
                        <TextField
                            label="Product Description"
                            variant="outlined"
                            className='w-full'
                            name="shoes_desc"
                            size="medium"
                            value={update_product_details.shoes_desc}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.shoes_desc)}
                            helperText={update_product_details.errors.shoes_desc}
                            sx={style_textfield}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Featured Product</h1> */}
                        <TextField
                            value={"Feature Product"}
                            variant="outlined"
                            className='w-full'
                            sx={style_textfield_2}
                            inputProps={{
                                readOnly: true, // Read-only input
                                style: { cursor: "default" }, // Ensure pointer style is applied to the input element
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className='text-stone-800'>
                                        <Switch
                                            checked={update_product_details.featured}
                                            onChange={(e) =>
                                                handleChange({
                                                    target: { name: "featured", value: e.target.checked },
                                                })
                                            }
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />


                        {/* Buttons */}
                        <div className="w-full flex justify-between items-center my-[30px]">
                            <button
                                onClick={() => { toggle_modal("delete_product_modal") }}
                                type='button'
                                className='w-fit px-[12px] lg:px-[28px] py-[6px] lg:py-[8px] bg-rose-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[14px]'>
                                DELETE
                            </button>


                            <div className="flex gap-4 items-center my-[30px]">
                                {isValidObjectId(router.query?.product_id) ?
                                    <button onClick={() => { router.push("/admin/update-product"); reset_all() }} type='button' className='w-fit px-[12px] lg:px-[28px] py-[6px] lg:py-[8px] bg-stone-200 text-stone-700 hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[14px]'>
                                        CANCEL
                                    </button>
                                    :
                                    <button onClick={reset_all} type='button' className='w-fit px-[12px] lg:px-[28px] py-[6px] lg:py-[8px] bg-stone-200 text-stone-700 hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[14px]'>
                                        CANCEL
                                    </button>
                                }

                                <button
                                    type='submit'
                                    className={`w-fit px-[12px] lg:px-[28px] py-[6px] lg:py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[14px] ${error_shake ? styles.error_shake : ""}`}
                                >
                                    UPDATE
                                </button>
                            </div>
                        </div>
                    </>

                }


            </form>
        </div>

    )
}

export default Update_product