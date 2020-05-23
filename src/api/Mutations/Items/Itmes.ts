const stripe = require("stripe")(process.env.STRIPE_SECRET);
import { Item, Like } from "@prisma/client";
import { stringArg, floatArg, intArg } from "@nexus/schema";
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core";
import {
  SellerAuthResolver,
  UserAuthResolver,
} from "../../../Utils/Auth/AuthResolver";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { ItemArgs, UpdateItemArgs } from "../../../Types";
import { Context } from "./../../../context";

// TODO Test CreateOrder

export const Items = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("CreateItem", {
    type: "Item",
    args: {
      title: stringArg({ required: true }),
      description: stringArg({ required: true }),
      overview: stringArg({ nullable: true }),
      brand: stringArg({ nullable: true }),
      weight: stringArg({ nullable: true }),
      dimensions: stringArg({ nullable: true }),
      materials: stringArg({ nullable: true }),
      otherInfo: stringArg({ nullable: true }),
      videoLink: stringArg({ nullable: true }),
      price: floatArg({ required: true }),
      beforeDiscountPrice: floatArg({ required: true }),
      stock: intArg({ nullable: true }),
      likesCount: intArg({ nullable: true }),
      reviewCount: intArg({ nullable: true }),
      images: stringArg({ list: true }),
      catagory: stringArg({ list: true }),
      tags: stringArg({ list: true }),
      colors: stringArg({ list: true }),
      oherFeatures: stringArg({ list: true }),
    },
    description: "Create New Item",
    resolve: SellerAuthResolver(
      async (__: any, args: ItemArgs, ctx: Context, _: any) => {
        try {
          const ITEM: Item = await prisma.item.create({
            data: {
              title: args.title,
              description: args.description,
              overview: args.overview,
              brand: args.brand,
              weight: args.weight,
              dimensions: args.dimensions,
              materials: args.materials,
              otherInfo: args.otherInfo,
              videoLink: args.videoLink,
              price: args.price,
              beforeDiscountPrice: args.beforeDiscountPrice,
              stock: args.stock,
              Seller: {
                connect: {
                  id: ctx.request.sellerId,
                },
              },
            },
          });

          // images
          args.images &&
            args.images.forEach(async (image) => {
              await prisma.itemImage.create({
                data: {
                  url: image,
                  item: {
                    connect: {
                      id: ITEM.id,
                    },
                  },
                },
              });
            });

          // catagory
          args.catagory &&
            args.catagory.forEach(async (item) => {
              await prisma.catagory.create({
                data: {
                  text: item,
                  item: {
                    connect: {
                      id: ITEM.id,
                    },
                  },
                },
              });
            });
          // tags

          args.tags &&
            args.tags.forEach(async (tag) => {
              await prisma.tags.create({
                data: {
                  text: tag,
                  item: {
                    connect: {
                      id: ITEM.id,
                    },
                  },
                },
              });
            });
          // colors
          args.colors &&
            args.colors.forEach(async (color) => {
              await prisma.colors.create({
                data: {
                  text: color,
                  item: {
                    connect: {
                      id: ITEM.id,
                    },
                  },
                },
              });
            });
          // oherFeatures
          args.oherFeatures &&
            args.oherFeatures.forEach(async (text) => {
              await prisma.oherFeatures.create({
                data: {
                  text: text,
                  item: {
                    connect: {
                      id: ITEM.id,
                    },
                  },
                },
              });
            });
          return ITEM;
        } catch (error) {
          console.log("Items -> CreateItem -> error", error.message);

          throw new Error(`Items -> CreateItem -> error", ${error.message}`);
        }
      }
    ),
  });
  t.field("UpdateItem", {
    type: "Item",
    args: {
      id: stringArg({ nullable: true }),
      title: stringArg({ nullable: true }),
      description: stringArg({ nullable: true }),
      overview: stringArg({ nullable: true }),
      brand: stringArg({ nullable: true }),
      weight: stringArg({ nullable: true }),
      dimensions: stringArg({ nullable: true }),
      materials: stringArg({ nullable: true }),
      otherInfo: stringArg({ nullable: true }),
      videoLink: stringArg({ nullable: true }),
      price: floatArg({ nullable: true }),
      beforeDiscountPrice: floatArg({ nullable: true }),
      stock: intArg({ nullable: true }),
      likesCount: intArg({ nullable: true }),
      reviewCount: intArg({ nullable: true }),
      images: stringArg({ list: true, nullable: true }),
      catagory: stringArg({ list: true, nullable: true }),
      tags: stringArg({ list: true, nullable: true }),
      colors: stringArg({ list: true, nullable: true }),
      oherFeatures: stringArg({ list: true, nullable: true }),
    },
    description: "Update Item",
    resolve: SellerAuthResolver(
      async (__: any, args: UpdateItemArgs, ctx: Context, _: any) => {
        try {
          const ITEM = await prisma.item.findOne({
            include: { Seller: true },
            where: { id: args.id },
          });
          // TODO test These Conditions

          if (!ITEM) throw new Error(`Item Not Found`);

          if (ITEM.Seller && ITEM.Seller.id !== ctx.request.sellerId)
            throw new Error(`You Don't Own This Item`);

          if (
            (ITEM.Seller && ITEM.Seller.role === "SELLER") ||
            (ITEM.Seller && ITEM.Seller.role === "ADMIN")
          ) {
            const UPDATED_ITEM: Item = await prisma.item.update({
              where: {
                id: args.id,
              },
              data: {
                title: args.title,
                description: args.description,
                overview: args.overview,
                brand: args.brand,
                weight: args.weight,
                dimensions: args.dimensions,
                materials: args.materials,
                otherInfo: args.otherInfo,
                videoLink: args.videoLink,
                price: args.price,
                beforeDiscountPrice: args.beforeDiscountPrice,
                stock: args.stock,
              },
            });

            // images
            if (args.images && args.images.length > 0) {
              await prisma.itemImage.deleteMany({
                where: {
                  itemId: UPDATED_ITEM.id,
                },
              });
              args.images.forEach(async (image) => {
                await prisma.itemImage.create({
                  data: {
                    url: image,
                    item: {
                      connect: {
                        id: UPDATED_ITEM.id,
                      },
                    },
                  },
                });
              });
            }

            if (args.catagory && args.catagory.length > 0) {
              await prisma.catagory.deleteMany({
                where: {
                  itemId: UPDATED_ITEM.id,
                },
              });

              args.catagory.forEach(async (item) => {
                await prisma.catagory.create({
                  data: {
                    text: item,
                    item: {
                      connect: {
                        id: UPDATED_ITEM.id,
                      },
                    },
                  },
                });
              });
            }

            // tags
            if (args.tags && args.tags.length > 0) {
              await prisma.tags.deleteMany({
                where: {
                  itemId: UPDATED_ITEM.id,
                },
              });

              args.tags.forEach(async (tag) => {
                await prisma.tags.create({
                  data: {
                    text: tag,
                    item: {
                      connect: {
                        id: UPDATED_ITEM.id,
                      },
                    },
                  },
                });
              });
            }

            // colors
            if (args.colors && args.colors.length > 0) {
              await prisma.colors.deleteMany({
                where: {
                  itemId: UPDATED_ITEM.id,
                },
              });

              args.colors.forEach(async (color) => {
                await prisma.colors.create({
                  data: {
                    text: color,
                    item: {
                      connect: {
                        id: UPDATED_ITEM.id,
                      },
                    },
                  },
                });
              });
            }
            // oherFeatures
            if (args.oherFeatures && args.oherFeatures.length > 0) {
              await prisma.oherFeatures.deleteMany({
                where: {
                  id: UPDATED_ITEM.id,
                },
              });

              args.oherFeatures.forEach(async (text) => {
                await prisma.oherFeatures.create({
                  data: {
                    text: text,
                    item: {
                      connect: {
                        id: UPDATED_ITEM.id,
                      },
                    },
                  },
                });
              });
            }

            return UPDATED_ITEM;
          }
        } catch (error) {
          console.log("Items -> UpdateItem -> error", error.message);
          throw new Error(`Items -> UpdateItem -> error", ${error.message}`);
        }
      }
    ),
  });
  t.field("DeleteItem", {
    type: "String",
    args: { itemId: stringArg({ required: true }) },
    description: "Delete Item",
    resolve: SellerAuthResolver(
      async (__: any, args: { itemId: string }, ctx: Context, _: any) => {
        try {
          const ITEM = await prisma.item.findOne({
            include: { Seller: true },
            where: { id: args.itemId },
          });
          // TODO test These Conditions
          if (!ITEM) throw new Error(`Item Not Found`);
          if (ITEM.Seller && ITEM.Seller.id !== ctx.request.sellerId)
            throw new Error(`You Don't Own This Item`);

          if (
            (ITEM.Seller && ITEM.Seller.role === "SELLER") ||
            (ITEM.Seller && ITEM.Seller.role === "ADMIN")
          ) {
            try {
              // TODO Check Prisma bulk Operations
              await prisma.itemImage.deleteMany({
                where: { itemId: args.itemId },
              });
              await prisma.tags.deleteMany({ where: { itemId: args.itemId } });

              await prisma.colors.deleteMany({
                where: { itemId: args.itemId },
              });
              await prisma.catagory.deleteMany({
                where: { itemId: args.itemId },
              });
              await prisma.oherFeatures.deleteMany({
                where: { itemId: args.itemId },
              });

              await prisma.item.delete({
                where: {
                  id: args.itemId,
                },
              });
            } catch (error) {
              console.log(
                "Items -> Delete Item itemImage tags colors catagory oherFeatures ->  error",
                error.message
              );
              throw new Error(
                `"Items -> Delete Item itemImage tags colors catagory oherFeatures ->  error", ${error.message}`
              );
            }
          }

          return `Success! Item is Deleted `;
        } catch (error) {
          console.log("Items -> Delete Item -> error", error.message);
          throw new Error(`"Items -> Delete Item -> error", ${error.message}`);
        }
      }
    ),
  });
  t.field("ToggleLikeItem", {
    type: "String",
    args: { itemId: stringArg({ required: true }) },
    description: "Like Or Remove Like From Item",
    resolve: UserAuthResolver(
      async (
        parent: any,
        args: { itemId: string },
        ctx: Context,
        info: any
      ) => {
        try {
          const userId: string = ctx.request.userId;

          const [Exists]: Like[] = await prisma.like.findMany({
            where: {
              AND: [{ userId }, { itemId: args.itemId }],
            },
          });
          if (Exists) {
            await prisma.like.delete({
              where: {
                id: Exists.id,
              },
            });
          } else {
            await prisma.like.create({
              data: {
                item: { connect: { id: args.itemId } },
                user: { connect: { id: userId } },
              },
            });
          }

          await prisma.item.update({
            where: { id: args.itemId },
            data: {
              likesCount: await prisma.like.count({
                where: { itemId: args.itemId },
              }),
            },
          });

          return "Success";
        } catch (error) {
          throw new Error(`Unable To Complete The Action ${error.message}`);
        }
      }
    ),
  });
  t.field("CreateItemReview", {
    type: "Review",
    args: {
      itemId: stringArg({ required: true }),
      text: stringArg({ required: true }),
      rating: floatArg({ required: true }),
    },
    description: "Create Item Review",
    resolve: UserAuthResolver(
      async (
        parent: any,
        args: { itemId: string; text: string; rating: number },
        ctx: Context,
        info: any
      ) => {
        try {
          const ItemReview = await prisma.review.create({
            data: {
              author: {
                connect: { id: ctx.request.userId },
              },
              item: {
                connect: {
                  id: args.itemId,
                },
              },
              text: args.text,
              rating: args.rating,
            },
          });
          await prisma.item.update({
            where: { id: args.itemId },
            data: {
              reviewCount: await prisma.review.count({
                where: { itemId: args.itemId },
              }),
            },
          });

          return ItemReview;
        } catch (error) {
          console.log("error -> create Rating ->", error.message);
          throw new error(`"error -> create Rating ->",  ${error.message}`);
        }
      }
    ),
  });
  t.field("AddItemToTheCart", {
    type: "String",
    args: {
      itemId: stringArg({ required: true }),
      quantity: intArg({ required: true }),
    },
    description: "Add Item To Cart",
    resolve: UserAuthResolver(
      async (
        __: any,
        args: { itemId: string; quantity: number },
        ctx: Context,
        _: any
      ) => {
        try {
          const { itemId } = args;
          // if Cart Item Exists Increment By args.quantity Otherwise Create One
          const [CartItemExists] = await prisma.cartItem.findMany({
            where: {
              AND: [{ userId: ctx.request.userId }, { itemId }],
            },
          });
          if (CartItemExists) {
            await prisma.cartItem.update({
              where: { id: CartItemExists.id },
              data: { quantity: CartItemExists.quantity + args.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: {
                quantity: args.quantity,
                item: { connect: { id: args.itemId } },
                user: { connect: { id: ctx.request.userId } },
              },
            });
          }
          return `Success! Item Added To Cart`;
        } catch (error) {
          console.log("error -> AddItemToTheCart ", error.message);
          throw new Error(`error -> AddItemToTheCart ', ${error.message}`);
        }
      }
    ),
  });
  t.field("DeleteCartItem", {
    type: "String",
    args: {
      cartItemId: stringArg({ required: true }),
    },
    description: "",
    resolve: UserAuthResolver(
      async (__: any, args: { cartItemId: string }, ctx: Context, _: any) => {
        try {
          const [ITEM] = await prisma.cartItem.findMany({
            where: {
              AND: [{ id: args.cartItemId }, { userId: ctx.request.userId }],
            },
          });
          if (ITEM) {
            await prisma.cartItem.delete({ where: { id: ITEM.id } });
          } else {
            throw new Error(`Item Not Found`);
          }
          return `Success! Item Has been removed From Cart`;
        } catch (error) {
          console.log("error  -> DeleteCartItem", error.message);
          throw new Error(`"error  -> DeleteCartItem",${error.message}`);
        }
      }
    ),
  });
  t.field("EmptyUserCart", {
    type: "String",
    args: { userId: stringArg({ required: true }) },
    description: "",
    resolve: UserAuthResolver(
      async (__: any, args: { userId: string }, ctx: Context, _: any) => {
        try {
          const { userId } = args;
          if (userId !== ctx.request.userId)
            throw new Error(`You Don't Own these Cart Items`);
          await prisma.cartItem.deleteMany({
            where: {
              userId,
            },
          });
          return `Success! All Items From Your Cart Has Been Removed`;
        } catch (error) {
          console.log("error -> EmptyUserCart ", error.message);
          throw new Error(`error -> EmptyUserCart ", ${error.message}`);
        }
      }
    ),
  });
  t.field("CreateOrder", {
    type: "String",
    args: { token: stringArg({ required: true }) },
    description: "",
    resolve: UserAuthResolver(
      async (__: any, args: { token: string }, ctx: Context, _: any) => {
        try {
          // Get Current User
          const CurrentUserCart = await prisma.cartItem.findMany({
            include: { item: true, user: true },
            where: { userId: ctx.request.userId },
          });

          //2 recalculate total amount
          //@ts-ignore

          const [CurrentUser] = CurrentUserCart.map((user) => user.user);

          const cart = CurrentUserCart;
          const totalPrice = cart.reduce((tally, cartItem) => {
            if (!cartItem.item) return tally;
            return tally + cartItem.quantity * cartItem.item.price;
          }, 0);

          // create a stripe charge

          const charge = await stripe.charges.create({
            //https://stripe.com/docs/api/charges/create?lang=node
            amount: totalPrice,
            currency: "usd",
            source: args.token, // obtained with Stripe.js
            description: `Charge for Mr.${CurrentUser.name}`,
          });

          // convert Cart items to order items

          const OrderItems = CurrentUserCart.map((cartItem) => {
            const OrderItem = {
              ...cartItem.item,
              quantity: cartItem.quantity,
              user: { connect: { id: ctx.request.userId } },
              seller: { connect: { id: cartItem.item.sellerId } },
            };
            delete OrderItem.id;

            return OrderItem;
          });

          //  create order
          const orders = await prisma.order.create({
            data: {
              total: charge.amount,
              charge: charge.id,
              status: "PENDING",
              user: { connect: { id: ctx.request.userId } },
              items: {
                create: OrderItems,
              },
            },
          });

          // clear Cart
          const ItemIds = CurrentUserCart.map((item) => item.id);

          await prisma.cartItem.deleteMany({
            where: {
              id: { in: ItemIds },
            },
          });

          return `Thank You For The Purchase`;
        } catch (error) {
          console.log("error -> CreateOrder", error.message);
          throw new Error(`"error -> CreateOrder", ${error.message}`);
        }
      }
    ),
  });
};
