import React from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';



const Delete_product_modal = ({
    axios,
    modals_state,
    toggle_modal,
    product_id,
    set_product_id,
    delete_product_api,
    default_update_product_details,
    set_update_product_details,
    set_products_title,
    set_API_loading,
    get_all_products_title_api,
}) => {

    const handle_delete_menu = () => {

        const reset_all = () => {
            set_product_id("");
            set_update_product_details(default_update_product_details)
        }



        delete_product_api(
            axios,
            product_id,
            set_API_loading,
            reset_all,
            () => toggle_modal("delete_product_modal"),
            ()=> get_all_products_title_api(axios, set_products_title, set_API_loading),
        );
    };

    return (
        <Dialog
            open={modals_state.delete_product_modal}
            onClose={() => toggle_modal("delete_product_modal")}
        >
            <div className='w-full md:w-[500px]' >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50' >
                    <p className='text-[15px] md:text-[18px] font-medium text-stone-700 '>
                        Delete Product
                    </p>
                    <IconButton onClick={() => toggle_modal("delete_product_modal")}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>
                <p className='text-[13px] md:text-[16px] text-stone-500 font-medium border-b border-stone-300 p-[20px]' >
                    Are you sure do you want to delete this Product?
                </p>
                <div className='w-full flex justify-end gap-3 p-[20px] ' >
                    <button onClick={() => toggle_modal("delete_product_modal")} className='bg-slate-200 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-stone-700 text-[12px] font-medium md:text-[15px] transition-all' >Cancel</button>
                    <button onClick={handle_delete_menu} className='bg-red-600 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-white text-[12px] font-medium md:text-[15px] transition-all' >Delete</button>
                </div>

            </div>
        </Dialog>
    )
}

export default Delete_product_modal