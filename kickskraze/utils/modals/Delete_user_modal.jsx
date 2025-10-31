import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import useStateContext from '@/context/ContextProvider';
import { remove_cookie } from '../functions/cookie';


const Delete_user_modal = ({
    axios,
    modals_state,
    toggle_modal,
}) => {

    const router = useRouter();

    const { set_modal_user_id, modal_user_id, delete_user_api, set_API_loading, user, get_all_users_api, set_all_users_details } = useStateContext();

    const final_function_others = () => {
        set_modal_user_id("");
        toggle_modal("delete_user_modal");
        toggle_modal("edit_user_profile_modal");
        get_all_users_api(axios, user.id, set_all_users_details, set_API_loading);
    }

    const final_function_personal = () => {
        remove_cookie("user_account_token")
        toggle_modal("delete_user_modal");
        router.push("/admin");

    }

    const handle_delete_menu = () => {
        const own_account = router.asPath === "/admin/update-user";

        delete_user_api(
            axios,
            user.id,
            own_account ? user.id : modal_user_id,
            set_API_loading,
            own_account ? final_function_personal : final_function_others,
        );
    }



    return (
        <Dialog
            open={modals_state.delete_user_modal}
            onClose={() => toggle_modal("delete_user_modal")}
        >
            <div className='w-full md:w-[500px]' >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50' >
                    <p className='text-[15px] md:text-[18px] font-medium text-stone-700 '>
                        {own_account ?
                            "Delete Your Account"
                            :
                            "Delete User Account"

                        }
                    </p>
                    <IconButton onClick={() => toggle_modal("delete_user_modal")}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>
                <p className='text-[13px] md:text-[16px] text-stone-500 font-medium border-b border-stone-300 p-[20px]' >
                    {own_account ?
                        "Are you sure do you want to delete your account? This action is irreversible."
                        :
                        "Are you sure do you want to delete this user account?"
                    }
                </p>
                <div className='w-full flex justify-end gap-3 p-[20px] ' >
                    <button onClick={() => toggle_modal("delete_user_modal")} className='bg-slate-200 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-stone-700 text-[12px] font-medium md:text-[15px] transition-all' >Cancel</button>
                    <button onClick={handle_delete_menu} className='bg-red-600 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-white text-[12px] font-medium md:text-[15px] transition-all' >Delete</button>
                </div>

            </div>
        </Dialog>
    )
}

export default Delete_user_modal