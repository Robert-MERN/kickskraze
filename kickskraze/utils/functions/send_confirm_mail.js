import nodemailer from "nodemailer";
import { mail_html_structure } from "./mail_html_structure";



export default async function send_confirm_mail(res, orders, mailType) {

    const subject = {
        create: "ORDER CONFIRMED",
        update: "ORDER UPDATED",
        status_update: "ORDER STATUS UPDATED",
        delete: "ORDER CANCELLED",
    }

    const { orderNumber, email } = orders;
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'ms.kickskraze@gmail.com',
                pass: 'wouyirchmpnlimsx'
            },
        });
        const mailOptions = {
            from: `KicksKraze <rackeragency@gmail.com>`,
            to: "ms.kickskraze@gmail.com",
            subject: `${subject[mailType]} #${orderNumber}`,
            html: mail_html_structure(orders, mailType)
        };

        if (mailType === "create") await transport.sendMail(mailOptions);
        await transport.sendMail({ ...mailOptions, to: email });

        return { success: true, message: "mail-sent" };
    } catch (err) {
        console.error(err)
        return { success: true, message: "mail-send-failed" };
    }

}

