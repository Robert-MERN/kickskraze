import React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IoClose } from "react-icons/io5";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import GroupIcon from '@mui/icons-material/Group';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { TbShoppingBagEdit } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { FaBasketShopping } from "react-icons/fa6";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useRouter } from 'next/router';
import useStateContext from '@/context/ContextProvider';
import Link from 'next/link';


const Admin_menu_drawer = ({ drawer_state, toggle_drawer }) => {

    const router = useRouter();

    const { set_product_details, set_update_product_details, default_update_product_details, default_product_details,
        set_product_id, } = useStateContext()

    const options = [
        {
            option_title: "Products",
            child_options: [
                { option_name: "Add Product", link: "/admin/add-product", icon: <FaBasketShopping className='text-[20px]' /> },
                { option_name: "Update Product", link: "/admin/update-product", icon: <TbShoppingBagEdit className='text-[22px]' /> },
                { option_name: "All Products", link: "/admin/all-products", icon: <AiFillProduct className='text-[23px]' /> },
            ]
        },
        {
            option_title: "Sales",
            child_options: [
                { option_name: "Orders", link: "/admin/orders", icon: <ShoppingCartIcon /> },
                { option_name: "Dispatched Orders", link: "/admin/dispatched-orders", icon: <ShoppingCartCheckoutIcon /> },
                { option_name: "Customers", link: "/admin/customers", icon: <GroupIcon /> },
                { option_name: "Analytics", link: "/admin/analytics", icon: <BarChartIcon /> },
            ]
        },
        {
            option_title: "Settings",
            child_options: [
                { option_name: "App", link: "/admin/app-settings", icon: <AddBusinessIcon className='text-[23px]' /> },
                { option_name: "Add User", link: "/admin/add-user", icon: <GroupAddIcon className='text-[20px]' /> },
                { option_name: "Update User", link: "/admin/update-user", icon: <ManageAccountsIcon className='text-[23px]' /> },
            ]
        },
    ];

    const navigate_page = () => {
        set_product_details(default_product_details);
        set_update_product_details(default_update_product_details);
        set_product_id("");
        toggle_drawer("admin_menu_drawer")
    }

    return (
        <SwipeableDrawer
            open={drawer_state.admin_menu_drawer}
            onClose={() => toggle_drawer("admin_menu_drawer")}
            onOpen={() => toggle_drawer("admin_menu_drawer")}
        >
            <div className='w-[90vw] md:w-[50vw] py-[10px] text-stone-950 transition-all duration-300'>


                <div className='flex justify-between w-full items-center py-[12px] px-[20px]' >
                    <p className='text-[20px] font-bold select-none' >Menu</p>
                    <button onClick={() => toggle_drawer("admin_menu_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-700 scale-[1.60]' />
                    </button>

                </div>

                {options.map((option, index) => (
                    <div className='w-full' key={index}>
                        <h1 className='text-[15px] text-stone-400 font-medium px-[20px] my-[10px]'>
                            {option.option_title}
                        </h1>

                        {option.child_options.map((each, ind) => (
                            <Link href={each.link} key={ind}>
                                <button onClick={navigate_page} className={`w-full text-[15px]  text-left font-medium px-[20px] py-[6px] transition-all flex items-center gap-2  ${router.pathname.includes(each.link) || (router.pathname === "/admin" && each.link === "/admin/create-product") ? "bg-blue-50 hover:bg-blue-100 text-blue-600" : "hover:bg-stone-100 text-stone-700"}`}>
                                    {each.icon} {each.option_name}
                                </button>
                            </Link>
                        ))}
                        <br />
                    </div>
                ))}
            </div>
        </SwipeableDrawer >
    )
}

export default Admin_menu_drawer