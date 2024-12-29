import React, { useEffect, useState } from 'react'
import useStateContext from '@/context/ContextProvider';
import Create_menu from './utilities/Create_menu';
import Update_menu from './utilities/Update_menu';
import Update_section from './utilities/Update_section';

const Backup_page = () => {

    const { set_snackbar_alert, sidebar, handle_sidebar, data, set_data, default_data, } = useStateContext();

    const [helper_index, set_helper_index] = useState("");


    return (
        <div className='w-full px-[20px] pt-[20px] md:py-[40px] tracking-wider flex justify-center gap-12'>

            <div className='flex-[2] relative hidden lg:block' >
                <div className='flex flex-col shadow-md rounded-md tracking-widest text-stone-700 overflow-hidden text-[15px] transition-all sticky top-0'>
                    <button
                        onClick={() => handle_sidebar(set_data, "create-menu")}
                        className={`py-[16px] border-y px-[20px] border-b-stone-300 active:opacity-60 transition-all duration-300 ${sidebar === "create-menu" ? "bg-black text-white" : "bg white text-stone-900"}`}
                    >
                        CREATE MENU</button
                    >
                    <button
                        onClick={() => handle_sidebar(set_data, "update-menu")}
                        className={`py-[16px] border-b px-[20px] border-b-stone-300 active:opacity-60 transition-all duration-300 ${sidebar === "update-menu" ? "bg-black text-white" : "bg white text-stone-900"}`}
                    >
                        UPDATE MENU
                    </button>
                    <button
                        onClick={() => handle_sidebar(set_data, "update-section")}
                        className={`py-[16px] border-b px-[20px] border-b-stone-300 active:opacity-60 transition-all duration-300 ${sidebar === "update-section" ? "bg-black text-white" : "bg white text-stone-900"}`}
                    >
                        CREATE/UPDATE SECTION
                    </button>
                </div>
            </div>

            <div className='w-full flex-[4] flex flex-col items-center gap-6' >
                {sidebar === "create-menu" ?

                    <Create_menu
                        data={data}
                        set_data={set_data}
                        helper_index={helper_index}
                        set_helper_index={set_helper_index}
                        set_snackbar_alert={set_snackbar_alert}
                        default_data={default_data}
                    />
                    : sidebar === "update-menu" ?
                        <Update_menu
                            data={data}
                            set_data={set_data}
                            helper_index={helper_index}
                            set_helper_index={set_helper_index}
                            set_snackbar_alert={set_snackbar_alert}
                            default_data={default_data}
                        />
                        : sidebar === "update-section" ?
                            <Update_section
                                data={data}
                                set_data={set_data}
                                helper_index={helper_index}
                                set_helper_index={set_helper_index}
                                set_snackbar_alert={set_snackbar_alert}
                                default_data={default_data}
                            />
                            :
                            <></>
                }
            </div>


        </div >
    )
}

export default Backup_page