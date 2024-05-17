import { Response, Request } from "express";
const Nodemailer = require("nodemailer");

interface sendEmailToolProps {
    subject: string;
    html: string;
    to: string;
}

export default async ({ subject, html, to }: sendEmailToolProps) => {
    // Create a Nodemailer transporter
    const transporter = Nodemailer.createTransport({
        // SMTP configuration (you may need to change these settings)
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "programanadebem@gmail.com", // Your email address
            pass: "dyhv txrz vlfy tbri", // Your password
        },
    });

    const mailOptions = {
        from: "programanadebem@gmail.com",
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};
