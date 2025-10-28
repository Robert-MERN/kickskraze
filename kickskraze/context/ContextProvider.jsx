import React, { useState, createContext, useContext, useEffect } from 'react'
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/router';
import { MetaPixel } from '@/lib/fpixel';






const StateContext = createContext();

export const ContextProvider = ({ children }) => {

    const router = useRouter();

    // Notification logic
    const [snackbar_alert, set_snackbar_alert] = useState({
        open: false,
        message: "",
        severity: "primary"
    });
    const close_snackbar = () => {
        set_snackbar_alert(prev => ({ ...prev, open: false }));
    };


    // Modal Logic
    const default_modals_state = {
        logout_modal: false,
        delete_product_modal: false,
        view_order_modal: false,
        delete_order_modal: false,
        share_link_modal: false,
    };
    const [modals_state, set_modals_state] = useState(default_modals_state);

    const toggle_modal = (modal) => {
        set_modals_state(prev => ({ ...prev, [modal]: !prev[modal] }));
    };

    // Drawer Logic
    const default_drawer_state = {
        menu_drawer: false,
        collection_drawer: false,
        search_drawer: false,
        sort_drawer: false,
        sort_drawer_admin: false,
        filter_drawer: false,
        filter_drawer_admin: false,
        food_menu_drawer: false,
        admin_menu_drawer: false,
        view_order_drawer: false,
    }
    const [drawer_state, set_drawer_state] = useState(default_drawer_state);

    const toggle_drawer = (drawer) => {
        if (drawer.includes("collection_drawer")) {
            set_drawer_state(prev => ({ ...default_drawer_state, [drawer]: !prev[drawer], menu_drawer: true }));
        } else {
            set_drawer_state(prev => ({ ...prev, [drawer]: !prev[drawer] }));
        }
    };


    // Filter logic
    const [filters, set_filters] = useState([]);
    const [filter_options, set_filter_options] = useState({});




    // Cart Logic
    const [cart, set_cart] = useState([]);

    const convert_product_to_meta = (product) => {
        const meta_product = {
            content_ids: [product._id],
            content_type: "product",
            content_name: product.title,
            content_category: "Shoes",
            value: product.price.toFixed(2),
            currency: "PKR",
        }
        return meta_product;
    }

    useEffect(() => {
        const saved_cart = JSON.parse(localStorage.getItem("cart"));
        if (saved_cart) {
            set_cart(saved_cart); // Assuming `set_cart` updates your cart state
        }
    }, []);

    const save_cart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    const sum_of_cart = () => cart.reduce((prev, next) => prev + (next.price * next.quantity), 0);

    const delete_item_from_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];
            const index = updated_cart.findIndex((each) => each._id === item._id)
            updated_cart.splice(index, 1);
            save_cart(updated_cart);
            return updated_cart;
        });
    }

    const add_item_to_cart = (item, direct) => {
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
                    save_cart(updated_cart)
                    return updated_cart;
                }
                if (!direct) {
                    set_snackbar_alert({
                        open: true,
                        message: "Item already added to your cart!",
                        severity: "warning"
                    });
                }
                save_cart(updated_cart)
                MetaPixel.trackEvent("InitiateCheckout", convert_product_to_meta(item));
                return updated_cart;
            }
            set_snackbar_alert({
                open: true,
                message: "Item added to you cart",
                severity: "success"
            });
            save_cart([...updated_cart, { ...item, quantity: 1 }]);
            MetaPixel.trackEvent("AddToCart", convert_product_to_meta(item));
            return [...updated_cart, { ...item, quantity: 1 }];
        });
    }

    const substract_item_from_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];
            const index = updated_cart.findIndex((each) => each._id === item._id)

            if (Number(item.quantity - 1) < 1) {
                updated_cart.splice(index, 1);
                save_cart(updated_cart);
                return updated_cart;
            }
            const new_item = { ...item, quantity: item.quantity - 1 }
            updated_cart.splice(index, 1, new_item);
            save_cart(updated_cart);
            return updated_cart;
        });
    }


    // Create Product Details
    const default_product_details = {
        title: "",
        price: "",
        cost_price: "",
        compare_price: "",
        size: "",
        brand: "",
        condition: "",
        category: "",
        stock: 1,
        size_desc: "",
        shoes_desc: "",
        store_name: "",
        media: [],
        featured: false,
        errors: {
            title: "",
            price: "",
            cost_price: "",
            size: "",
            brand: "",
            condition: "",
            category: "",
            stock: "",
            size_desc: "",
            shoes_desc: "",
            store_name: "",
            media: "",
        }
    }
    const [product_details, set_product_details] = useState(default_product_details);

    // Update Product Details
    const [product_id, set_product_id] = useState("");
    const default_update_product_details = {
        title: "",
        price: "",
        cost_price: "",
        compare_price: "",
        size: "",
        brand: "",
        condition: "",
        category: "",
        stock: 1,
        size_desc: "",
        shoes_desc: "",
        media: [],
        store_name: "",
        featured: false,
        errors: {
            title: "",
            price: "",
            cost_price: "",
            size: "",
            brand: "",
            condition: "",
            category: "",
            stock: "",
            size_desc: "",
            shoes_desc: "",
            store_name: "",
            media: "",
        }
    }
    const [update_product_details, set_update_product_details] = useState(default_update_product_details);


    const [fetched_products_for_collection, set_fetched_products_for_collection] = useState([]);
    const [products_for_collection_loading, set_products_for_collection_loading] = useState(true);

    const [fetched_products_for_landing, set_fetched_products_for_landing] = useState([]);
    const [products_for_landing_loading, set_products_for_landing_loading] = useState(true);

    const [stored_path, set_stored_path] = useState("");

    const [show_more_payload, set_show_more_payload] = useState({
        limit: 52,
        page: 1,
        hasMore: false,
        count: 0,
    });


    // Admin Page [Cloned from user collection page]
    const [filters_admin, set_filters_admin] = useState([]);
    const [filter_options_admin, set_filter_options_admin] = useState({});
    const [fetched_products_for_collection_admin, set_fetched_products_for_collection_admin] = useState([]);
    const [products_for_collection_admin_loading, set_products_for_collection_admin_loading] = useState(true);
    const [stored_path_admin, set_stored_path_admin] = useState("");
    const [show_more_payload_admin, set_show_more_payload_admin] = useState({
        limit: 52,
        page: 1,
        hasMore: false,
        count: 0,
    });


    // View Order Modal Admin Page
    const [order_id, set_order_id] = useState("");
    const [orders, set_orders] = useState([]);
    const [dispatched_orders, set_dispatched_orders] = useState([]);

    // Product Page Client
    const [stored_product_id, set_stored_product_id] = useState("");

    // Update Product Page [Admin-Client]
    const [products_title, set_products_title] = useState([]);

    //<----------------------- API Calls and Handlers [Back-end] ----------------------->


    // API loader
    const [API_loading, set_API_loading] = useState(false);
    const [progress_of_loading, set_progress_of_loading] = useState({ status: false, value: 0 });



    // Create Product API
    const create_product_api = async (axios, data, set_is_loading, reset_states) => {
        // start loading
        set_is_loading(true);
        set_progress_of_loading({ status: true, value: 0 }); // Start progress

        // Initialize fake progress variables
        let progress = 0;
        const incrementSpeed = 100; // Milliseconds between updates (slower updates)
        const maxFakeProgress = 83; // Stop fake progress at 75%
        const incrementValue = 0.17; // Very small increment to make progress slow
        let interval;

        try {

            // Start fake progress
            interval = setInterval(() => {
                if (progress < maxFakeProgress) {
                    progress += incrementValue; // Increment randomly between 0-2%
                    set_progress_of_loading({
                        status: true,
                        value: Math.floor(Math.min(progress, maxFakeProgress)), // Ensure it stops at maxFakeProgress
                    });
                }
            }, incrementSpeed);


            // Perform the API call
            const response = await axios.post("/api/upload_bunnycdn_files", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const res = await axios.post("/api/create_product", response.data);

            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            })
            if (reset_states) {
                reset_states();
            };

            // Complete progress immediately
            set_progress_of_loading({ status: true, value: 100 });
        } catch (err) {

            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })

            set_progress_of_loading({ status: false, value: 0 });  // Reset on error
        } finally {

            // Cleanup and stop fake progress
            clearInterval(interval);
            setTimeout(() => {
                set_progress_of_loading({ status: false, value: 0 });
                set_is_loading(false);
            }, 500); // Delay hiding the loader slightly for smoother UX

            // finish loading
            set_is_loading(false);
        }
    };


    // Get Product API
    const get_product_api = async (axios, product_id, state, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_product?product_id=${product_id}`);
            if (state) {
                set_state(prev_state => ({ ...prev_state, ...res.data }))
            } else {
                set_state(res.data);
            }
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }


    // Get All Products API
    const get_all_products_api = async (axios, filters, set_state, set_show_more, set_is_loading, show_more) => {
        // start loading
        set_is_loading(true);
        try {
            let res;
            if (show_more) {
                res = await axios.get(`/api/get_all_products?${filters}&${show_more}`);
                set_state((prev) => ([...prev, ...res.data.products]));
            } else {
                res = await axios.get(`/api/get_all_products?${filters}`);
                set_state(res.data.products || []);
            };


            set_show_more(prev => ({
                ...prev,
                hasMore: res?.data?.meta?.hasMore,
                count: res?.data?.meta?.filteredCount,
                page: res?.data?.meta?.currentPage,
            }));
        } catch (err) {
            console.error(err);
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })

        } finally {
            // finish loading
            set_is_loading(false);
        }
    }


    // Get Filter Values
    const get_filter_values_api = async (axios, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get("/api/get_filter_values");
            set_state(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }

    // Get All Products Title API
    const get_all_products_title_api = async (axios, set_state, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_all_products_title`);
            set_state(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false);

        }
    };


    // Update Product API
    const update_product_api = async (axios, product_id, data, set_is_loading, reset_states) => {
        // start loading
        set_is_loading(true);
        set_progress_of_loading({ status: true, value: 0 }); // Start progress

        // Initialize fake progress variables
        let progress = 0;
        const incrementSpeed = 100; // Milliseconds between updates (slower updates)
        const maxFakeProgress = 83; // Stop fake progress at 75%
        const incrementValue = 0.17; // Very small increment to make progress slow
        let interval;
        try {

            // Start fake progress
            interval = setInterval(() => {
                if (progress < maxFakeProgress) {
                    progress += incrementValue; // Increment randomly between 0-2%
                    set_progress_of_loading({
                        status: true,
                        value: Math.floor(Math.min(progress, maxFakeProgress)), // Ensure it stops at maxFakeProgress
                    });
                }
            }, incrementSpeed);

            // Perform the API call
            const response = await axios.post("/api/upload_bunnycdn_files", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });


            const res = await axios.put(`/api/update_product?product_id=${product_id}`, response.data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });
            if (reset_states) {
                reset_states();
            };

            // Complete progress immediately
            set_progress_of_loading({ status: true, value: 100 });
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            });

            set_progress_of_loading({ status: false, value: 0 });  // Reset on error
        } finally {
            // Cleanup and stop fake progress
            clearInterval(interval);
            setTimeout(() => {
                set_progress_of_loading({ status: false, value: 0 });
                set_is_loading(false);
            }, 500); // Delay hiding the loader slightly for smoother UX

            // finish loading
            set_is_loading(false);
        }
    };


    // Delete Product API 
    const delete_product_api = async (axios, product_id, set_is_loading, reset_states, toggle, refetch_products_title) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.put(`/api/delete_product?product_id=${product_id}`);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            })
            if (reset_states) {
                reset_states();
            };
            if (toggle) {
                toggle();
            };
            if (refetch_products_title) {
                refetch_products_title();
            }
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Login API
    const login_api = async (axios, data, set_is_loading) => {
        set_is_loading(true)
        try {
            const res = await axios.post("/api/login", data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            })
            router.push("/admin");
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false)
        }
    }

    // Add User API
    const add_user_api = async (axios, data, set_is_loading) => {
        set_is_loading(true)
        try {
            const res = await axios.post("/api/signup", data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            })
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false)
        }
    }


    // Confirm Order API
    const confirm_order_api = async (axios, data, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.post("/api/confirm_order", data);

            set_snackbar_alert({
                open: true,
                message: "Your order has been confirmed!",
                severity: "success",
            });

            localStorage.removeItem("cart");
            set_cart([])

            router.push(`/checkouts/${res.data._id}`)

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false);
        }
    }


    // Delete Order API
    const delete_order_api = async (axios, order_id, cancel_order, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.delete(`/api/delete_order?order_id=${order_id}&${cancel_order || ""}`);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            })
            return true;

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            });
            return false;
        } finally {
            set_is_loading(false);
        }
    };


    // Update Order API
    const update_order_api = async (axios, order_id, data, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.put(`/api/update_order?order_id=${order_id}`, data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });

            return true;

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            });
            return false;
        } finally {
            set_is_loading(false);
        }
    };


    // Get Order API
    const get_order_api = async (axios, order_id, set_state, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_order?order_id=${order_id}`);
            set_state(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false);

        }
    };


    // Get All Orders API
    const get_all_orders_api = async (axios, query_params, set_state, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_all_orders?${query_params}`);
            set_state(res.data || []);
            return true;
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            });
            return false;
        } finally {
            set_is_loading(false);

        }
    }


    // Get Orders Analytics
    const get_orders_analytics_api = async (axios, set_state, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.get("/api/orders_analytics");
            set_state(res.data);
            return true;
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            });
            return false;
        } finally {
            set_is_loading(false);
        }
    }


    const get_trax_shipment_status = async (axios, tracking_no, set_state, set_is_loading) => {
        set_is_loading(true);
        try {
            const res = await axios.get(`https://sonic.pk/api/shipment/track/consignee/public?tracking_number=${tracking_no}`);
            if (res?.data?.status === 1) {
                set_state(Object.values(res.data.details)[0].tracking_history);
            }
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            });
        } finally {
            set_is_loading(false);
        }
    }


    return (
        <StateContext.Provider
            value={{
                snackbar_alert, set_snackbar_alert, close_snackbar,

                toggle_modal, modals_state,

                toggle_drawer, drawer_state,

                filters, set_filters, filter_options, set_filter_options,

                cart, set_cart, save_cart, sum_of_cart, delete_item_from_cart, add_item_to_cart,
                substract_item_from_cart,

                stored_product_id, set_stored_product_id,

                products_title, set_products_title,

                stored_path, set_stored_path,

                show_more_payload, set_show_more_payload,

                product_details, set_product_details, update_product_details,
                set_update_product_details, default_update_product_details, default_product_details,
                product_id, set_product_id,

                fetched_products_for_collection, set_fetched_products_for_collection,
                fetched_products_for_landing, set_fetched_products_for_landing,
                products_for_collection_loading, set_products_for_collection_loading,
                products_for_landing_loading, set_products_for_landing_loading,

                filters_admin, set_filters_admin, filter_options_admin, set_filter_options_admin,
                fetched_products_for_collection_admin, set_fetched_products_for_collection_admin,
                products_for_collection_admin_loading, set_products_for_collection_admin_loading, stored_path_admin, set_stored_path_admin,
                show_more_payload_admin, set_show_more_payload_admin,

                API_loading, set_API_loading,

                progress_of_loading, set_progress_of_loading,

                create_product_api, get_all_products_api, get_filter_values_api, update_product_api,
                delete_product_api, add_user_api, get_product_api, get_all_products_title_api,

                orders, set_orders, dispatched_orders, set_dispatched_orders, order_id, set_order_id,

                get_orders_analytics_api,

                login_api,

                confirm_order_api, delete_order_api, get_order_api, get_all_orders_api, update_order_api,

                get_trax_shipment_status,

            }}
        >
            {children}
        </StateContext.Provider>
    )
}

const useStateContext = () => useContext(StateContext);



export default useStateContext