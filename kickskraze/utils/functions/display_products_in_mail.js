import { select_thumbnail_from_media } from "./produc_fn"

export const purchase_items_displayer = (orders) => {


    const purchase_items_html_structure = orders.purchase.map(item => {

        // Variant-aware fields → fallback to base if no variant
        const size = item?.selectedVariant?.options?.size ?? item?.size ?? null;
        const color = item?.selectedVariant?.options?.color ?? item?.color ?? null;
        const brand = item.brand ?? null;
        const condition = (item.condition && item.condition !== "brand new") ? item.condition : null;

        return `
        <tr>
    <td align="left" class="esdev-adapt-off"
        style="Margin:0;padding-right:20px;padding-left:20px;padding-top:10px;padding-bottom:10px">
        <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
            <tr>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                            <td align="center" class="es-m-p0r" style="padding:0;Margin:0;width:70px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="center" style="padding:0;Margin:0;font-size:0px">
                                            <a target="_blank" href="https://kicks-kraze.com/product?product_id=${item._id}" style="mso-line-height-rule:exactly;         text-decoration:underline;color:#5C68E2;font-size:14px">
                                               <img src=${select_thumbnail_from_media(item.media)}
                                                    alt="" width="70" height="70" class="adapt-img"
                                                    style="display:block;font-size:14px;border:0;outline:none;text-decoration:none;object-fit:cover;">
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding:0;Margin:0;width:20px"></td>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                            <td align="center" style="padding:0;Margin:0;width:265px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                <strong>${item.title}</strong>
                                            </p>
                                        </td>
                                    </tr>




                                    <tr>
                                        <td align="left" style="padding:0;Margin:0;padding-top:5px">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"
                                            >
                                                ${size ? `Size: ${size}<br/>` : ""}
                                                ${color ? `Color: ${color}<br/>` : ""}
                                                ${brand ? `Brand: ${brand}<br/>` : ""}
                                                ${condition ? `Condition: ${condition}<br/>` : ""}
                                            </p>
                                        </td>
                                    </tr>






                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding:0;Margin:0;width:20px"></td>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                            <td align="left" style="padding:0;Margin:0;width:80px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="center" style="padding:0;Margin:0">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                x ${item.quantity}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding:0;Margin:0;width:20px"></td>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                        <tr>
                            <td align="left" style="padding:0;Margin:0;width:85px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="right" style="padding:0;Margin:0">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                Rs. ${item.price.toLocaleString("en-US")}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>
        
        `
    });




    return purchase_items_html_structure.join(" ");


}



