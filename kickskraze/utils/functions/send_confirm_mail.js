import nodemailer from "nodemailer";
import { mail_html_structure } from "./mail_html_structure";



export default async function send_confirm_mail(res, orders) {

    const { _id, email } = orders;
    try {




        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'ms.kickskraze@gmail.com',
                pass: 'ccyqhgoqklxbsrzc'
            },
        });
        const mailOptions = {
            from: `KicksKraze <rackeragency@gmail.com>`,
            to: "ms.kickskraze@gmail.com",
            subject: `ORDER CONFIRMED #${_id}`,
            html: mail_html_structure(orders)
        };

        await transport.sendMail(mailOptions);
        await transport.sendMail({ ...mailOptions, to: email });

        return { success: true, message: "mail-sent" };
    } catch (err) {
        console.error(err)
        return { success: true, message: "mail-send-failed" };
    }

}

