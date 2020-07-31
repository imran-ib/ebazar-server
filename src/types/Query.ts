import { getUserId } from "../utils";
import { connectionFromArray } from "graphql-relay";
import { Context } from "../context";
import { queryType, queryField, stringArg } from "@nexus/schema";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const Query = queryType({
  definition(t) {
    t.crud.addresses({
      alias: "AllAddress",
      type: "Address",
      filtering: true,
      ordering: true,
    }),
      t.crud.address({
        alias: "SingleAddress",
        type: "Address",
      }); //in use
    //Items Query
    t.crud.item(); // being used
    t.crud.items({
      type: "Item",
      filtering: true,
      ordering: true,
      pagination: true,
    });

    t.field("itemCount", {
      type: "Int",
      resolve: async () => {
        return prisma.item.count();
      },
    });

    t.connectionField("AllItems", {
      type: "Item",
      disableBackwardPagination: true,
      inheritAdditionalArgs: true,
      //@ts-ignore
      resolve: async (root, args, ctx, info) => {
        return connectionFromArray(await prisma.item.findMany(), args);
      },
    });

    t.field("CurrentUser", {
      type: "User",
      description: "Currently Logged in User",
      nullable: true,
      //@ts-ignore
      resolve: async (__: any, _args: any, ctx: any, _: any) => {
        try {
          if (!ctx.request.user) return null;

          const user = ctx.request.user;

          const User = await prisma.user.findOne({
            include: { address: true },
            where: { id: user.id },
          });
          return User;
        } catch (error) {
          throw new Error(`No User Found ${error.message}`);
        }
      },
    });
    t.field("CurrentSeller", {
      type: "Seller",
      description: "Currently Logged in Seller",
      nullable: true,
      //@ts-ignore
      resolve: async (__: any, _args: any, ctx: any, _: any) => {
        if (!ctx.request.seller) return null;
        try {
          const { sellerId } = ctx.request;
          const Seller = await prisma.seller.findOne({
            where: { id: sellerId },
          });
          return Seller;
        } catch (error) {
          console.log("CurrentSeller -> error", error.message);
          throw new Error(`CurrentSeller -> error", ${error.message}`);
        }
      },
    });
    t.field("UserOrder", {
      type: "Order",
      description: "Users Orders",
      list: true,
      nullable: true,
      //@ts-ignore
      resolve: async (__: any, _args: any, ctx: any, _: any) => {
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
      },
    });
    t.field("Order", {
      type: "Order",
      args: { orderId: stringArg({ required: true }) },
      description: "Get One Orders",
      //@ts-ignore
      resolve: async (__: any, args: { orderId: string }, ctx: any, _: any) => {
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
      },
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
            include: { upVote: true, downVote: true },
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

    t.field("UserLikes", {
      type: "Item",
      args: { userId: stringArg({ required: true }) },
      description: "Users Whish List",
      List: true,
      //@ts-ignore
      resolve: async (
        parent: any,
        args: { userId: string },
        ctx: Context,
        info: any
      ) => {
        try {
          const Items = await prisma.like.findMany({
            where: {
              itemId: args.userId,
            },
          });
          return Items;
        } catch (error) {
          console.log("error", error);
          throw new Error(error.message);
        }
      },
    });
    t.field("isAdmin", {
      type: "Boolean",
      description: "Admin Account",
      //@ts-ignore
      resolve: async (parent: any, args: any, ctx: Context, info: any) => {
        try {
          const userId = ctx.request.userId;
          const sellerId = ctx.request.sellerId;

          const [UserIsAdmin] = userId
            ? await prisma.user.findMany({
                where: {
                  AND: [
                    {
                      id: userId,
                    },
                    {
                      role: "ADMIN",
                    },
                  ],
                },
              })
            : [];

          const [SellerAdmin] = sellerId
            ? await prisma.seller.findMany({
                where: {
                  AND: [
                    {
                      id: sellerId,
                    },
                    {
                      role: "ADMIN",
                    },
                  ],
                },
              })
            : [];
          if (UserIsAdmin) {
            return true;
          } else if (SellerAdmin) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          throw new Error(error.message);
        }
      },
    });
    t.connectionField("AllUsers", {
      type: "User",
      disableBackwardPagination: true,
      inheritAdditionalArgs: true,

      //@ts-ignore
      resolve: async (root, args, ctx, info) => {
        return connectionFromArray(await prisma.user.findMany(), args);
      },
    });
    t.connectionField("AllSeller", {
      type: "Seller",
      disableBackwardPagination: true,
      inheritAdditionalArgs: true,

      //@ts-ignore
      resolve: async (root, args, ctx, info) => {
        return connectionFromArray(await prisma.seller.findMany(), args);
      },
    });
  },
});

export const SearchTermResults = queryField((t) => {
  t.connectionField("SearchTermResults", {
    type: "Item",
    disableBackwardPagination: true,

    additionalArgs: {
      term: stringArg({ required: true }),
    },
    inheritAdditionalArgs: true,
    //@ts-ignore
    async resolve(root, args, ctx, info) {
      return connectionFromArray(
        await prisma.item.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: args.term,
                },
              },
              {
                description: {
                  contains: args.term,
                },
              },
              {
                brand: {
                  contains: args.term,
                },
              },
            ],
          },
          orderBy: { createdAt: "asc" },
        }),
        args
      );
    },
  });
});

export const ItemsQueryField = queryField((t) => {
  t.connectionField("ItemConnections", {
    type: "Item",
    disableBackwardPagination: true,

    additionalArgs: {
      tag: stringArg({ required: false }),
      category: stringArg({ required: false }),
    },
    inheritAdditionalArgs: true,
    //@ts-ignore
    async resolve(root, args, ctx, info) {
      if (args.tag) {
        return connectionFromArray(
          await prisma.item.findMany({
            where: {
              tags: {
                some: {
                  text: {
                    //@ts-ignore
                    contains: args.tag,
                  },
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          }),
          args
        );
      } else if (args.category) {
        return connectionFromArray(
          await prisma.item.findMany({
            where: {
              catagory: {
                some: {
                  text: {
                    //@ts-ignore
                    contains: args.category,
                  },
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          }),
          args
        );
      }
    },
  });
});
