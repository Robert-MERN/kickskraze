export const add_option = (set_options, index, set_index) => {

    const option = {
        option_name: "",
        values: [
            {
                option_value: "",
                option_price: "",
                values_error: "",
            },
        ],
        is_added: false,
        option_error: "",
    }

    set_options((prev_options) => {

        if (prev_options.options.length) {


            const copy_options = [...prev_options.options];

            // When you leave the Option Name and Option Value input booth empty and this logic will check both one by one
            if (!copy_options.at(index).option_name) {

                // It will check whether the option values are available or only Option name is missing
                if (copy_options.at(index).values.length > 1 && !copy_options.at(index).values.at(-1).option_value) {
                    copy_options.at(index).values.splice(-1, 1);

                    if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {

                        const copy_values = copy_options.at(index).values;
                        const updated_copy_values = copy_values.map(e => {
                            if (!e.option_value) {
                                return { ...e, values_error: "Enter option value" }
                            } else {
                                return { ...e, values_error: "" }
                            }
                        });

                        copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
                    }
                } else if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {
                    const copy_values = copy_options.at(index).values;
                    const updated_copy_values = copy_values.map(e => {
                        if (!e.option_value) {
                            return { ...e, values_error: "Enter option value" }
                        } else {
                            return { ...e, values_error: "" }
                        }
                    });

                    copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
                };

                const updated_option_error = { ...copy_options.at(index), option_error: "Enter Option Name" };
                copy_options.splice(index, 1, updated_option_error);


                return { ...prev_options, options: copy_options };
            }


            // When you leave the Option Value input empty and click on Add button. This same logic is written again in order to check what if the user fills up the Option Name but leave only Option Value input so, this logic will work here.
            if (copy_options.at(index).values.length > 1 && !copy_options.at(index).values.at(-1).option_value) {
                copy_options.at(index).values.splice(-1, 1);
                if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {
                    const copy_values = copy_options.at(index).values;
                    const updated_copy_values = copy_values.map(e => {
                        if (!e.option_value) {
                            return { ...e, values_error: "Enter option value" }
                        } else {
                            return { ...e, values_error: "" }
                        }
                    });

                    copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
                    return { ...prev_options, options: copy_options };
                }
            } else if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {
                const copy_values = copy_options.at(index).values;
                const updated_copy_values = copy_values.map(e => {
                    if (!e.option_value) {
                        return { ...e, values_error: "Enter option value" }
                    } else {
                        return { ...e, values_error: "" }
                    }
                });

                copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
                return { ...prev_options, options: copy_options };
            };

            // When Option Name and Option Value is provided then Add the option

            // Fixing option values
            const fixing_copy_values = copy_options.at(index).values;
            const fixing_updated_copy_values = fixing_copy_values.map(e => {
                if (!e.option_value) {
                    return { ...e, values_error: "Enter option value" }
                } else {
                    return { ...e, values_error: "" }
                }
            });

            const updated_option = {
                ...copy_options.at(index),
                is_added: true,
                values: fixing_updated_copy_values,
                option_error: "",
            };

            // setting preserved index back to "undefined"
            set_index("");

            copy_options.splice(index, 1, updated_option);

            return { ...prev_options, options: [...copy_options, option] };
        } else {

            // setting preserved index back to "undefined"
            set_index("");

            return { ...prev_options, options: [...prev_options.options, option] };

        }
    })


};

export const handle_change_options = (event, set_options, index, index_2) => {
    const { name, value } = event.target;

    set_options((prev_options) => {
        const copy_options = [...prev_options.options];


        // Changing values for option_value, option_price
        if (index_2 !== undefined) {
            const updated_values = { ...copy_options.at(index).values[index_2], [name]: value };
            copy_options.at(index).values.splice(index_2, 1, updated_values);


            // Removing Current Option if empty
            if (!copy_options.at(index).values[index_2].option_value && copy_options.at(index).values.length > 1) {
                copy_options.at(index).values.splice(index_2, 1);
            }

            // Adding New Option
            if (copy_options.at(index).values.at(-1).option_value) {
                copy_options.at(index).values.push({
                    option_value: "",
                    option_price: "",
                    values_error: "",
                })
            };



        } else if (index !== undefined) {
            // Changing values for option_name
            const updated_option = { ...copy_options.at(index), [name]: value };
            copy_options.splice(index, 1, updated_option);
        } else if (name === "menu_image" || name === "banner_image") {
            // Changing values for menu_image & banner_image
            const file = event.target.files[0];
            return { ...prev_options, [name]: Boolean(file) ? URL.createObjectURL(file) : file }
        } else {
            // Changing values for section_name, menu_title, price, comp_price, desc
            return { ...prev_options, [name]: value }
        }


        return { ...prev_options, options: copy_options };
    })



}

export const delete_option_values = (set_options, index, index_2) => {
    set_options((prev_options) => {
        const copy_options = [...prev_options.options];
        copy_options.at(index).values.splice(index_2, 1);
        return { ...prev_options, options: copy_options };
    });

}

