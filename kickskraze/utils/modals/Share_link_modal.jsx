'use client'
import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';



const Share_link_modal = ({
    modals_state,
    toggle_modal,
    set_snackbar_alert,
}) => {

    const router = useRouter();

    const [url, set_url] = useState("")
    const copy_to_clipboard = async (text, msg) => {
        try {
            await navigator.clipboard.writeText(text);
            set_snackbar_alert({
                open: true,
                message: msg ?? "Copied!",
                severity: "primary",
            })

        } catch (err) {
            console.error("Failed to copy text: ", err);
            set_snackbar_alert({
                open: true,
                message: "Failed to copy!",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        if (window) {
            set_url(window.location);
        }
    }, []);





    return (
        <Dialog
            open={modals_state.share_link_modal}
            onClose={() => toggle_modal("share_link_modal")}
        >
            <div className='w-full md:w-[500px]' >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50 mb-[10px]' >
                    <p className='text-[15px] md:text-[18px] font-medium text-stone-700 flex items-center gap-2'>
                        <ShareIcon className='text-[18px]' />
                        Share
                    </p>
                    <IconButton onClick={() => toggle_modal("share_link_modal")}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>

                <div className='px-[20px] mb-[16px] flex gap-4 items-center'>
                    <input
                        value={url}
                        disabled
                        readOnly
                        onFocus={(e) => {
                            setTimeout(() => e.target.select(), 0); // Ensures text selection works
                        }}
                        className="text-[13px] rounded-md md:text-[16px] text-stone-500 font-medium p-[8px] border border-stone-400 cursor-text w-full"
                    />

                    <button
                        className='py-[8px] px-[12px] bg-black text-stone-100 rounded-md active:opacity-55 transition-all'
                        onClick={() => copy_to_clipboard(url, "Link copied!")}
                    >
                        <ContentCopyIcon className='text-[17px]' />
                    </button>
                </div>


                <div className='w-full flex justify-end gap-3 p-[20px] border-t border-stone-300' >
                    <button onClick={() => toggle_modal("share_link_modal")} className='bg-slate-200 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-stone-700 text-[12px] font-medium md:text-[15px] transition-all' >Cancel</button>
                    <button
                        onClick={() => {
                            copy_to_clipboard(url, "Link copied!");
                            toggle_modal("share_link_modal")
                        }}
                        className='bg-blue-500 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-white text-[12px] font-medium md:text-[15px] transition-all' >
                        Share
                    </button>
                </div>

            </div>
        </Dialog>
    )
}

export default Share_link_modal