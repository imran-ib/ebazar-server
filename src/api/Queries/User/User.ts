import { Context } from "./../../../context";
import { ObjectDefinitionBlock, stringArg } from "@nexus/schema/dist/core";
import { User } from "@prisma/client";
import { prisma } from "../../Primsa/Prisma";
import {
  UserAuthResolver,
  SellerAuthResolver,
} from "../../../Utils/Auth/AuthResolver";

export const USERS = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("CurrentUser", {
    type: "User",
    description: "Currently Logged in User",
    nullable: true,
    resolve: UserAuthResolver(
      async (__: any, _args: any, ctx: any, _: any): Promise<User | null> => {
        try {
          if (!ctx.request.user) throw new Error(`You Are Not Authenticated`);

          const user: User = ctx.request.user;

          const User = await prisma.user.findOne({
            include: { address: true },
            where: { id: user.id },
          });
          return User;
        } catch (error) {
          throw new Error(`No User Found ${error.message}`);
        }
      }
    ),
  });
  t.field("CurrentSeller", {
    type: "Seller",
    description: "Currently Logged in Seller",
    resolve: SellerAuthResolver(
      async (__: any, _args: any, ctx: any, _: any) => {
        try {
          const { sellerId } = ctx.request;
          return prisma.seller.findOne({
            where: { id: sellerId },
          });
        } catch (error) {
          console.log("CurrentSeller -> error", error.message);
          throw new Error(`CurrentSeller -> error", ${error.message}`);
        }
      }
    ),
  });

  t.field("UserOrder", {
    //TODO Test This Query
    type: "Order",
    description: "Users Orders",
    resolve: UserAuthResolver(async (__: any, _args: any, ctx: any, _: any) => {
      try {
        const { userId } = ctx.request;
        const orders = await prisma.order.findMany({
          where: {
            userId,
          },
        });

        return orders;
      } catch (error) {
        console.log("UserOrder -> error", error.message);
      }
    }),
  });
  t.field("Order", {
    //TODO Test This Query
    type: "Order",
    args: { orderId: stringArg({ required: true }) },
    description: "Get One Orders",
    resolve: UserAuthResolver(
      async (__: any, args: { orderId: string }, ctx: any, _: any) => {
        try {
          const { userId } = ctx.request;
          const Order = await prisma.order.findOne({
            where: {
              id: args.orderId,
            },
          });
          return Order;
        } catch (error) {
          console.log("One Perticulart Order -> error", error.message);
        }
      }
    ),
  });
  t.field("ITemRevives", {
    type: "Review",
    args: { itemId: stringArg({ required: true }) },
    list: true,
    description: "Item Reviews",
    //@ts-ignore
    resolve: async (__: any, args: { itemId: string }, ctx: any, _: any) => {
      try {
        const Reviews = await prisma.review.findMany({
          where: {
            itemId: args.itemId,
          },
        });

        return Reviews;
      } catch (error) {
        console.log("ITemRevives", error.message);
        throw new Error(`ITemRevives", ${error.message}`);
      }
    },
  });
};
