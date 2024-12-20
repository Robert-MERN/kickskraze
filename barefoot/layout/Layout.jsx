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
            {children}
        </div>
    )
}

export default Layout