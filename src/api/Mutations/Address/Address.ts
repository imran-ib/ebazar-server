import { Address } from "@prisma/client";
import { stringArg, floatArg } from "@nexus/schema";
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core";
import { Context } from "./../../../context";
import { UserAuthResolver } from "../../../Utils/Auth/AuthResolver";
import { Mails } from "../../../Utils/Mails/SendMail";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const UserAddress = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.crud.updateOneAddress();
  t.crud.deleteOneAddress();
  t.crud.deleteManyAddress({
    alias: "deleteUserAddresses",
  });
  t.field("CreateAddress", {
    type: "Address",
    args: {
      name: stringArg({ required: true }),
      address: stringArg({ required: true }),
      MaincontactNubmer: stringArg({ required: true }),
      country: stringArg({ required: true }),
      state: stringArg({ required: true }),
      city: stringArg({ required: true }),
      streetAddress1: stringArg({ required: false }),
      streetAddress2: stringArg({ required: false }),
      zipCode: stringArg({ required: false }),
      company: stringArg({ required: false }),
      message: stringArg({ required: false }),
      additionalInfo: stringArg({ required: false }),
      OthercontactNubmers: stringArg({ list: true }),
      Lat: floatArg(),
      Lng: floatArg(),
    },

    description: "Create Users Address",
    //@ts-ignore
    resolve: UserAuthResolver(
      async (parent: any, args: any, ctx: any, info: any) => {
        console.log("UserAddress -> args", args);
        try {
          const ADDRESS: Address = await prisma.address.create({
            data: {
              name: args.name,
              address: args.address,
              MaincontactNubmer: args.MaincontactNubmer,
              country: args.country,
              state: args.state,
              city: args.city,
              streetAddress1: args.streetAddress1,
              streetAddress2: args.streetAddress2,
              zipCode: args.zipCode,
              company: args.company,
              message: args.message,
              additionalInfo: args.additionalInfo,
              OthercontactNubmers: {
                set: args.OthercontactNubmers,
              },
              Lat: args.Lat,
              Lng: args.Lng,
              User: {
                connect: {
                  id: ctx.request.userId,
                },
              },
            },
          });
          // if it is the first address make it primary
          const UsersAddresses: Address[] = await prisma.address.findMany({
            where: {
              AND: [{ userId: ctx.request.userId }, { isPrimary: true }],
            },
          });
          if (UsersAddresses.length === 0) {
            await prisma.address.update({
              where: {
                id: ADDRESS.id,
              },
              data: {
                isPrimary: true,
              },
            });
          }

          return ADDRESS;
        } catch (error) {
          console.log(
            "UserAddress -> CreateUsersAddress ->  error",
            error.message
          );
          throw new Error(
            `UserAddress -> CreateUsersAddress ->  error", ${error.message}`
          );
        }
      }
    ),
  });
  t.field("TogglePrimaryAddress", {
    type: "Address",
    args: {
      addressId: stringArg({ required: true }),
    },
    description: "Toggle Primary Address",
    //@ts-ignore
    resolve: UserAuthResolver(
      async (parent: any, args: any, ctx: any, info: any) => {
        if (!ctx.request.userId) {
          throw new Error(`You Must Logged in First`);
        }
        try {
          const UsersAddresses: Address[] = await prisma.address.findMany({
            where: {
              AND: [{ userId: ctx.request.userId }, { isPrimary: true }],
            },
          });
          let ADDRESS: Address;
          if (UsersAddresses.length === 0) {
            ADDRESS = await prisma.address.update({
              where: { id: args.addressId },
              data: { isPrimary: true },
            });
          } else {
            UsersAddresses.map(
              async (address) =>
                await prisma.address.updateMany({
                  where: { id: address.id },
                  data: { isPrimary: false },
                })
            );

            ADDRESS = await prisma.address.update({
              where: {
                id: args.addressId,
              },
              data: {
                isPrimary: true,
              },
            });
          }
          return ADDRESS;
        } catch (error) {
          console.log(
            "UserAddress -> TogglePrimaryAddress -> error",
            error.message
          );
          throw new Error(
            `UserAddress -> TogglePrimaryAddress -> error", ${error.message}`
          );
        }
      }
    ),
  });
  t.field("ContactUs", {
    type: "String",
    args: {
      email: stringArg({ required: true }),
      subject: stringArg({ required: true }),
      message: stringArg({ required: true }),
    },
    description: "Contact Form",
    //@ts-ignore
    resolve: (
      __: any,
      args: {
        email: string;
        subject: string;
        message: string;
      },
      ctx: Context,
      _: any
    ) => {
      try {
        Mails.ContactForm(args.email, args.subject, args.message);
        return `Thank You for Contacting With Us, We will Get back at you As Soon As Possible`;
      } catch (error) {
        console.log("UserAddress -> error", error.message);

        throw new Error(`UserAddress -> error", ${error.message}`);
      }
    },
  });
};