export const save_option = (set_options, index, set_index) => {
    set_options((prev_options) => {
        const copy_options = [...prev_options.options];

        // When you leave the Option Name and Option Value input booth empty and this logic will check both one by one
        if (!copy_options.at(index).option_name) {

            // It will check whether the option values are available or only Option name is missing
            if (copy_options.at(index).values.length > 1 && !copy_options.at(index).values.at(-1).option_value) {
                copy_options.at(index).values.splice(-1, 1);

                if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {

                    const copy_values = copy_options.at(index).values;
                    const updated_copy_values = copy_values.map(e => {
                        if (!e.option_value) {
                            return { ...e, values_error: "Enter option value" }
                        } else {
                            return { ...e, values_error: "" }
                        }
                    });

                    copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
                }
            } else if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {
                const copy_values = copy_options.at(index).values;
                const updated_copy_values = copy_values.map(e => {
                    if (!e.option_value) {
                        return { ...e, values_error: "Enter option value" }
                    } else {
                        return { ...e, values_error: "" }
                    }
                });

                copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
            };

            const updated_option_error = { ...copy_options.at(index), option_error: "Enter Option Name" };
            copy_options.splice(index, 1, updated_option_error);

            return { ...prev_options, options: copy_options };
        }


        // When you leave the Option Value input empty and click on Add button. This same logic is written again in order to check what if the user fills up the Option Name but leave only Option Value input so, this logic will work here.
        if (copy_options.at(index).values.length > 1 && !copy_options.at(index).values.at(-1).option_value) {
            copy_options.at(index).values.splice(-1, 1);
            if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {
                const copy_values = copy_options.at(index).values;
                const updated_copy_values = copy_values.map(e => {
                    if (!e.option_value) {
                        return { ...e, values_error: "Enter option value" }
                    } else {
                        return { ...e, values_error: "" }
                    }
                });

                copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
                return { ...prev_options, options: copy_options };
            }
        } else if (!copy_options.at(index).values.every(e => Boolean(e.option_value) === true)) {
            const copy_values = copy_options.at(index).values;
            const updated_copy_values = copy_values.map(e => {
                if (!e.option_value) {
                    return { ...e, values_error: "Enter option value" }
                } else {
                    return { ...e, values_error: "" }
                }
            });

            copy_options.splice(index, 1, { ...copy_options.at(index), values: updated_copy_values });
            return { ...prev_options, options: copy_options };
        };

        // When Option Name and Option Value is provided then Add the option
        // Fixing option values
        const fixing_copy_values = copy_options.at(index).values;
        const fixing_updated_copy_values = fixing_copy_values.map(e => {
            if (!e.option_value) {
                return { ...e, values_error: "Enter option value" }
            } else {
                return { ...e, values_error: "" }
            }
        });

        const updated_option = {
            ...copy_options.at(index),
            is_added: true,
            values: fixing_updated_copy_values,
            option_error: "",
        };

        // setting preserved index back to "undefined"
        set_index("");

        copy_options.splice(index, 1, updated_option);

        return { ...prev_options, options: copy_options };
    });

}



export const edit_option = (set_options, index, set_index) => {
    let real_time_index = index;


    set_options((prev_options) => {

        let copy_options = [...prev_options.options];

        if (!copy_options.at(-1).option_name) {
            // Deleting the last inputs from the options array if there's extra option's inputs available
            copy_options.splice(-1, 1);
        }

        // Preventing extra options to be opened to edit when clicking on edit buttons
        copy_options = copy_options.map(each => {
            return {
                ...each,
                is_added: true,
            }
        });

        // Preventing extra empty option values to be saved when clicking on edit button
        for (let i = 0; i < copy_options.length; i++) {
            if (!copy_options.at(i).option_name) {
                copy_options.splice(i, 1);
                real_time_index - 1

            } else if (copy_options.at(i).option_name) {
                if (copy_options.at(i).values.length > 1 && !copy_options.at(i).values.at(-1).option_value) {
                    // deleted extra value 
                    copy_options.at(i).values.splice(-1, 1);
                    if (copy_options.at(i).values.every(e => e.option_value === false)) {
                        copy_options.splice(i, 1);
                        if (i < real_time_index) {
                            real_time_index - 1
                        }
                    }

                } else if (copy_options.at(i).values.length === 1 && !copy_options.at(i).values.at(-1).option_value) {
                    copy_options.splice(i, 1);
                    if (i < real_time_index) {
                        real_time_index - 1
                    }
                }
            }
        };

        // Enabling the edit mode for targetted item
        const updated_option = {
            ...copy_options.at(real_time_index),
            is_added: false,
            values: [
                ...copy_options.at(real_time_index).values,
                {
                    option_value: "",
                    option_price: "",
                    values_error: "",
                }
            ]
        };

        // Preserving index
        set_index(real_time_index);

        copy_options.splice(real_time_index, 1, updated_option);

        return { ...prev_options, options: copy_options };
    });

};



export const delete_option = (set_options, index, set_index) => {
    set_options((prev_options) => {
        const copy_options = [...prev_options.options];

        copy_options.splice(index, 1);

        set_index(prev_index => {
            if (prev_index !== "" && prev_index > index) {
                return prev_index - 1;
            }
            return prev_index;
        })

        return { ...prev_options, options: copy_options };
    })
}
