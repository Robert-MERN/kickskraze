import React, { useEffect } from 'react';
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
import { brand_list, category_list, condition_list } from '@/utils/shoes_info_list';
import { TbShoppingBagEdit } from "react-icons/tb";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { GiConverseShoe } from "react-icons/gi";
import { useRouter } from 'next/router';
import mongoose from 'mongoose';
import { capitalizeWords } from '@/utils/functions/produc_fn';
import StoreIcon from '@mui/icons-material/Store';



const Create_product = ({ axios }) => {



    const { update_product_api, product_id, set_product_id, update_product_details, set_update_product_details, default_update_product_details, set_API_loading, API_loading, toggle_modal, get_all_products_title_api, get_product_api, products_title, set_products_title } = useStateContext();

    const router = useRouter();


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
        } else {
            get_all_products_title_api(axios, set_products_title, set_API_loading);
        }
    }, [router.isReady, router.query]);



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



    const reset_all = () => {
        set_product_id("");
        set_update_product_details(default_update_product_details);
    }


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
                if (!value) {
                    error = 'Please enter the shoes size';
                }
                break;
            case 'brand':
                if (!value) {
                    error = 'Please select the shoes brand';
                }
                break;
            case 'condition':
                if (!value) {
                    error = 'Please select the shoes condition';
                }
                break;
            case 'category':
                if (!value) {
                    error = 'Please select the shoes category';
                }
                break;
            case 'stock':
                if (value < 0) {
                    error = 'Please enter the shoes stock quantity atleast greater than -1';
                }
                break;
            // case 'size_desc':
            //     if (!value) {
            //         error = 'Please enter the shoes size description';
            //     }
            //     break;
            // case 'shoes_desc':
            //     if (!value) {
            //         error = 'Please enter the shoes description';
            //     }
            //     break;
            case 'store_name':
                if (!value) {
                    error = 'Please enter the store name';
                }
                break;
            case 'media':
                if (!value.length) {
                    error = 'Please add the shoes media';
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
                const { errors, media, ...otherData } = update_product_details;


                const formData = new FormData();

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
                    formData.append(key, otherData[key]);
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



                await update_product_api(axios, product_id, formData, set_API_loading,
                    isValidObjectId(router.query?.product_id) ? () => { } : reset_all);

                if (product_id) {
                    await get_product_api(axios, product_id, update_product_details, set_update_product_details, set_API_loading);
                }

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
                        {Boolean(update_product_details.createdAt)&&
                            <p className="text-[15px] lg:text-[17px] font-medium text-stone-600">{date_formatter(update_product_details.createdAt)}</p>
                        }
                    </h1>
                    :
                    <h1 className='text-[17px] lg:text-[19px] font-semibold text-stone-700 mb-[15px] flex items-center gap-2'>
                        <ImageSearchIcon className='text-[24px] lg:text-[30px]' />
                        Search Product
                    </h1>

                }

                {(Boolean(products_title.length) && !product_id) ?
                    <Autocomplete
                        className='w-full'
                        options={products_title}
                        autoHighlight
                        value={products_title.find(e => e._id === product_id) || null}
                        onChange={(event, value) => set_product_id(value ? value._id : "")}
                        filterOptions={(options, { inputValue }) => {
                            return options.filter(option =>
                                option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                                option._id.toLowerCase().includes(inputValue.toLowerCase()) // Search by ID
                            );
                        }}
                        getOptionLabel={(option) => option.title}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <li
                                    className=''
                                    key={option._id}
                                    {...optionProps}
                                >
                                    <img
                                        className='mr-4 w-[40px] h-[40px] object-cover rounded-md'
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
                                slotProps={{
                                    htmlInput: {
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    },
                                }}
                            />
                        )}
                    />
                    :
                    <>
                        {Boolean(product_id) ?
                            <></>
                            :
                            <h1 className='text-[16px] lg:text-[19px]  font-medium text-stone-700 mt-[15px] mb-[10px] text-center'>No Product(s)</h1>
                        }
                    </>

                }

                {Boolean(product_id) &&
                    <>

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
                        <TextField
                            label="Size"
                            variant="outlined"
                            className='w-full'
                            name="size"
                            size="medium"
                            type='number'
                            value={update_product_details.size}
                            onChange={handleChange}
                            error={Boolean(update_product_details.errors.size)}
                            helperText={update_product_details.errors.size}
                            sx={style_textfield}
                        />


                        {/* <h1 className='text-[17px] font-medium mt-5'>Brands</h1> */}
                        <Autocomplete
                            id="section-list"
                            className="w-full"
                            size='medium'
                            freeSolo
                            options={brand_list}
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


                        <TextField
                            label="Shoes Description"
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


                        <FormControl
                            className='w-full'
                            variant="outlined"

                            error={Boolean(update_product_details.errors.store_name)}
                            sx={style_textfield}
                        >
                            <InputLabel>Store Name</InputLabel>
                            <Select
                                name="store_name"
                                label="Store Name"
                                onChange={handleChange}
                                value={update_product_details.store_name}
                                renderValue={selected => selected}
                            >
                                <MenuItem value="Barefoot">
                                    <StoreIcon className='mr-2 text-stone-600' />
                                    <p>Barefoot</p>
                                </MenuItem>
                                <MenuItem value="Kickskraze">
                                    <StoreIcon className='mr-2 text-stone-600' />
                                    <p>Kickskraze</p>
                                </MenuItem>
                            </Select>
                            {Boolean(update_product_details.errors.store_name) && <FormHelperText>{update_product_details.errors.store_name}</FormHelperText>}
                        </FormControl>



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

                                <button type='submit' className='w-fit px-[12px] lg:px-[28px] py-[6px] lg:py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px] lg:text-[14px]'>
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

export default Create_product