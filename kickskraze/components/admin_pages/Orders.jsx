import React, { useEffect, useState } from 'react'
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';




const Orders = ({ axios }) => {

    const router = useRouter();

    const { get_all_orders_api, set_snackbar_alert, orders, set_orders, set_order_id, toggle_modal, toggle_drawer } = useStateContext();
    const [is_loading, set_is_loading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 13, });

    const copy_to_clipboard = async (text, msg) => {
        try {
            await navigator.clipboard.writeText(text);
            set_snackbar_alert({
                open: true,
                message: msg ?? "Copied!",
                severity: "primary",
            })

        } catch (err) {
            console.error("Failed to copy text: ", err);
            set_snackbar_alert({
                open: true,
                message: "Failed to copy!",
                severity: "error",
            });
        }
    };

    // Payment Methods
    const payment_method = {
        cod: "Cash on Delivery (COD)",
        jazzcash: "Paid with JazzCash (JazzCash)",
        easypaisa: "Paid with EasyPaisa (EasyPaisa)",
        sadapay: "Paid with SadaPay (SadaPay)",
        nayapay: "Paid with NayaPay (NayaPay)",
        bank: "Bank Transfer (Bank)",
    };

    // Order Status
    const order_status = {
        booked: {
            value: "Booked",
            color: "text-blue-700",
        },
        in_transit: {
            value: "In Transit",
            color: "text-fuchsia-600",
        },
        delivered: {
            value: "Delivered",
            color: "text-green-700",
        },
        rcp: {
            value: "RCP",
            color: "text-amber-500",
        },
        returned: {
            value: "Returned",
            color: "text-rose-600",
        },
    };

    // Warehouse Status Colors Selection
    const warehouse_status_colors = {
        "idle": "text-stone-400",
        "found": "text-blue-700",
        "not found": "text-rose-600",
        "packed": "text-green-700",
    };


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


    const view_order_btn = (id, format) => {
        set_order_id(id);
        if (format === "modal") {
            toggle_modal("view_order_modal");
        } else if (format === "drawer") {
            toggle_drawer("view_order_drawer");
        }
    };

    const tracking_url = {
        trax: "https://trax.pk/tracking/",
        leapord: "https://www.leopardscourier.com",
    };

    const columns = [
        {
            field: 'orderNumber',
            headerName: 'ID',
            sortable: false,  // Disables sorting
            width: 110,
            renderCell: params => (
                <a
                    onClick={() => copy_to_clipboard(params.row.orderNumber, "Order ID copied!")}
                    href={`/checkouts/${params.row._id}`}
                    target="_blank"
                    className='hover:underline w-[140px] text-ellipsis overflow-hidden'
                >
                    #{params.row.orderNumber}
                </a>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Invoice Date',
            width: 180,
            renderCell: params => `${date_formatter(params.row.createdAt)}`
        },
        {
            field: 'name',
            headerName: 'Customer Name',
            width: 170,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 90,
        },
        {
            field: 'phone',
            headerName: 'Contact',
            width: 110,
            renderCell: params => (<button className='hover:underline' onClick={() => copy_to_clipboard(params.row.phone, "Contact copied!")} >{params.row.phone}</button>)
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: params => (
                <p className={`hover:underline w-[90px] text-ellipsis overflow-hidden cursor-default ${order_status[params.row.status].color}`}>{order_status[params.row.status].value}</p>
            )
        },
        {
            field: 'total_items',
            headerName: 'Items',
            width: 90,
            renderCell: params => `x ${params?.row?.total_items || ""}`
        },
        {
            field: 'total_amount',
            headerName: 'Total Amount',
            width: 110,
            renderCell: params => `Rs. ${Number(params.row.total_amount).toLocaleString("en-US")}`
        },
        {
            field: 'payment_method',
            headerName: 'Payment Method',
            width: 230,
            renderCell: params => payment_method[params?.row?.payment_method] || "",
        },
        {
            field: 'store_name',
            headerName: 'Store',
            width: 120,
        },
        {
            field: 'verification',
            headerName: 'Verification',
            width: 100,
            renderCell: params => (
                <p className={`hover:underline w-[90px] text-ellipsis overflow-hidden cursor-default ${params.row.verification === "verified" ? "text-green-700" : params.row.verification === "pending" ? "text-amber-500" : "text-stone-400"} capitalize`}>{params.row.verification}</p>
            )
        },
        {
            field: 'warehouse_status',
            headerName: 'Warehouse Status',
            width: 100,
            renderCell: params => (
                <p className={`hover:underline w-[90px] text-ellipsis overflow-hidden cursor-default ${warehouse_status_colors[params.row.warehouse_status]} capitalize`}>{params.row.warehouse_status}</p>
            )
        },
        {
            field: 'tracking_no',
            headerName: 'Tracking No.',
            width: 150,
            renderCell: params => Boolean(params.row.tracking_no) ?
                <a
                    onClick={() => copy_to_clipboard(params.row.tracking_no, "Tacking Id copied!")}
                    href={tracking_url[params.row.courier_name]}
                    target='_blank'
                    className='hover:underline w-[140px] text-ellipsis overflow-hidden text-start cursor-pinter'
                >
                    {params.row.tracking_no || ""}
                </a>
                :
                <p className='text-stone-400' >No Tracking</p>,
        },
        {
            field: 'view_order',
            headerName: 'View/Edit Order',
            sortable: false,  // Disables sorting
            filterable: false, // Disables filtering
            width: 140,
            renderCell: params => (<div className='flex items-center w-full h-full'>
                <button onClick={() => view_order_btn(params.row._id, "modal")} className='text-[12px] bg-black rounded-md text-white h-fit w-fit px-[14px] py-[10px] hidden md:flex items-center justify-center leading-none hover:opacity-75 active:opacity-65 transition-all gap-2'>
                    <ShoppingCartCheckoutIcon className='text-[18px]' />
                    View Order
                </button>
                <button onClick={() => view_order_btn(params.row._id, "drawer")} className='text-[12px] bg-black rounded-md text-white h-fit w-fit px-[14px] py-[10px] md:hidden flex items-center justify-center leading-none hover:opacity-75 active:opacity-65 transition-all gap-2'>
                    <ShoppingCartCheckoutIcon className='text-[18px]' />
                    View Order
                </button>
            </div>),
        },
    ];

    useEffect(() => {
        get_all_orders_api(axios, "status=booked", set_orders, set_is_loading);
    }, []);
    
    const [show_report, set_show_report] = useState(false);
    
    const handle_show_report = ()=> set_show_report(prev=> !prev)


    return (
        <div className='w-full h-full' >
            
            {Boolean(orders.length > 1) &&
                <>
                {show_report && 
                <div className="w-full mb-4 flex flex-col gap-2">
                    <p className="text-stone-600 text-[15px] md:text-[17px] font-semibold">
                        Total Orders:
                        {" "}
                       <span className="font-normal">{orders.length.toLocaleString("en-US")}</span>
                    </p>
                    
                    {Boolean(orders.filter(order=> order.verification === "verified").length) &&
                        <p className="text-stone-600 text-[15px] md:text-[17px] font-semibold">
                            Total Verified Orders:
                            {" "}
                        <span className="font-normal">{orders.filter(order=> order.verification === "verified").length.toLocaleString("en-US")}</span>
                    </p>
                    }
                    
                    <p className="text-stone-600 text-[15px] md:text-[17px] font-semibold">
                        Total Sale:
                        {" "}
                       <span className="font-normal">{orders.reduce((total, order)=> (total + order.total_items), 0).toLocaleString("en-US")}</span>
                    </p>
                    
                    {Boolean(orders.filter(order=> order.verification === "verified").length) &&
                       <p className="text-stone-600 text-[15px] md:text-[17px] font-semibold">
                           Total Verified Sale:
                           {" "}
                           <span className="font-normal">{orders.filter(order=> order.verification === "verified").reduce((total, order)=> (total + order.total_items), 0).toLocaleString("en-US")}</span>
                       </p>
                    }
                    
                    <p className="text-stone-600 text-[15px] md:text-[17px] font-semibold">
                        Total Revenue:
                        {" "}
                       <span className="font-normal">Rs. {orders.reduce((total, order)=> (total + order.total_amount), 0).toLocaleString("en-US")}</span>
                    </p>
                    
                    {Boolean(orders.filter(order=> order.verification === "verified").length) &&
                       <p className="text-stone-600 text-[15px] md:text-[17px] font-semibold">
                           Total Verified Revenue:
                           {" "}
                           <span className="font-normal">Rs. {orders.filter(order=> order.verification === "verified").reduce((total, order)=> (total + order.total_amount), 0).toLocaleString("en-US")}</span>
                       </p>
                    }
                </div>
                }
                
                    <button onClick={handle_show_report} className="text-stone-700 font-bold underline text-[16px] md:text-[18px]">
                        {show_report?
                          "Hide Report"
                           :
                          "Show Report"
                        }
                        
                    </button>
                </>
            }
            
            
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
                rows={orders.map(row => ({
                    ...row,
                    name: `${row.firstName || ""} ${row.lastName || ""}`.trim()
                }))}
                getRowId={row => row._id}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[6, 13]}
                loading={is_loading}
                rowSelection={false}
            />
            
        </div>
    )
}

export default Orders