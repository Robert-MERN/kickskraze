import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';



const Delete_order_modal = ({
    axios,
    modals_state,
    toggle_modal,
    drawer_state,
    toggle_drawer,
}) => {

    const { get_all_orders_api, set_orders, set_dispatched_orders, order_id, set_order_id, delete_order_api, set_API_loading, } = useStateContext();

    const router = useRouter();

    // Setting store name
    const [store_name, set_store_name] = useState("");
    useEffect(() => {
        const path = router.pathname.split("?")[0].slice(1).split("/");
        if (path.length === 3 && ["orders", "dispatched-orders"].includes(path[1])) {
            const normalizedPathStoreName = path[2].charAt(0).toUpperCase() + path[2].slice(1);
            if (normalizedPathStoreName === "Jewellry") {
                set_store_name("Jewelry");
            } else {
                set_store_name(normalizedPathStoreName);
            }
        } else {
            set_store_name("");
        }

    }, [router.pathname]);

    const pathname = router.pathname;
    const pages = {
        [`/admin/orders/${store_name === "Jewelry" ? "jewellry" : store_name.toLowerCase()}`]: {
            query: `status=booked&store_name=${store_name}`,
            fn: set_orders,
        },
        [`/admin/dispatched-orders/${store_name === "Jewelry" ? "jewellry" : store_name.toLowerCase()}`]: {
            query: `status_not=booked&store_name=${store_name}`,
            fn: set_dispatched_orders,
        },
    };

    const handle_delete_order = async (cancel_order) => {
        const order_deleted = await delete_order_api(axios, order_id, cancel_order || "", set_API_loading);
        await get_all_orders_api(axios, pages[pathname].query, pages[pathname].fn, set_API_loading);
        if (order_deleted) {
            if (drawer_state.view_order_drawer) {
                toggle_drawer("view_order_drawer");
            };
            if (modals_state.view_order_modal) {
                toggle_modal("view_order_modal");
            };
            toggle_modal("delete_order_modal");
        }
    }

    return (
        <Dialog
            open={modals_state.delete_order_modal}
            onClose={() => toggle_modal("delete_order_modal")}
        >
            <div className='w-full md:w-[500px]' >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50' >
                    <p className='text-[15px] md:text-[18px] font-medium text-stone-700 '>
                        Delete Order
                    </p>
                    <IconButton onClick={() => toggle_modal("delete_order_modal")}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>
                <p className='text-[13px] md:text-[16px] text-stone-500 font-medium border-b border-stone-300 p-[20px]' >
                    Are you sure do you want to delete this Order?
                </p>
                <div className='w-full flex justify-between p-[20px] ' >

                    <button onClick={() => toggle_modal("delete_order_modal")} className='bg-slate-200 hover:opacity-85 active:opacity-60 px-[8px] md:px-[14px] py-[6px] md:py-[8px] rounded text-stone-700 text-[12px] font-medium md:text-[15px] transition-all' >Close</button>

                    <div className='w-full flex justify-end gap-3 md:gap-5 ' >
                        <button onClick={() => handle_delete_order("cancel_order=true")} className='bg-red-600 hover:opacity-85 active:opacity-60 px-[8px] md:px-[14px] py-[6px] md:py-[8px] rounded text-white text-[12px] font-medium md:text-[15px] transition-all' >Cancel Order</button>
                        <button onClick={() => handle_delete_order()} className='bg-violet-600 hover:opacity-85 active:opacity-60 px-[8px] md:px-[14px] py-[6px] md:py-[8px] rounded text-white text-[12px] font-medium md:text-[15px] transition-all' >Delete Order</button>
                    </div>

                </div>

            </div>
        </Dialog>
    )
}

export default Delete_order_modal