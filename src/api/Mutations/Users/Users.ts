import { Context } from "./../../../context";
import { GenerateToken } from "../../../Utils/JWT/GenerateJwt";
import { User } from "@prisma/client";
import { stringArg } from "@nexus/schema";
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core";
import { validateEmail } from "../../../Utils/Mails/ValidateEmail";
import { Mails } from "../../../Utils/Mails/SendMail";
import { Hash, ComparePassword } from "../../../Utils/bcryptJs/HashPassword";
import { PrismaClient } from "@prisma/client";
import { uid } from "rand-token";
import { UserAuthResolver } from "../../../Utils/Auth/AuthResolver";
const prisma = new PrismaClient();

export const USERS = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("CreateUser", {
    type: "String",
    args: {
      email: stringArg({ required: true }),
      password: stringArg({ required: true }),
      avatar: stringArg({ required: false }),
      name: stringArg({ required: true }),
    },
    description: "Create New User",

    //@ts-ignore
    resolve: async (parent: any, args, ctx: Context, info: any) => {
      try {
        // Validate Email
        let email: string = args.email;
        const ValidEmail: Boolean = validateEmail(email);
        if (!ValidEmail) {
          throw new Error(`The Email Address You Provided is Invalid.`);
        }
        // find the User
        const userExists: User | null = await prisma.user.findOne({
          where: {
            email: args.email,
          },
        });
        // if User Exists Throw Error
        if (userExists) {
          throw new Error(`User With Email: ${email}  Already Exists.?`);
        }
        //if Password is short throw Error
        if (args.password.length < 4) {
          throw new Error(`Password is Too Short`);
        }
        // hash password
        let password: string = args.password;
        const hashedPassword: string = await Hash(password);
        // create User with Valid Email And hashed Password
        const USER: User = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            permissions: "NONE",
            name: args.name,
            avatar: args.avatar,
          },
        });
        // login User
        // User can Login After creating Account But Seller must be Verified Before Login
        const token: string = GenerateToken(USER.id, null, ctx.response);
        return `Success! New User Account is Created`;
      } catch (error) {
        console.log("USERS -> CreateUser -> error", error.message);
        throw new Error(`USERS -> CreateUser -> error, ${error.message}`);
      }
    },
  });
  t.field("UserLogin", {
    type: "String",
    args: {
      email: stringArg({
        required: true,
        description: "User Email",
      }),
      password: stringArg({ required: true, description: "User Password" }),
    },
    //@ts-ignore
    resolve: async (parent: any, args, ctx: Context, info: any) => {
      try {
        // if user or seller is already logged log them out
        ctx.response.clearCookie("token");

        let email: string = args.email.toLowerCase();
        const userExists: User | null = await prisma.user.findOne({
          where: { email },
        });

        if (!userExists)
          throw new Error(
            `Looks Like There is no user register with ${args.email}.`
          );

        const correctPassword = await ComparePassword(
          args.password,
          userExists.password
        );
        if (!correctPassword)
          throw new Error(
            `Your Password Is Not Correct. Did You Forget Your Password.?`
          );
        const token: string = GenerateToken(userExists.id, null, ctx.response);

        return token;
      } catch (error) {
        console.log("USERS -> UserLogin->error", error);
        throw new Error(`USERS -> UserLogin ->  error ${error.message}`);
      }
    },
  });
  t.field("UserLogout", {
    type: "String",
    description: "Log User Out",
    resolve: (__, args, ctx: Context, _) => {
      ctx.response.clearCookie("token");
      return "Goodbye!";
    },
  });
  t.field("UserForgotPasswordRequest", {
    type: "String",
    args: {
      email: stringArg({ required: true }),
    },
    description: "User Request A Password Reset",
    //@ts-ignore
    resolve: async (parent: any, args, ctx: Context, info: any) => {
      try {
        ctx.response.clearCookie("token");

        const User = await prisma.user.findOne({
          where: {
            email: args.email,
          },
        });
        if (!User) throw new Error(`No User Found With ${args.email}`);

        const ResetToken = uid(40);
        const resetTokenExpiry = Date.now() + 1800000; // half an hour
        await prisma.user.update({
          where: { email: args.email },
          data: {
            PasswordResetToken: ResetToken,
            PasswordResetTokenExpiry: resetTokenExpiry,
          },
        });
        Mails.ForgotPasswordUser(User, ResetToken);
        return `Success! Password Reset Token Has Been Generated and Sent To Your Email Address`;
      } catch (error) {
        console.log(
          "USERS -> UserForgotPasswordRequest ->error",
          error.message
        );
        throw new Error(
          `USERS -> UserForgotPasswordRequest  > error, ${error.message}`
        );
      }
    },
  });
  t.field("ResetUserPassword", {
    type: "String",
    args: {
      token: stringArg({ required: true }),
      password: stringArg({ required: true }),
      confirmPassword: stringArg({ required: true }),
    },
    description: "User Reset Password",
    //@ts-ignore
    resolve: async (parent: any, args, ctx: Context, info: any) => {
      try {
        // check if there is any token clear it
        ctx.response.clearCookie("token");
        // check if token is valid
        // 1. check if the passwords match
        if (args.password.length < 4) {
          throw new Error(
            `Password is Too Short. It Should Not Be Less then 4 characters`
          );
        }
        if (args.password !== args.confirmPassword)
          throw new Error("Your Password Don not Match");
        // 2. check if its a legit reset token
        const [User] = await prisma.user.findMany({
          where: {
            AND: [
              {
                PasswordResetToken: {
                  equals: args.token,
                },
              },
              {
                PasswordResetTokenExpiry: {
                  gte: Date.now() - 1800000,
                },
              },
            ],
          },
        });
        if (!User) throw new Error(`Your Token is Either invalid or expired`);
        const hashedPassword = await Hash(args.password);
        const UpdatedUser = await prisma.user.update({
          where: {
            id: User.id,
          },
          data: {
            password: hashedPassword,
            PasswordResetToken: null,
            PasswordResetTokenExpiry: null,
          },
        });
        // Log User in
        const token: string = GenerateToken(UpdatedUser.id, null, ctx.response);

        return `Success! Password is update You Can Now Login`;
      } catch (error) {
        console.log("USERS -> ResetUserPassword ->error", error.message);
        throw new Error(
          `"USERS -> ResetUserPassword ->error", ${error.message}`
        );
      }
    },
  });
  t.field("DeleteUserAccount", {
    // TODO Test This Mutation
    type: "String",
    args: { userId: stringArg({ required: true }) },
    resolve: UserAuthResolver(
      async (
        parent: any,
        args: { userId: string },
        ctx: Context,
        info: any
      ) => {
        try {
          const { userId } = args;
          await prisma.cartItem.deleteMany({ where: { userId } });
          await prisma.like.deleteMany({ where: { userId } });
          await prisma.address.deleteMany({ where: { userId } });
          await prisma.review.deleteMany({ where: { authorId: userId } });
          await prisma.user.delete({ where: { id: userId } });
          return `Success! User Deleted`;
        } catch (error) {
          console.log("USERS -> Delete User -> error", error.message);
          throw new Error(`"USERS -> Delete User -> error", ${error.message}`);
        }
      }
    ),
  });
};
