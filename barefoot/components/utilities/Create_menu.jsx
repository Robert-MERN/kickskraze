import React from 'react'
import Image from 'next/image';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import {
    handle_change_options,
    edit_option, add_option,
    delete_option_values,
    delete_option,
    save_option
} from '@/utils/functions/multiple_options_logic';



const Create_menu = ({ data, set_data, section, change_section, helper_index, set_helper_index, handle_submit }) => {
    return (
        <>
            {/* Inputs for Section */}
            <div className='w-full shadow-md px-[15px] pb-[30px] py-[10px] flex flex-col gap-6 rounded-md tracking-wider'>
                <h1 className='text-[18px] md:text-[20px] font-bold text-stone-700 pl-1 mb-3 tracking-wider' >SECTION*</h1>

                <div className='w-full flex flex-col sm:flex-row items-center justify-center sm:gap-0 select-none' >
                    <button
                        onClick={() => change_section(set_data, "use-existing")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-t-lg sm:rounded-t-none sm:rounded-tl-lg sm:rounded-bl-lg border uppercase ${section === "use-existing" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Use Existing Section
                    </button>

                    <button
                        onClick={() => change_section(set_data, "create-new")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-b-lg sm:rounded-b-none sm:rounded-tr-lg sm:rounded-br-lg border uppercase ${section === "create-new" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Create New Section
                    </button>
                </div>

                {section === "use-existing" ?

                    <div className='w-full' >
                        <FormControl
                            className='w-full'
                            error={Boolean(data.errors.section_title)}
                        >
                            <InputLabel id="demo-simple-select-label">Select Section</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Section"
                                name='section_title'
                                value={data.section_title}
                                onChange={(e) => handle_change_options(e, set_data)}

                            >
                                <MenuItem value={"Pizza Dhamaka Deals"}>PIZZA DHAMAKA DEALS</MenuItem>
                                <MenuItem value={"Fish Season"}>FISH SEASON</MenuItem>
                                <MenuItem value={"Broast"}>Broast</MenuItem>
                            </Select>
                            {Boolean(data.errors.section_title) && <FormHelperText>{data.errors.section_title}</FormHelperText>}
                        </FormControl >
                    </div>
                    :
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



                        <FormControl
                            className="w-full flex flex-col items-start gap-4"
                            error={Boolean(data.errors.banner_image)}
                        >
                            {data.banner_image &&
                                <div className='w-full flex justify-center'>
                                    <Image width={200} height={200} objectFit='contain' src={data.banner_image} alt='Banner Image' />
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
                            {Boolean(data.errors.banner_image) && <FormHelperText>{data.errors.banner_image}</FormHelperText>}
                        </FormControl>

                    </>
                }
                {/* End */}

            </div>



            {/* Inputs for Menu */}
            <div className='w-full mt-[30px] shadow-md px-[15px] pb-[30px] pt-[10px] flex flex-col gap-6 rounded-md'>

                <h1 className='text-[18px] md:text-[20px] font-bold text-stone-700 pl-1 mb-3' >MENU*</h1>

                <FormControl
                    className="w-full flex flex-col items-start gap-4"
                    error={Boolean(data.errors.menu_image)}
                >
                    {data.menu_image &&
                        <div className='w-full flex justify-center'>

                            <Image width={200} objectFit='contain' height={200} src={data.menu_image} alt='Menu Image' />
                        </div>
                    }
                    <input
                        name="menu_image"
                        id="menu_image_input"
                        className='hidden'
                        accept='.jpg, .jpeg, .png, .svg, .ico, .webp'
                        type="file"
                        onChange={e => handle_change_options(e, set_data)}
                    />

                    <label
                        htmlFor="menu_image_input"
                        className='w-full py-[10px] bg-indigo-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-center cursor-pointer select-none uppercase'>
                        Select Menu Image
                    </label>
                    {Boolean(data.errors.menu_image) && <FormHelperText>{data.errors.menu_image}</FormHelperText>}
                </FormControl>

                <div className="w-full">
                    <TextField
                        className='w-full'
                        placeholder='Enter menu title'
                        id="outlined-basic"
                        label="Menu Title"
                        variant="outlined"
                        name="menu_title"
                        value={data.menu_title}
                        onChange={(e) => handle_change_options(e, set_data)}
                        error={Boolean(data.errors.menu_title)}
                        helperText={data.errors.menu_title}
                    />
                </div>

                <div className="w-full">
                    <TextField
                        className='w-full'
                        placeholder='Enter Price'
                        id="outlined-basic"
                        label="Price"
                        variant="outlined"
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={(e) => handle_change_options(e, set_data)}
                        error={Boolean(data.errors.price)}
                        helperText={data.errors.price}
                    />
                </div>

                <div className="w-full">
                    <TextField
                        className='w-full'
                        placeholder='Enter Compare Price'
                        id="outlined-basic"
                        label="Compare Price"
                        variant="outlined"
                        type='number'
                        name="compare_price"
                        value={data.compare_price}
                        onChange={(e) => handle_change_options(e, set_data)}
                        error={Boolean(data.errors.compare_price)}
                        helperText={data.errors.compare_price}
                    />
                </div>

                <div className="w-full">
                    <TextField
                        className='w-full'
                        placeholder='Enter Description'
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={data.description}
                        onChange={(e) => handle_change_options(e, set_data)}
                        error={Boolean(data.errors.description)}
                        helperText={data.errors.description}
                    />
                </div>
                {/* End */}
            </div>

            {/* Options and Variants */}

            < div className='w-full mb-[30px] border-y shadow-md flex flex-col gap-4 rounded-md'>


                {/* Multiple Options */}
                {Boolean(data.options.length) && data.options.map((option, index) => (
                    <div key={index}>
                        {option.is_added ?
                            <div className={`w-full px-[20px] pt-[20px] pb-[10px] flex justify-between items-center ${index > 0 ? "border-t-2 border-stone-300" : ""}`}>

                                <div className='flex flex-col gap-2'>
                                    <h1 className='text-[18px] font-bold pl-2 capitalize'>{option.option_name}</h1>
                                    <div className='flex flex-wrap w-full gap-2' >
                                        {option.values.map((e, index) => (
                                            <Chip
                                                key={index}
                                                label={e.option_value}
                                                className='capitalize'
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => edit_option(set_data, index, set_helper_index)}
                                    className='px-[14px] py-[4px] border-2 border-stone-300 rounded-md font-bold active:bg-stone-200 hover:bg-stone-100 transition-all'
                                >
                                    Edit
                                </button>

                            </div>
                            :
                            <div className={`w-full flex flex-col gap-4 px-[20px] pt-[30px] pb-[10px] ${index > 0 ? "border-t-2 border-stone-300" : ""}`}>
                                <p className='text-[15px] text-stone-400  leading-[18px]'>After making the option(s), click on the "DONE" button before you save this Menu otherwise the option will not be saved.</p>

                                <p className='text-[15px] text-stone-400  leading-[18px]'>Even when you're editng option, click on the "DONE" button after you make changes, otherwise hitting "SAVE" button directly will remove that option.</p>

                                <div className="w-full flex gap-2">
                                    <TextField
                                        className='w-full'
                                        placeholder='Enter Option Name'
                                        id="outlined-basic"
                                        label="Option Name"
                                        variant="outlined"
                                        name="option_name"
                                        value={option.option_name}
                                        onChange={(e) => handle_change_options(e, set_data, index)}
                                        error={Boolean(option.option_error)}
                                        helperText={option.option_error}
                                    />
                                </div>


                                {/* Array of Options */}
                                {option.values.map((each, index_2) => (

                                    <div key={index_2} className='w-full' >
                                        <div className="w-full flex gap-2 items-center">
                                            <div className='w-full flex gap-2' >

                                                <TextField
                                                    className='w-full'
                                                    placeholder='Enter Option Value'
                                                    id="outlined-basic"
                                                    label="Option Value"
                                                    variant="outlined"
                                                    name="option_value"
                                                    value={each.option_value}
                                                    onChange={(e) => handle_change_options(e, set_data, index, index_2)}
                                                    error={Boolean(each.values_error)}
                                                    helperText={each.values_error}
                                                />
                                                <TextField
                                                    className='w-fit'
                                                    type="number"
                                                    placeholder='00'
                                                    id="outlined-basic"
                                                    label="Price"
                                                    variant="outlined"
                                                    name="option_price"
                                                    value={each.option_price}
                                                    onChange={(e) => handle_change_options(e, set_data, index, index_2)}
                                                />
                                            </div>
                                            {Boolean(each.option_value) &&

                                                <IconButton
                                                    onClick={() => delete_option_values(set_data, index, index_2)}
                                                >
                                                    <DeleteOutlineIcon />
                                                </IconButton>

                                            }
                                        </div>
                                    </div>
                                ))}

                                <div className='flex items-center justify-between mt-4'>

                                    <button
                                        onClick={() => delete_option(set_data, index, set_helper_index)}
                                        className='w-fit px-[16px] py-[6px] bg-red-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded'
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => save_option(set_data, index, set_helper_index)}
                                        className='w-fit px-[18px] py-[6px] bg-white border border-stone-300 text-black active:opacity-50 transition-all text-nowrap rounded hover:bg-stone-500 hover:text-white'
                                    >
                                        Done
                                    </button>
                                </div>

                            </div>
                        }
                    </div>
                ))}

                {/* Add Multiple Options Button */}
                <div className={`w-full p-[20px]  ${Boolean(data.options.length) ? "border-t-2 border-stone-300" : ""}`}>
                    <button
                        onClick={() => add_option(set_data, ((helper_index !== "") ? helper_index : -1), set_helper_index)}
                        className='w-full text-blue-500 hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-start font-bold flex items-center gap-2'
                    >
                        {Boolean(data.options.length) ?
                            <>
                                <AddIcon />
                                Add another option
                            </>
                            :
                            <>
                                <AddIcon />
                                Add options
                            </>
                        }
                    </button>
                </div>

            </div>



            <div onClick={() => handle_submit(set_data)} className="w-full flex justify-end mb-[30px]">
                <button className='w-full lg:w-fit lg:px-[28px] py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded tracking-wider'>
                    SAVE
                </button>
            </div>

        </>
    )
}

export default Create_menu