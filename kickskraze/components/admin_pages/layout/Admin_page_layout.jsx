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
import DiamondIcon from '@mui/icons-material/Diamond';
import { GiConverseShoe } from "react-icons/gi";
import { GiClothes } from "react-icons/gi";
import { LiaShoePrintsSolid } from "react-icons/lia";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useRouter } from 'next/router';
import useStateContext from '@/context/ContextProvider';
import styles from "@/styles/home.module.css";




let allProductsOpen = false;
let ordersOpen = false;
let dispatchedOpen = false;


const Admin_page = ({ admin_children }) => {

    const router = useRouter();

    const {
        set_product_details,
        set_update_product_details,
        default_update_product_details,
        default_product_details,
        set_product_id,
        set_filters_admin,
        set_filter_options_admin,
        set_fetched_products_for_collection_admin,
        set_products_for_collection_admin_loading,
        set_filter_options_loading_admin,
        set_stored_path_admin,
    } = useStateContext()


    const options = [
        {
            option_title: "Products",
            child_options: [
                { option_name: "Add Product", link: "/admin/add-product", icon: <FaBasketShopping className='text-[20px]' /> },
                { option_name: "Update Product", link: "/admin/update-product", icon: <TbShoppingBagEdit className='text-[22px]' /> },
                {
                    option_name: "All Products",
                    link: "/admin/all-products",
                    icon: <AiFillProduct className='text-[23px]' />,

                    // ⭐ NEW: Submenu for All Products
                    sub_options: [
                        { name: "Footwear", link: "/admin/all-products/footwear", icon: <GiConverseShoe className='text-[19px]' /> },
                        { name: "Footwear Accessories", link: "/admin/all-products/footwear-accessories", icon: <LiaShoePrintsSolid className='text-[19px]' /> },
                        { name: "Jewellry", link: "/admin/all-products/jewellry", icon: <DiamondIcon className='text-[19px]' /> },
                        { name: "Apparel", link: "/admin/all-products/apparel", icon: <GiClothes className='text-[19px]' /> },
                    ]
                },
            ]
        },
        {
            option_title: "Sales",
            child_options: [
                {
                    option_name: "Orders",
                    link: "/admin/orders",
                    icon: <ShoppingCartIcon />,
                    sub_options: [
                        { name: "Footwear", link: "/admin/orders/footwear", icon: <GiConverseShoe className='text-[19px]' /> },
                        { name: "Jewellry", link: "/admin/orders/jewellry", icon: <DiamondIcon className='text-[19px]' /> },
                        { name: "Apparel", link: "/admin/orders/apparel", icon: <GiClothes className='text-[19px]' /> },
                    ]
                },
                {
                    option_name: "Dispatched Orders",
                    link: "/admin/dispatched-orders",
                    icon: <ShoppingCartCheckoutIcon />,
                    sub_options: [
                        { name: "Footwear", link: "/admin/dispatched-orders/footwear", icon: <GiConverseShoe className='text-[19px]' /> },
                        { name: "Jewellry", link: "/admin/dispatched-orders/jewellry", icon: <DiamondIcon className='text-[19px]' /> },
                        { name: "Apparel", link: "/admin/dispatched-orders/apparel", icon: <GiClothes className='text-[19px]' /> },
                    ]
                },
                { option_name: "Customers", link: "/admin/customers", icon: <GroupIcon /> },
                { option_name: "Analytics", link: "/admin/analytics", icon: <BarChartIcon /> },
            ]
        },
        {
            option_title: "Settings",
            child_options: [
                { option_name: "Store", link: "/admin/store-settings", icon: <AddBusinessIcon className='text-[23px]' /> },
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


    // Sub options for All products functionalities
    const [, forceUpdate] = React.useState(0);

    const toggleAllProducts = () => {
        allProductsOpen = !allProductsOpen;
        forceUpdate(n => n + 1);
    };

    const toggleOrders = () => {
        ordersOpen = !ordersOpen;
        forceUpdate(n => n + 1);
    };

    const toggleDispatched = () => {
        dispatchedOpen = !dispatchedOpen;
        forceUpdate(n => n + 1);
    };

    React.useEffect(() => {

        const path = router.pathname;

        // Keep All Products submenu open only under `/admin/all-products`
        if (!path.startsWith("/admin/all-products")) {
            allProductsOpen = false;
        } else {
            allProductsOpen = true;
        }

        // Keep Orders submenu open only under `/admin/orders`
        if (!path.startsWith("/admin/orders")) {
            ordersOpen = false;
        } else {
            ordersOpen = true;
        }

        // Keep Dispatched Orders submenu open only under `/admin/dispatched-orders`
        if (!path.startsWith("/admin/dispatched-orders")) {
            dispatchedOpen = false;
        } else {
            dispatchedOpen = true;
        }

        forceUpdate(n => n + 1);

    }, [router.pathname]);



    return (
        <div className='flex justify-center lg:justify-between w-full'>

            {/* Menu Options Sidebar */}
            <div className={`lg:w-[270px] xl:w-[300px] top-[70px]  h-[calc(100vh-70px)] border-r border-r-slate-200 hidden lg:block fixed z-[9] py-[10px] overflow-y-auto ${styles.scroll_bar}`}>

                {options.map((option, index) => (
                    <div className='w-full' key={index}>
                        <h1 className='text-[15px] text-stone-400 font-medium px-[20px] my-[10px]'>{option.option_title}</h1>

                        {option.child_options.map((each, ind) => {
                            const isActiveMain = router.pathname.split("?")[0].includes(each.link);

                            const isAllProducts = each.option_name === "All Products";
                            const isOrders = each.option_name === "Orders";
                            const isDispatched = each.option_name === "Dispatched Orders";

                            return (
                                <div key={ind}>

                                    {/* === MAIN OPTION BUTTON === */}
                                    <button
                                        onClick={() => {
                                            navigate_page()

                                            if (isAllProducts) toggleAllProducts();
                                            else if (isOrders) toggleOrders();
                                            else if (isDispatched) toggleDispatched();
                                            else router.push(each.link);
                                        }}
                                        className={`w-full text-[15px] text-left font-medium px-[20px] py-[6px] flex items-center gap-2 transition-all ${isActiveMain ? "bg-blue-50 text-blue-600" : "hover:bg-stone-100 text-stone-700"}`}
                                    >

                                        <div className="flex items-center gap-2">
                                            {each.icon} {each.option_name}
                                        </div>

                                        {/* Arrow for Sub options */}
                                        {(isAllProducts || isOrders || isDispatched) && (
                                            <span className={`transition-transform duration-300 ${(isAllProducts && allProductsOpen) ||
                                                (isOrders && ordersOpen) ||
                                                (isDispatched && dispatchedOpen)
                                                ? "rotate-90"
                                                : ""
                                                }`}>
                                                <KeyboardArrowRightIcon className='text-[19px]' />
                                            </span>
                                        )}


                                    </button>


                                    {/* === COLLAPSIBLE SUBMENU === */}
                                    {(isAllProducts || isOrders || isDispatched) && (
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${(isAllProducts && allProductsOpen) ||
                                                (isOrders && ordersOpen) ||
                                                (isDispatched && dispatchedOpen)
                                                ? "max-h-[500px] opacity-100"
                                                : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="pl-[35px] py-1 flex flex-col gap-1">
                                                {each.sub_options.map((sub, i) => (

                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            navigate_page();
                                                            if (isAllProducts) {
                                                                set_filter_options_loading_admin(true)
                                                                set_products_for_collection_admin_loading(true);
                                                                set_filters_admin([]);
                                                                set_filter_options_admin({});
                                                                set_fetched_products_for_collection_admin([]);
                                                                set_stored_path_admin("");
                                                            }
                                                            router.push(sub.link);
                                                        }}
                                                        className={`flex items-center gap-2 text-[14px] text-left py-[4px] transition-all hover:bg-stone-100 w-full pl-[10px]
                                                            ${router.asPath.split("?")[0] === sub.link
                                                                ? "text-blue-600"
                                                                : "text-stone-600"}`}
                                                    >
                                                        {sub.icon} {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            );
                        })}

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
            {
                pages_statements[Object.keys(pages_statements).find(e => router.pathname.includes(e))] &&
                <div className='w-[100px] xl:w-[300px] h-[calc(100vh-70px)] opacity-0  hidden lg:block'></div>
            }
        </div >
    )
}

export default Admin_page



