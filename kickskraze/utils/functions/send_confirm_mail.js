import nodemailer from "nodemailer";
import { mail_html_structure } from "./mail_html_structure";



export default async function send_confirm_mail(res, orders) {

    const { _id, email } = orders;
    try {




        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'rackeragency@gmail.com',
                pass: 'phtspmtkanwfyhkc'
            },
        });
        const mailOptions = {
            from: `KicksKraze <rackeragency@gmail.com>`,
            to: "rackeragency@gmail.com",
            subject: `ORDER CONFIRMED #${_id}`,
            html: mail_html_structure(orders)
        };

        await transport.sendMail(mailOptions);
        await transport.sendMail({ ...mailOptions, to: email });

        return { success: true, message: "mail-sent" };
    } catch (err) {
        return res.status(501).json({ status: false, message: err.message });
    }

}

