import nodemailer from "nodemailer";
import { LoginSecret } from "./Mailtemplates";
//@ts-ignore
import sgTransport from "nodemailer-sendgrid-transport";

const options = {
  service: "SendGrid",
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD,
  },
};

export const Mails = {
  async LoginSecreteMail(user: any, Key: string = "") {
    const mailer = nodemailer.createTransport(sgTransport(options));
    const mailOptions: any = {
      to: user.email,
      from: "naperg@imran-irshad.io",
      subject: "Welcome To My Website",
      html: LoginSecret(user, Key),
    };
    return mailer.sendMail(mailOptions, function(err: any, info: any) {
      if (err) {
        console.log(err);
      } else {
        console.log("Message sent: " + info.response);
      }
    });
  },
};
