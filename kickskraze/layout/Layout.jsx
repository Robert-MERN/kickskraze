import Collection_drawer from '@/utils/drawers/Collection_drawer'
import Menu_drawer from '@/utils/drawers/Menu_drawer'
import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Backdrop, CircularProgress, Slide } from '@mui/material';
import useStateContext from '@/context/ContextProvider';
import Search_drawer from '@/utils/drawers/Search_drawer';
import Sort_drawer from '@/utils/drawers/Sort_drawer';
import Filter_drawer from '@/utils/drawers/Filter_drawer';
import axios from "axios";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import styles from "@/styles/home.module.css"
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Admin_menu_drawer from "@/utils/drawers/Admin_menu_drawer"
import Delete_product_modal from '@/utils/modals/Delete_product_modal';
import Logout_modal from '@/utils/modals/Logout_modal';
import Sort_drawer_admin from '@/utils/drawers/Sort_drawer_admin';
import Filter_drawer_admin from '@/utils/drawers/Filter_drawer_admin';
import View_order_modal from '@/utils/modals/View_order_modal';
import Delete_order_modal from '@/utils/modals/Delete_order_modal';
import View_order_drawer from '@/utils/drawers/View_order_drawer';
import Search_drawer_admin from '@/utils/drawers/Search_drawer_admin';
import Share_link_modal from '@/utils/modals/Share_link_modal';
import Edit_user_profile_modal from '@/utils/modals/Edit_user_profile_modal';
import Delete_user_modal from '@/utils/modals/Delete_user_modal';
import Edit_user_profile_drawer from '@/utils/drawers/Edit_user_profile_drawer';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}
const Layout = ({ children }) => {

    const router = useRouter();

    const {
        snackbar_alert,
        close_snackbar,
        drawer_state,
        toggle_drawer,
        API_loading,
        modals_state,
        toggle_modal,
        set_API_loading,
        set_product_id,
        product_id,
        delete_product_api,
        default_update_product_details,
        set_update_product_details,
        set_product_details,
        default_product_details,
        progress_of_loading,
        get_all_products_api,
        set_products_title,
        get_all_products_title_api,
        set_snackbar_alert,
    } = useStateContext();

    // lock scroll when drawer opens
    useEffect(() => {
        if (Object.values(drawer_state).some(e => e === true)) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");// Cleanup on unmount
        };
    }, [drawer_state]);


    return (
        <div>

            {/* Loader Component */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={API_loading}
            >
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant={progress_of_loading.status ? "determinate" : "indeterminate"} value={Number(progress_of_loading.value)} color="inherit" />
                    {progress_of_loading.status &&
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{ color: 'text.inherit' }}
                            >
                                {`${progress_of_loading.value}%`}
                            </Typography>
                        </Box>
                    }
                </Box>
            </Backdrop>
            {/* Notifications */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={TransitionDown}
                key={TransitionDown ? TransitionDown.name : ''}
                open={snackbar_alert.open}
                autoHideDuration={5000}
                onClose={close_snackbar}>
                <Alert onClose={close_snackbar} severity={snackbar_alert.severity} sx={{ width: '100%' }}>
                    {snackbar_alert.message}
                </Alert>
            </Snackbar>

            {/* Drawers */}
            <Menu_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Collection_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Search_drawer
                axios={axios}
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                get_all_products_api={get_all_products_api}
            />
            <Search_drawer_admin
                axios={axios}
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                get_all_products_api={get_all_products_api}
            />
            <Sort_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                axios={axios}
            />
            <Sort_drawer_admin
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                axios={axios}
            />
            <Filter_drawer
                axios={axios}
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Filter_drawer_admin
                axios={axios}
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Admin_menu_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <View_order_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                toggle_modal={toggle_modal}
                axios={axios}
            />
            <Edit_user_profile_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                toggle_modal={toggle_modal}
                axios={axios}
            />

            {/* Modals */}
            <Delete_product_modal
                axios={axios}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                set_API_loading={set_API_loading}
                set_product_id={set_product_id}
                product_id={product_id}
                delete_product_api={delete_product_api}
                default_update_product_details={default_update_product_details}
                set_update_product_details={set_update_product_details}
                set_products_title={set_products_title}
                get_all_products_title_api={get_all_products_title_api}
            />
            <Logout_modal
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                set_product_id={set_product_id}
                default_update_product_details={default_update_product_details}
                set_update_product_details={set_update_product_details}
                set_product_details={set_product_details}
                default_product_details={default_product_details}
            />
            <View_order_modal
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                axios={axios}
            />
            <Delete_order_modal
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                axios={axios}
            />
            <Share_link_modal
                set_snackbar_alert={set_snackbar_alert}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
            />

            <Edit_user_profile_modal
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                axios={axios}
            />
            <Delete_user_modal
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                axios={axios}
            />

            {children}

            {(router.pathname.includes("/collection") || router.pathname === ("/")) &&

                < a
                    target='_blank'
                    href="https://wa.me/923020215755"
                    className={`p-[12px] md:p-[14px] lg:p-[16px] fixed bottom-[75px] lg:bottom-[35px] right-[20px] lg:right-[30px] bg-[#25D366] rounded-full ${styles.whatsapp_shaky} z-[16]`}
                >

                    <WhatsAppIcon className='text-white text-[28px] md:text-[32px] lg:text-[36px]' />

                </a>
            }
        </div >
    )
}

export default Layout