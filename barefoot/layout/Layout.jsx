import Collection_drawer from '@/components/utilities/drawers/Collection_drawer'
import Menu_drawer from '@/components/utilities/drawers/Menu_drawer'
import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';
import useStateContext from '@/context/ContextProvider';
import Search_drawer from '@/components/utilities/drawers/Search_drawer';
import Sort_drawer from '@/components/utilities/drawers/Sort_drawer';
import Filter_drawer from '@/components/utilities/drawers/Filter_drawer';
import axios from "axios";
import Food_menu_drawer from '@/components/utilities/drawers/Food_menu_drawer';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import styles from "@/styles/home.module.css"

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}
const Layout = ({ children }) => {

    const {
        snackbar_alert,
        close_snackbar,
        drawer_state,
        toggle_drawer,
        sidebar,
        handle_sidebar,
        set_data,
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

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={TransitionDown}
                key={TransitionDown ? TransitionDown.name : ''}
                open={snackbar_alert.open}
                autoHideDuration={10000}
                onClose={close_snackbar}>
                <Alert onClose={close_snackbar} severity={snackbar_alert.severity} sx={{ width: '100%' }}>
                    {snackbar_alert.message}
                </Alert>
            </Snackbar>

            <Menu_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Collection_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Search_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Sort_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Filter_drawer
                axios={axios}
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
            />
            <Food_menu_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                sidebar={sidebar}
                handle_sidebar={handle_sidebar}
                set_data={set_data}
            />
            {children}

            <a
                target='_blank'
                href="https://wa.me/923102223511"
                className={`p-[12px] md:p-[14px] lg:p-[16px] fixed bottom-[25px] md:bottom-[35px] right-[20px] md:right-[30px] bg-[#25D366] rounded-full ${styles.whatsapp_shaky} z-[9999]`}
            >

                <WhatsAppIcon className='text-white text-[28px] md:text-[32px] lg:text-[36px]' />

            </a>
        </div>
    )
}

export default Layout