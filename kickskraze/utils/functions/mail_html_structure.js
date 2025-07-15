import { purchase_items_displayer } from "./display_products_in_mail";

export const mail_html_structure = (order, mailType) => {


  const order_status = (order) => {
    // If tracking number is unavailable
    const tracking_no_unavailable = "You'll be able to track your order once the tracking number is available.";

    // If tracking number is available
    const tracking_url = {
      trax: "https://trax.pk/tracking/",
      leapord: "https://www.leopardscourier.com",
    };
    const anchor_tag = `<strong>
      <a
        className='underline cursor-pointer'
        href=${tracking_url[order.courier_name]}
        target="_blank"
        style="mso-line-height-rule:exactly;text-decoration:underline;color:#999999;font-size:14px;text-transform: uppercase"
      >
        ${order.tracking_no}
      </a>
    </strong>`;
    const tracking_no_available = `You can track your order by clicking on this tracking id: ${anchor_tag}`

    // All Status
    const all_status = {
      booked: "your order is confirmed ✅. You'll be receiving the updates regarding the delivery status of your order once your order is dispatched.",
      in_transit: `your order is on the way 🚚. ${order.tracking_no ? tracking_no_available : tracking_no_unavailable}`,
      delivered: `your order is delivered 📦✅. ${order.tracking_no ? tracking_no_available : tracking_no_unavailable}`,
      rcp: `your order returned confirmation is pending ⏳. ${order.tracking_no ? tracking_no_available : tracking_no_unavailable}`,
      returned: `your order is returned 🔄. ${order.tracking_no ? tracking_no_available : tracking_no_unavailable}`,

    };
    return all_status[order.status];
  }

  const mail_messages = {
    create: {
      title: "Thank you for ordering!",
      message: "This email is to confirm&nbsp;your order. We have successfully received your order, we'll give you a confirmation call shortly.",
      view: true,
    },
    update: {
      title: "Your order has been updated!",
      message: "This email is to inform you that your order has been updated. Please find the revised order details below.",
      view: true,
    },
    status_update: {
      title: "Your order status has been updated!",
      message: `This email is to inform you that ${order_status(order)}`,
      view: true,
    },
    delete: {
      title: "Your order has been cancelled!",
      message: "Your order has been cancelled successfully. If you'd like to place a new order, please visit our website.",
      view: false,
    },
  }



  const { _id, email,
    special_instructions,
    firstName,
    lastName,
    city,
    postal_code,
    address,
    phone,
    delivery_charges,
    purchase,
    total_amount,
    total_items,
    payment_method,
    createdAt,
    updatedAt,
    orderNumber,
  } = order;


  // Calculator
  const calc_total_amount = (arr) => {
    return arr.reduce((prev, next) => prev + (next.price * next.quantity), 0);
  }


  const calc_gross_total_amount = (obj) => {
    return obj.purchase.reduce((prev, next) => prev + (next.price * next.quantity), 0) + Number(obj.delivery_charges);
  }


  const date_formatter = (date) => {
    // Create a Date object
    const dateObject = new Date(date);

    // Format the date and time with the Pakistan time zone
    const formattedDate = dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'Asia/Karachi'
    });

    const formattedTime = dateObject.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Karachi'
    });

    return `${formattedDate} [${formattedTime}]`;
  };


  const payment_methods = {
    cod: "Cash on Delivery (COD)",
    jazzcash: "Paid with JazzCash (JazzCash)",
    easypaisa: "Paid with EasyPaisa (EasyPaisa)",
    sadapay: "Paid with SadaPay (SadaPay)",
    nayapay: "Paid with NayaPay (NayaPay)",
    bank: "Paid via Bank Transfer (Bank)",
  };

  const copyright_year = new Date().getFullYear();

  const _html =
    `
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Order Confirmed</title><!--[if (mso 16)]>
                  <style type="text/css">
                    a {text-decoration: none;}
                  </style>
                  <![endif]--><!--[if gte mso 9]><style>sup {font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
                  <noscript>
                    <xml>
                      <o:OfficeDocumentSettings>
                        <o:AllowPNG></o:AllowPNG>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                      </o:OfficeDocumentSettings>
                    </xml>
                  </noscript>
                  <![endif]--><!--[if mso]><xml>
                    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
                      <w:DontUseAdvancedTypographyReadingMail />
                    </w:WordDocument>
                  </xml><![endif]-->
  <style type="text/css">
    .rollover:hover .rollover-first {
      max-height: 0px !important;
      display: none !important;
    }

    .rollover:hover .rollover-second {
      max-height: none !important;
      display: block !important;
    }

    .rollover span {
      font-size: 0px;
    }

    u+.body img~div div {
      display: none;
    }

    #outlook a {
      padding: 0;
    }

    span.MsoHyperlink,
    span.MsoHyperlinkFollowed {
      color: inherit;
      mso-style-priority: 99;
    }

    a.es-button {
      mso-style-priority: 100 !important;
      text-decoration: none !important;
    }

    a[x-apple-data-detectors],
    #MessageViewBody a {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
      mso-hide: all;
    }

    @media only screen and (max-width:600px) {
      .es-m-p0r {
        padding-right: 0px !important
      }

      .es-m-p0l {
        padding-left: 0px !important
      }

      .es-m-p20b {
        padding-bottom: 20px !important
      }

      .es-p-default {}

      *[class="gmail-fix"] {
        display: none !important
      }

      p,
      a {
        line-height: 150% !important
      }

      h1,
      h1 a {
        line-height: 120% !important
      }

      h2,
      h2 a {
        line-height: 120% !important
      }

      h3,
      h3 a {
        line-height: 120% !important
      }

      h4,
      h4 a {
        line-height: 120% !important
      }

      h5,
      h5 a {
        line-height: 120% !important
      }

      h6,
      h6 a {
        line-height: 120% !important
      }

      .es-header-body p {}

      .es-content-body p {}

      .es-footer-body p {}

      .es-infoblock p {}

      h1 {
        font-size: 36px !important;
        text-align: left
      }

      h2 {
        font-size: 26px !important;
        text-align: left
      }

      h3 {
        font-size: 20px !important;
        text-align: left
      }

      h4 {
        font-size: 24px !important;
        text-align: left
      }

      h5 {
        font-size: 20px !important;
        text-align: left
      }

      h6 {
        font-size: 16px !important;
        text-align: left
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 36px !important
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 26px !important
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px !important
      }

      .es-header-body h4 a,
      .es-content-body h4 a,
      .es-footer-body h4 a {
        font-size: 24px !important
      }

      .es-header-body h5 a,
      .es-content-body h5 a,
      .es-footer-body h5 a {
        font-size: 20px !important
      }

      .es-header-body h6 a,
      .es-content-body h6 a,
      .es-footer-body h6 a {
        font-size: 16px !important
      }

      .es-menu td a {
        font-size: 12px !important
      }

      .es-header-body p,
      .es-header-body a {
        font-size: 14px !important
      }

      .es-content-body p,
      .es-content-body a {
        font-size: 14px !important
      }

      .es-footer-body p,
      .es-footer-body a {
        font-size: 14px !important
      }

      .es-infoblock p,
      .es-infoblock a {
        font-size: 12px !important
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3,
      .es-m-txt-c h4,
      .es-m-txt-c h5,
      .es-m-txt-c h6 {
        text-align: center !important
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3,
      .es-m-txt-r h4,
      .es-m-txt-r h5,
      .es-m-txt-r h6 {
        text-align: right !important
      }

      .es-m-txt-j,
      .es-m-txt-j h1,
      .es-m-txt-j h2,
      .es-m-txt-j h3,
      .es-m-txt-j h4,
      .es-m-txt-j h5,
      .es-m-txt-j h6 {
        text-align: justify !important
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3,
      .es-m-txt-l h4,
      .es-m-txt-l h5,
      .es-m-txt-l h6 {
        text-align: left !important
      }

      .es-m-txt-r img,
      .es-m-txt-c img,
      .es-m-txt-l img {
        display: inline !important
      }

      .es-m-txt-r .rollover:hover .rollover-second,
      .es-m-txt-c .rollover:hover .rollover-second,
      .es-m-txt-l .rollover:hover .rollover-second {
        display: inline !important
      }

      .es-m-txt-r .rollover span,
      .es-m-txt-c .rollover span,
      .es-m-txt-l .rollover span {
        line-height: 0 !important;
        font-size: 0 !important;
        display: block
      }

      .es-spacer {
        display: inline-table
      }

      a.es-button,
      button.es-button {
        font-size: 20px !important;
        padding: 10px 20px 10px 20px !important;
        line-height: 120% !important
      }

      a.es-button,
      button.es-button,
      .es-button-border {
        display: inline-block !important
      }

      .es-m-fw,
      .es-m-fw.es-fw,
      .es-m-fw .es-button {
        display: block !important
      }

      .es-m-il,
      .es-m-il .es-button,
      .es-social,
      .es-social td,
      .es-menu {
        display: inline-block !important
      }

      .es-adaptive table,
      .es-left,
      .es-right {
        width: 100% !important
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100% !important;
        max-width: 600px !important
      }

      .adapt-img {
        width: 100% !important;
        height: auto !important
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none !important
      }

      .es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important
      }

      tr.es-desk-hidden {
        display: table-row !important
      }

      table.es-desk-hidden {
        display: table !important
      }

      td.es-desk-menu-hidden {
        display: table-cell !important
      }

      .es-menu td {
        width: 100% !important
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto !important
      }

      .h-auto {
        height: auto !important
      }

      .img-4512 {
        width: 200px !important
      }

      a.es-button.es-button-3343 {
        font-size: 16px !important
      }

      .es-text-5775 .es-text-mobile-size-26.es-override-size,
      .es-text-5775 .es-text-mobile-size-26.es-override-size * {
        font-size: 26px !important;
        line-height: 150% !important
      }
    }

    @media screen and (max-width:384px) {
      .mail-message-content {
        width: 414px !important
      }
    }



    @media only screen and (max-width:600px) {
      .es-m-p0r {
        padding-right: 0px !important
      }

      .es-m-p0l {
        padding-left: 0px !important
      }

      .es-m-p20b {
        padding-bottom: 20px !important
      }

      .es-p-default {}

      *[class="gmail-fix"] {
        display: none !important
      }

      p,
      a {
        line-height: 150% !important
      }

      h1,
      h1 a {
        line-height: 120% !important
      }

      h2,
      h2 a {
        line-height: 120% !important
      }

      h3,
      h3 a {
        line-height: 120% !important
      }

      h4,
      h4 a {
        line-height: 120% !important
      }

      h5,
      h5 a {
        line-height: 120% !important
      }

      h6,
      h6 a {
        line-height: 120% !important
      }

      .es-header-body p {}

      .es-content-body p {}

      .es-footer-body p {}

      .es-infoblock p {}

      h1 {
        font-size: 36px !important;
        text-align: left
      }

      h2 {
        font-size: 26px !important;
        text-align: left
      }

      h3 {
        font-size: 20px !important;
        text-align: left
      }

      h4 {
        font-size: 24px !important;
        text-align: left
      }

      h5 {
        font-size: 20px !important;
        text-align: left
      }

      h6 {
        font-size: 16px !important;
        text-align: left
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 36px !important
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 26px !important
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px !important
      }

      .es-header-body h4 a,
      .es-content-body h4 a,
      .es-footer-body h4 a {
        font-size: 24px !important
      }

      .es-header-body h5 a,
      .es-content-body h5 a,
      .es-footer-body h5 a {
        font-size: 20px !important
      }

      .es-header-body h6 a,
      .es-content-body h6 a,
      .es-footer-body h6 a {
        font-size: 16px !important
      }

      .es-menu td a {
        font-size: 12px !important
      }

      .es-header-body p,
      .es-header-body a {
        font-size: 14px !important
      }

      .es-content-body p,
      .es-content-body a {
        font-size: 14px !important
      }

      .es-footer-body p,
      .es-footer-body a {
        font-size: 14px !important
      }

      .es-infoblock p,
      .es-infoblock a {
        font-size: 12px !important
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3,
      .es-m-txt-c h4,
      .es-m-txt-c h5,
      .es-m-txt-c h6 {
        text-align: center !important
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3,
      .es-m-txt-r h4,
      .es-m-txt-r h5,
      .es-m-txt-r h6 {
        text-align: right !important
      }

      .es-m-txt-j,
      .es-m-txt-j h1,
      .es-m-txt-j h2,
      .es-m-txt-j h3,
      .es-m-txt-j h4,
      .es-m-txt-j h5,
      .es-m-txt-j h6 {
        text-align: justify !important
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3,
      .es-m-txt-l h4,
      .es-m-txt-l h5,
      .es-m-txt-l h6 {
        text-align: left !important
      }

      .es-m-txt-r img,
      .es-m-txt-c img,
      .es-m-txt-l img {
        display: inline !important
      }

      .es-m-txt-r .rollover:hover .rollover-second,
      .es-m-txt-c .rollover:hover .rollover-second,
      .es-m-txt-l .rollover:hover .rollover-second {
        display: inline !important
      }

      .es-m-txt-r .rollover span,
      .es-m-txt-c .rollover span,
      .es-m-txt-l .rollover span {
        line-height: 0 !important;
        font-size: 0 !important;
        display: block
      }

      .es-spacer {
        display: inline-table
      }

      a.es-button,
      button.es-button {
        font-size: 20px !important;
        padding: 10px 20px 10px 20px !important;
        line-height: 120% !important
      }

      a.es-button,
      button.es-button,
      .es-button-border {
        display: inline-block !important
      }

      .es-m-fw,
      .es-m-fw.es-fw,
      .es-m-fw .es-button {
        display: block !important
      }

      .es-m-il,
      .es-m-il .es-button,
      .es-social,
      .es-social td,
      .es-menu {
        display: inline-block !important
      }

      .es-adaptive table,
      .es-left,
      .es-right {
        width: 100% !important
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100% !important;
        max-width: 600px !important
      }

      .adapt-img {
        width: 100% !important;
        height: auto !important
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none !important
      }

      .es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important
      }

      tr.es-desk-hidden {
        display: table-row !important
      }

      table.es-desk-hidden {
        display: table !important
      }

      td.es-desk-menu-hidden {
        display: table-cell !important
      }

      .es-menu td {
        width: 100% !important
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto !important
      }

      .h-auto {
        height: auto !important
      }

      .img-4512 {
        width: 200px !important
      }

      a.es-button.es-button-3343 {
        font-size: 16px !important
      }

      .es-text-5775 .es-text-mobile-size-26.es-override-size,
      .es-text-5775 .es-text-mobile-size-26.es-override-size * {
        font-size: 26px !important;
        line-height: 150% !important
      }


    }

    @media screen and (max-width:384px) {
      .mail-message-content {
        width: 414px !important
      }
    }
  </style>
</head>

<body class="body"
  style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"><!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                      <v:fill type="tile" color="#fafafa"></v:fill>
                    </v:background>
                    <![endif]-->
    <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none"
      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
      <tr>
        <td valign="top" style="padding:0;Margin:0">


          <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-content-body"
                  role="none"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:15px;padding-right:20px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center"
                                  style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><a
                                    target="_blank" href="https://kicks-kraze.com"
                                    style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px"><img
                                      src="https://kicks-kraze.com/images/logo.png" alt="" width="320" title="Logo"
                                      class="img-4512"
                                      style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-text-5775" style="padding:0;Margin:0;padding-bottom:10px">
                                  <h2 class="es-m-txt-c es-override-size es-text-mobile-size-24"
                                    style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:42px;font-style:normal;font-weight:bold;line-height:42px;color:#333333">
                                    ${mail_messages[mailType].title}</h2>
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
          </table>


          <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
            <tr>
              <td align="center" style="padding:0;Margin:0">


                <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-content-body"
                  role="none"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left" style="padding:20px;Margin:0">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0">
                                  <h6 class="es-m-txt-c"
                                    style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19.2px;color:#333333">
                                   
                                    ${mail_messages[mailType].view ?

      `<strong>Order&nbsp;<a target="_blank" href="https://kicks-kraze.com/checkouts/${_id}"
                                      style="mso-line-height-rule:exactly;text-decoration:underline;color:#999999;font-size:16px;text-transform: uppercase">#${orderNumber}</a> </strong>`
      :
      `<strong>Order&nbsp;<span
                                      style="mso-line-height-rule:exactly;text-decoration:underline;color:#999999;font-size:16px;text-transform: uppercase">#${orderNumber}</span> </strong>`
    }
                                  </h6>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-p0r es-m-p0l"
                                  style="Margin:0;padding-top:5px;padding-right:40px;padding-bottom:5px;padding-left:40px">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    ${date_formatter(updatedAt)}</p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-p0r es-m-p0l"
                                  style="Margin:0;padding-top:5px;padding-right:40px;padding-left:40px;padding-bottom:15px">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    ${mail_messages[mailType].message}
                                    </p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0"><span class="es-button-border"
                                    style="border-style:solid;border-color:#e11d48;background:#e11d48;border-width:2px;display:inline-block;border-radius:6px;width:auto">
                                    ${mail_messages[mailType].view ?
      `<a
                                      href="https://kicks-kraze.com/checkouts/${_id}" target="_blank"
                                      class="es-button es-button-3343"
                                      style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#ffffff;font-size:18px;padding:10px 30px 10px 30px;display:inline-block;background:#e11d48;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:21.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #e11d48;border-left-width:30px;border-right-width:30px">View
                                      your order</a>`
      :
      `<a
                                      href="https://kicks-kraze.com" target="_blank"
                                      class="es-button es-button-3343"
                                      style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#ffffff;font-size:18px;padding:10px 30px 10px 30px;display:inline-block;background:#e11d48;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:21.6px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #e11d48;border-left-width:30px;border-right-width:30px">Visit
                                      store</a>`
    }
                                      
                                      </span></td>
                                      </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>





                  ${purchase_items_displayer(order)}





                  <tr style="width:100%">
                    <td align="left"
                      style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:10px;width:100%;">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" class="es-m-p0r" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-top:2px solid #efefef;border-bottom:2px solid #efefef"
                              role="presentation">
                              <tr>
                                <td align="right" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px">
                                  <p class="es-m-txt-r"
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Subtotal: <strong>Rs.
                                      ${calc_total_amount(purchase).toLocaleString("en-US")}</strong>
                                    <br>

                                    ${delivery_charges ? `
                                    Delivery: <strong>Rs.</strong>
                                    <strong>${delivery_charges.toLocaleString("en-US")}</strong>
                                  </p>

                                  `: ``}


                                  <p class="es-m-txt-r"
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    <strong></strong>Total: <strong>Rs.</strong>
                                    <strong>${calc_gross_total_amount(order).toLocaleString("en-US")}</strong>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>




                  ${special_instructions ?

      `
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:10px;padding-top:20px"><!--[if mso]>

                      <table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:280px" valign="top">
                        <![endif]-->


                      <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td align="center" class="es-m-p0r es-m-p20b" style="padding:0;Margin:0;width:280px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:0;Margin:0">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Special Instructions: &nbsp;<strong
                                      style="text-transform: capitalize;">${special_instructions}</strong>

                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>


                  `

      :
      ``


    }





                  <tr>
                    <td align="left"
                      style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:10px;padding-top:20px"><!--[if mso]>

                                          <table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:280px" valign="top">
                                            <![endif]-->


                      <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td align="center" class="es-m-p0r es-m-p20b" style="padding:0;Margin:0;width:280px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:0;Margin:0">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Customer: <strong>${firstName} ${lastName}</strong></p>
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    email:&nbsp;<strong><a style="text-decoration:none;color:inherit;" target="_blank"
                                        href="mailto:${email}">${email}</a></strong></p>
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Contact:&nbsp;<strong><a style="text-decoration:none;color:inherit;" target="_blank"
                                        href="tel:+92${phone.slice(1)}">${phone}</a></strong></p>
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Order no:&nbsp;<strong style="text-transform: uppercase;">#${orderNumber}</strong></p>
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Invoice date:&nbsp;<strong>${date_formatter(createdAt)}</strong></p>
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Payment method: <strong>${payment_methods[payment_method]}</strong></p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                      </table>
                      <!--[if mso]>

                                          </td>



                                            <td style="width:0px"></td>
                                            <td style="width:280px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                        <tr>
                          <td align="center" class="es-m-p0r" style="padding:0;Margin:0;width:280px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:0;Margin:0">

                                  <p class="es-m-txt-l"
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Delivery address: <strong> ${address}</strong>
                                  </p>

                                  <p class="es-m-txt-l"
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    <strong>${postal_code ? `${postal_code}, ` : ""} ${city},<br>Pakistan
                                    </strong>

                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso]>
                                            </td>
                                          </tr>
                                          </table>
                                          <![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-top:15px;padding-right:20px;padding-left:20px;padding-bottom:10px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                    Got a question?&nbsp;Email us at <a target="_blank"
                                      href="mailto:ms.kickskraze@gmail.com?subject=Need%20a%20Help%20From%20Support&body=I%27d%20like%20to%20inform%20you..."
                                      style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px">ms.kickskraze@gmail.com</a>
                                    or give us a call at <a target="_blank" href="tel:+923102223511"
                                      style="mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px">+92
                                      310 2223 511</a>..</p>
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
          </table>


          <table cellpadding="0" cellspacing="0" align="center" class="es-footer" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" style="padding:0;Margin:0">


                <table align="center" cellpadding="0" cellspacing="0" class="es-footer-body"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px"
                  role="none">
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:20px;padding-top:20px">


                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:600px">


                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" class="es-m-txt-c"
                                  style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0">
                                  <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><a
                                          target="_blank"
                                          href="https://www.facebook.com/share/152nJBR4YZ/?mibextid=wwXIfr"
                                          style="mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img
                                            title="Facebook"
                                            src="https://erxznja.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png"
                                            alt="Fb" width="32" height="32"
                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a>
                                      </td>
                                      <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><a
                                          target="_blank"
                                          href="https://www.instagram.com/kickskraze.pk?igsh=Z3dvcDk3eXRlN3Z1&utm_source=qr"
                                          style="mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img
                                            title="Instagram"
                                            src="https://erxznja.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png"
                                            alt="Inst" width="32" height="32"
                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0;padding-bottom:35px">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">
                                    KicksKraze © ${copyright_year} All Rights Reserved.</p>
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">
                                    Chishti Naggar, Sector-11-1/2, Orangi Town, Sindh, Karachi,
                                    Pakistan.</p>
                                </td>
                              </tr>


                              <tr>
                                <td style="padding:0;Margin:0">
                                  <table cellpadding="0" cellspacing="0" width="100%" class="es-menu"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr class="links">
                                      <td align="center" valign="top" width="100.00%"
                                        style="Margin:0;border:0;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px">
                                        <div style="vertical-align:middle;display:block">
                                          <a target="_blank" href="https://kicks-kraze.com"
                                            style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#999999;font-size:12px">
                                            Visit Us
                                          </a>
                                        </div>
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
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>`


  return _html
}