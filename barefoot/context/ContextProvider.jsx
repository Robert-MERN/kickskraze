import React, { useState, createContext, useContext } from 'react'

const StateContext = createContext();

export const ContextProvider = ({ children }) => {


    // Notification logic
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


    // Filter logic

    const default_filters = [
        { price_gte: 20000 },
        { price_lte: 0 },
        { sort_by: "created-descending" }
    ]
    const [filters, set_filters] = useState(default_filters);
    const [filter_started, set_filter_started] = useState(false);

    // Cart Logic
    const [cart, set_cart] = useState([]);

    const sum_of_cart = () => cart.reduce((prev, next) => prev + (next.price * next.quantity), 0);

    const delete_item_from_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];
            const index = updated_cart.findIndex((each) => each._id === item._id)
            updated_cart.splice(index, 1);
            return updated_cart;
        });
    }

    const add_item_to_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];
            const index = updated_cart.findIndex((each) => each._id === item._id)
            if (index !== -1) {
                if (Number(item.quantity + 1) <= item.stock) {
                    const new_item = { ...item, quantity: item.quantity + 1 }
                    updated_cart.splice(index, 1, new_item);
                    set_snackbar_alert({
                        open: true,
                        message: "Item added to you cart",
                        severity: "success"
                    });
                    return updated_cart;
                }
                set_snackbar_alert({
                    open: true,
                    message: "Can't add this item to the cart, due to limited stock!",
                    severity: "warning"
                });
                return updated_cart;
            }
            set_snackbar_alert({
                open: true,
                message: "Item added to you cart",
                severity: "success"
            });
            return [...updated_cart, { ...item, quantity: 1 }];
        });
    }

    const substract_item_from_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];
            const index = updated_cart.findIndex((each) => each._id === item._id)

            if (Number(item.quantity - 1) < 1) {
                updated_cart.splice(index, 1);
                return updated_cart;
            }
            const new_item = { ...item, quantity: item.quantity - 1 }
            updated_cart.splice(index, 1, new_item);
            return updated_cart;
        });
    }




    return (
        <StateContext.Provider
            value={{
                snackbar_alert, set_snackbar_alert, close_snackbar,

                toggle_drawer, drawer_state,

                filters, set_filters, default_filters, filter_started, set_filter_started,

                cart, set_cart, sum_of_cart, delete_item_from_cart, add_item_to_cart,
                substract_item_from_cart,


            }}
        >
            {children}
        </StateContext.Provider>
    )
}

const useStateContext = () => useContext(StateContext);



export default useStateContext