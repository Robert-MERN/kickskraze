import React, { useState, createContext, useContext } from 'react'

const StateContext = createContext();

export const ContextProvider = ({ children }) => {

    const [snackbar_alert, set_snackbar_alert] = useState({
        open: false,
        message: "",
        severity: "primary"
    });
    const close_snackbar = () => {
        set_snackbar_alert(prev => ({ ...prev, open: false }));
    };


    // Drawer Logic
    const default_drawer_state = {
        menu_drawer: false,
        collection_drawer: false,
        search_drawer: false,
        sort_drawer: false,
        filter_drawer: false,
    }
    const [drawer_state, set_drawer_state] = useState(default_drawer_state);

    const toggle_drawer = (drawer) => {
        if (drawer.includes("collection_drawer")) {
            set_drawer_state(prev => ({ ...default_drawer_state, [drawer]: !prev[drawer], menu_drawer: true }));
        } else {
            set_drawer_state(prev => ({ ...default_drawer_state, [drawer]: !prev[drawer] }));
        }
    };

    const default_filters = [
        { price_gte: 20000 },
        { price_lte: 0 },
        { sort_by: "created-descending" }
    ]
    const [filters, set_filters] = useState(default_filters);
    const [filter_started, set_filter_started] = useState(false);


    return (
        <StateContext.Provider
            value={{
                snackbar_alert, set_snackbar_alert, close_snackbar,
                toggle_drawer, drawer_state,
                filters, set_filters, default_filters, filter_started, set_filter_started,
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

const useStateContext = () => useContext(StateContext);



export default useStateContext