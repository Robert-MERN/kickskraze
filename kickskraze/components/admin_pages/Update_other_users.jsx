import React, { useEffect, useState } from 'react'
import useStateContext from '@/context/ContextProvider';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Link from 'next/link';
import { FaUserCog } from "react-icons/fa";


const Update_other_users = ({ axios, user: USER }) => {


    const { get_all_users_api, all_users_details, set_all_users_details, set_modal_user_id, toggle_modal, toggle_drawer, user, set_user, get_user_api } = useStateContext();


    const [is_loading, set_is_loading] = useState(true);
    const [is_data_grid_loading, set_is_data_grid_loading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 12, });

    const [fetch_queue, set_fetch_queue] = useState(0);
    useEffect(() => {
        set_fetch_queue(0);
        get_user_api(axios, USER.id, set_user, set_is_loading, () => set_fetch_queue(1));
    }, [USER]);

    useEffect(() => {
        if (fetch_queue > 0 && user && user.isAdmin) {
            get_all_users_api(axios, user.id, set_all_users_details, set_is_data_grid_loading);
        }

    }, [user, fetch_queue]);


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


    const edit_user_btn = (id, format) => {
        set_modal_user_id(id);
        if (format === "modal") {
            toggle_modal("edit_user_profile_modal");
        } else if (format === "drawer") {
            toggle_drawer("edit_user_profile_drawer");
        }
    };


    const columns = [
        {
            field: 'createdAt',
            headerName: 'Created Date',
            width: 180,
            renderCell: params => `${date_formatter(params.row.createdAt)}`
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 160,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
        },
        {
            field: 'isAdmin',
            headerName: 'Role',
            width: 90,
            renderCell: params => (
                <p className={`hover:underline w-[90px] text-ellipsis overflow-hidden cursor-default ${params.row.isAdmin ? "text-green-700" : "text-blue-600"}`}>{params.row.isAdmin ? "Admin" : "User"}</p>
            )
        },
        {
            field: 'store_name',
            headerName: 'Store',
            width: 100,
        },
        {
            field: 'edit_user',
            headerName: 'Edit User',
            sortable: false,  // Disables sorting
            filterable: false, // Disables filtering
            width: 140,
            renderCell: params => (<div className='flex items-center w-full h-full'>
                <button onClick={() => edit_user_btn(params.row._id, "modal")} className='text-[12px] bg-black rounded-md text-white h-fit w-fit px-[14px] py-[10px] hidden md:flex items-center justify-center leading-none hover:opacity-75 active:opacity-65 transition-all gap-2'>
                    <FaUserCog className='text-[18px]' />
                    Edit Profile
                </button>
                <button onClick={() => edit_user_btn(params.row._id, "drawer")} className='text-[12px] bg-black rounded-md text-white h-fit w-fit px-[14px] py-[10px] md:hidden flex items-center justify-center leading-none hover:opacity-75 active:opacity-65 transition-all gap-2'>
                    <FaUserCog className='text-[18px]' />
                    Edit Profile
                </button>
            </div>),
        },
    ];




    return (



        <div className='w-full h-full' >
            {is_loading ?
                // Loading State
                <p className='text-[16px] md:text-[20px] text-center h-full flex items-center justify-center text-stone-500 font-medium' >
                    Loading...
                </p>
                :
                <>
                    {/* Show Table if user is Admin or Parent Admin */}
                    {(user?.isAdmin || user?.parentAdmin) ?
                        <DataGrid
                            sx={{
                                [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                                    outline: 'none',
                                },
                                [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                                {
                                    outline: 'none',
                                },
                            }}
                            columns={columns}
                            rows={all_users_details.filter(each => (!each.parentAdmin && each._id !== USER.id)).map(row => ({
                                ...row,
                                name: `${row.firstName || ""} ${row.lastName || ""}`.trim()
                            }))}
                            getRowId={row => row._id}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[6, 12]}
                            loading={is_data_grid_loading}
                            rowSelection={false}
                        />
                        :
                        // Show No Permission Message
                        <div className='h-[50%] flex flex-col gap-4 justify-end items-center'>
                            <p className='text-[17px] md:text-[22px] text-center text-stone-500 font-medium' >
                                You do not have permission to view this page.
                            </p>
                            <Link href="/admin">
                                <button className={`text-white text-[14px] md:text-[16px] font-medium px-[13px] md:px-[30px] py-[6px] md:py-[8px] cursor-pointer transition-all bg-black hover:opacity-75 duration-300`}>Go back</button>
                            </Link>
                        </div>
                    }
                </>
            }

        </div>



    )
}


export default Update_other_users