import React from 'react'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import GroupIcon from '@mui/icons-material/Group';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { TbShoppingBagEdit } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { FaBasketShopping } from "react-icons/fa6";
import BarChartIcon from '@mui/icons-material/BarChart';
import { FaUsersSlash } from "react-icons/fa6";
import { useRouter } from 'next/router';
import useStateContext from '@/context/ContextProvider';
import Link from 'next/link';




const Admin_page = ({ admin_children }) => {

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
                { option_name: "Edit Profile", link: "/admin/update-user", icon: <ManageAccountsIcon className='text-[23px]' /> },
                { option_name: "Edit Other Profiles", link: "/admin/update-other-users", icon: <FaUsersSlash className='text-[23px]' /> },
            ]
        },
    ];


    const pages_statements = {
        "/admin/add-user": true,
        "/admin/update-user": true,
        "/admin/update-other-users": false,
        "/admin/app-settings": true,
        "/admin/orders": false,
        "/admin/dispatched-orders": false,
        "/admin/analytics": false,
        "/admin/customers": false,
        "/admin/all-products": false,
        "/admin/create-product": true,
        "/admin/update-product": true,
        "/admin": true,
    }

    const navigate_page = () => {
        set_product_details(default_product_details);
        set_update_product_details(default_update_product_details);
        set_product_id("");
    }



    return (
        <div className='flex justify-center lg:justify-between w-full'>

            {/* Menu Options Sidebar */}
            <div className='lg:w-[270px] xl:w-[300px] top-[70px]  h-[calc(100vh-70px)] border-r border-r-slate-200 hidden lg:block fixed z-[9] py-[10px]'>

                {options.map((option, index) => (
                    <div className='w-full' key={index}>
                        <h1 className='text-[15px] text-stone-400 font-medium px-[20px] my-[10px]'>{option.option_title}</h1>

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


            <div className={`${pages_statements[Object.keys(pages_statements).find(e => router.pathname.includes(e))] ? "w-[370px]" : "w-[320px]"}  h-[calc(100vh-70px)] opacity-0 hidden lg:block`}> </div>


            {/* Form  */}
            <div className={`min-h-[calc(100vh-70px)] px-[30px] lg:px-[40px] py-[30px] ${pages_statements[Object.keys(pages_statements).find(e => router.pathname.includes(e))] ? "w-full lg:w-[700px] xl:w-[900px]" : "w-full lg:w-[calc(100vw-320px)]"}`}>

                {admin_children}

            </div>

            {/* Hidden Element */}
            {pages_statements[Object.keys(pages_statements).find(e => router.pathname.includes(e))] &&
                <div className='w-[100px] xl:w-[300px] h-[calc(100vh-70px)] opacity-0  hidden lg:block'></div>
            }
        </div>
    )
}

export default Admin_page



