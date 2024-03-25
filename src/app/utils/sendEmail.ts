import nodemailer from "nodemailer";
import configs from "../configs";

export const sendEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: configs.auth.email_sender,
      pass: configs.auth.email_sender_password,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Health Care 👻" <naimur.rezaa@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
