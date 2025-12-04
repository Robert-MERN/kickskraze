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

const Admin_menu_drawer = ({ drawer_state, toggle_drawer }) => {

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
                { option_name: "Update User", link: "/admin/update-user", icon: <ManageAccountsIcon className='text-[23px]' /> },
                { option_name: "Edit Other Profiles", link: "/admin/update-other-users", icon: <FaUsersSlash className='text-[23px]' /> },
            ]
        },
    ];

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
        <SwipeableDrawer
            open={drawer_state.admin_menu_drawer}
            onClose={() => toggle_drawer("admin_menu_drawer")}
            onOpen={() => toggle_drawer("admin_menu_drawer")}
        >
            <div className={`w-[90vw] md:w-[50vw] py-[10px] text-stone-950 transition-all duration-300 overflow-y-auto ${styles.scroll_bar}`}>


                <div className='flex justify-between w-full items-center py-[12px] px-[20px]' >
                    <p className='text-[20px] font-bold select-none' >Menu</p>
                    <button onClick={() => toggle_drawer("admin_menu_drawer")} className='active:opacity-75' >
                        <IoClose className='text-stone-700 scale-[1.60]' />
                    </button>

                </div>
                {options.map((option, index) => (
                    <div className='w-full' key={index}>
                        <h1 className='text-[15px] text-stone-400 font-medium px-[20px] my-[10px]'>{option.option_title}</h1>

                        {option.child_options.map((each, ind) => {
                            const isActiveMain = router.pathname.includes(each.link);

                            const isAllProducts = each.option_name === "All Products";
                            const isOrders = each.option_name === "Orders";
                            const isDispatched = each.option_name === "Dispatched Orders";

                            return (
                                <div key={ind}>

                                    {/* === MAIN OPTION BUTTON === */}
                                    <button
                                        onClick={() => {
                                            navigate_page();

                                            if (isAllProducts) toggleAllProducts();
                                            else if (isOrders) toggleOrders();
                                            else if (isDispatched) toggleDispatched();
                                            else { toggle_drawer("admin_menu_drawer"); router.push(each.link); }
                                        }}
                                        className={`w-full text-[15px] text-left font-medium px-[20px] py-[6px] flex items-center gap-2 transition-all ${isActiveMain ? "bg-blue-50 text-blue-600" : "hover:bg-stone-100 text-stone-700"}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {each.icon} {each.option_name}
                                        </div>

                                        {/* Arrow for All Products only */}
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
                                                            };

                                                            toggle_drawer("admin_menu_drawer")
                                                            router.push(sub.link);
                                                        }}
                                                        className={`flex items-center gap-2 text-[14px] text-left py-[4px] transition-all hover:bg-stone-100 w-full pl-[10px]
                                                            ${router.asPath === sub.link
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
        </SwipeableDrawer >
    )
}

export default Admin_menu_drawer