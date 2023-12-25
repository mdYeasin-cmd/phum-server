import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.node_env === "production",
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "yeasin200011@gmail.com",
            pass: config.gmail_app_password,
        },
    });

    await transporter.sendMail({
        from: "yeasin@cathome.sg", // sender address
        to, // list of receivers
        subject: "Reset password within 10 minutes!", // Subject line
        text: "Hello ki kbr password vule gaso vai!", // plain text body
        html, // html body
    });
};
