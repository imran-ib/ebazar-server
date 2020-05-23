import nodemailer from "nodemailer";
import {
  ContactFormMail,
  SellerVerification,
  ForgotPasswordUser,
  ForgotPasswordSeller,
} from "./Mailtemplates";
//@ts-ignore
import sgTransport from "nodemailer-sendgrid-transport";
import { Seller, User } from "@prisma/client";

const options = {
  service: "SendGrid",
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD,
  },
};

export const Mails = {
  async ForgotPasswordUser(user: User, token: string) {
    const mailer = nodemailer.createTransport(sgTransport(options));
    const mailOptions: any = {
      to: user.email,
      from: "noreply@imran-irshad.io",
      subject: "ebazar User Account Verification Key",
      html: ForgotPasswordUser(user, token),
    };
    return mailer.sendMail(mailOptions, function (err: any, info: any) {
      if (err) {
        console.log(err);
      } else {
        console.log("Message sent: " + info.response);
      }
    });
  },
  async ForgotPasswordSeller(seller: Seller, token: string) {
    const mailer = nodemailer.createTransport(sgTransport(options));
    const mailOptions: any = {
      to: seller.email,
      from: "noreply@imran-irshad.io",
      subject: "ebazar Seller Password Reset Link",
      html: ForgotPasswordSeller(seller, token),
    };
    return mailer.sendMail(mailOptions, function (err: any, info: any) {
      if (err) {
        console.log(err);
      } else {
        console.log("Message sent: " + info.response);
      }
    });
  },

  async SellerVerificationToken(seller: Seller, token: string) {
    const mailer = nodemailer.createTransport(sgTransport(options));
    const mailOptions: any = {
      to: seller.email,
      from: "noreply@imran-irshad.io",
      subject: "ebazar Seller Account Verification Key",
      html: SellerVerification(seller, token),
    };
    return mailer.sendMail(mailOptions, function (err: any, info: any) {
      if (err) {
        console.log(err);
      } else {
        console.log("Message sent: " + info.response);
      }
    });
  },
  async ContactForm(email: string, subject: string, message: string) {
    const mailer = nodemailer.createTransport(sgTransport(options));
    const mailOptions: any = {
      to: "imran123irshad@gmail.com",
      from: email,
      subject: subject,
      html: ContactFormMail(email, message),
    };
    return mailer.sendMail(mailOptions, function (err: any, info: any) {
      if (err) {
        console.log(err);
      } else {
        console.log("Message sent: " + info.response);
      }
    });
  },
};
