import React, { useState } from 'react'
import Image from 'next/image';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { handle_change_options } from '@/utils/functions/multiple_options_logic';
import IconButton from '@mui/material/IconButton';
import { IoClose } from "react-icons/io5";


const Update_section = ({ data, set_data, default_data, set_snackbar_alert }) => {


    // Section Title Static
    const [section_id, set_section_id] = useState("");

    // Section Change function
    const [section, set_section] = useState("update-section");

    const handle_change_section = (set_options, arg) => {
        set_section_id("");
        set_options(default_data)
        set_section(arg);
    };




    // Handle Submit
    const validate_form = (field_name, val) => {
        let error = '';
        switch (field_name) {
            case "section_title":
                if (!val) {
                    error = "Please enter section title."
                };
                break;
            default:
                break;
        }

        return error;
    }

    const handle_submit = (set_options) => {
        set_options(prev_options => {
            const copy_options = [...prev_options.options];
            if (copy_options.length) {
                for (let i = 0; i < copy_options.length; i++) {
                    if (!copy_options.at(i).is_added) {
                        copy_options.splice(i, 1);
                    }
                }
            }
            return { ...prev_options, options: copy_options };
        });

        const errors = {};
        Object.keys(data).forEach((field_name) => {
            const error = validate_form(field_name, data[field_name]);
            if (error) {
                errors[field_name] = error;
            }
        });

        set_options((prev_options) => ({
            ...prev_options,
            errors,
        }));

        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            const { section_title, banner_image } = data;

            // handle_api(section_title, {section_title, banner_image});


            if (section === "create-section") {
                set_snackbar_alert({
                    open: true,
                    message: "Section has successfully been created!",
                    severity: "success"
                })

            } else if (section === "update-section") {
                set_snackbar_alert({
                    open: true,
                    message: "Section has successfully been updated!",
                    severity: "success"
                })
            }
            set_options(default_data);
        }
    }

    return (
        <>
            {/* Page Heading */}
            <div className='w-full'>
                <h1 className='text-[15px] md:text-[17px] text-slate-500 mb-3 tracking-wider uppercase' >
                    Create/Update Section
                </h1>
            </div>


            {/* Inputs for Section */}
            <div className='w-full shadow-md px-[15px] pb-[30px] py-[10px] flex flex-col gap-6 rounded-md tracking-wider'>
                <h1 className='text-[18px] md:text-[20px] font-bold text-stone-700 pl-1 mb-3 tracking-wider' >MANAGE SECTION*</h1>

                <div className='w-full flex flex-col sm:flex-row items-center justify-center sm:gap-0 select-none' >
                    <button
                        onClick={() => handle_change_section(set_data, "update-section")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-t-lg sm:rounded-t-none sm:rounded-tl-lg sm:rounded-bl-lg border uppercase ${section === "update-section" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Update Section
                    </button>

                    <button
                        onClick={() => handle_change_section(set_data, "create-section")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-b-lg sm:rounded-b-none sm:rounded-tr-lg sm:rounded-br-lg border uppercase ${section === "create-section" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Create New Section
                    </button>
                </div>

                {section === "update-section" ?

                    <>
                        <div className='w-full' >
                            <FormControl
                                className='w-full'
                            >
                                <InputLabel id="demo-simple-select-label">Select Section</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Section"
                                    name='section_title'
                                    value={section_id}
                                    onChange={(e) => set_section_id(e.target.value)}

                                >
                                    <MenuItem value={"Pizza Dhamaka Deals"}>PIZZA DHAMAKA DEALS</MenuItem>
                                    <MenuItem value={"Fish Season"}>FISH SEASON</MenuItem>
                                    <MenuItem value={"Broast"}>Broast</MenuItem>
                                </Select>
                            </FormControl >
                        </div>


                        {section_id &&
                            <>
                                <div className='w-full'>
                                    <TextField
                                        className='w-full'
                                        placeholder='Enter section title'
                                        id="outlined-basic"
                                        label="Section Title"
                                        variant="outlined"
                                        name="section_title"
                                        value={data.section_title}
                                        onChange={(e) => handle_change_options(e, set_data)}
                                        error={Boolean(data.errors.section_title)}
                                        helperText={data.errors.section_title}
                                    />
                                </div>


                                <form>
                                    <FormControl
                                        className="w-full flex flex-col items-start gap-4"
                                    >
                                        {data.banner_image &&
                                            <div className='w-full flex justify-center items-center gap-4'>
                                                <Image width={200} height={200} objectFit='contain' src={data.banner_image} alt='Banner Image' />

                                                <IconButton
                                                    type='reset'
                                                    color='error'
                                                    onClick={e => handle_change_options(
                                                        { target: { name: "banner_image", files: [""] } },
                                                        set_data
                                                    )}
                                                >
                                                    <IoClose className='text-red-600' />
                                                </IconButton>
                                            </div>

                                        }
                                        <input
                                            name="banner_image"
                                            id="banner_image_input"
                                            className='hidden'
                                            accept='.jpg, .jpeg, .png, .svg, .ico, .webp'
                                            type="file"
                                            onChange={e => handle_change_options(e, set_data)}
                                        />

                                        <label
                                            htmlFor="banner_image_input"
                                            className='w-full py-[10px] bg-indigo-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-center cursor-pointer select-none uppercase'>
                                            Select Banner Image
                                        </label>
                                    </FormControl>
                                </form>

                            </>
                        }
                    </>
                    : section === "create-section" ?
                        <>
                            <div className='w-full'>
                                <TextField
                                    className='w-full'
                                    placeholder='Enter section title'
                                    id="outlined-basic"
                                    label="Section Title"
                                    variant="outlined"
                                    name="section_title"
                                    value={data.section_title}
                                    onChange={(e) => handle_change_options(e, set_data)}
                                    error={Boolean(data.errors.section_title)}
                                    helperText={data.errors.section_title}
                                />
                            </div>


                            <form>
                                <FormControl
                                    className="w-full flex flex-col items-start gap-4"
                                >
                                    {data.banner_image &&
                                        <div className='w-full flex justify-center items-center gap-4'>
                                            <Image width={200} height={200} objectFit='contain' src={data.banner_image} alt='Banner Image' />

                                            <IconButton
                                                type='reset'
                                                color='error'
                                                onClick={e => handle_change_options(
                                                    { target: { name: "banner_image", files: [""] } },
                                                    set_data
                                                )}
                                            >
                                                <IoClose className='text-red-600' />
                                            </IconButton>
                                        </div>

                                    }
                                    <input
                                        name="banner_image"
                                        id="banner_image_input"
                                        className='hidden'
                                        accept='.jpg, .jpeg, .png, .svg, .ico, .webp'
                                        type="file"
                                        onChange={e => handle_change_options(e, set_data)}
                                    />

                                    <label
                                        htmlFor="banner_image_input"
                                        className='w-full py-[10px] bg-indigo-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-center cursor-pointer select-none uppercase'>
                                        Select Banner Image
                                    </label>
                                </FormControl>
                            </form>

                        </>
                        :
                        <></>
                }
                {/* End */}

            </div>








            <div className={`w-full flex mb-[30px] ${section === "update-section" && section_id ? "justify-between" : "justify-end"}`}>
                {(section === "update-section" && section_id) &&

                    <button className='px-[28px] py-[8px] bg-red-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded tracking-wider'>
                        DELETE
                    </button>
                }
                {((section === "update-section" && section_id) || section === "create-section") &&

                    <button onClick={() => handle_submit(set_data)} className='px-[28px] py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded tracking-wider'>
                        {section === "update-section" ? "UPDATE" : "SAVE"}
                    </button>
                }
            </div>

        </>
    )
}


export default Update_section