const stripe = require("stripe")(process.env.STRIPE_SECRET);
import { ObjectDefinitionBlock, floatArg, stringArg, intArg } from '@nexus/schema/dist/core'
import { validateEmail } from '../../Utils/Mails/ValidateEmail'
import { Hash, ComparePassword } from '../../Utils/bcryptJs/HashPassword'
import { GenerateToken } from '../../Utils/JWT/GenerateJwt'
import { Context } from '../../context'
import { uid } from 'rand-token'
import { Mails } from '../../Utils/Mails/SendMail'
import {ItemArgs,UpdateItemArgs} from '../../Types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export const ItemMutations = (t: ObjectDefinitionBlock<'Mutation'>) => {
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
          images: stringArg({ list: true }),
          eagerImages: stringArg({ list: true }),
          catagory: stringArg({ list: true }),
          tags: stringArg({ list: true }),
          colors: stringArg({ list: true }),
          otherFeature: stringArg({ list: true }),
        },
        description: "Create New Item",
        //@ts-ignore
        resolve: 
          async (__: any, args: ItemArgs, ctx: any, _: any) => {
            try {
              const ITEM = await prisma.item.create({
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
                  images: {
                    set: args.images,
                  },
                  eagerImages: {
                    set: args.eagerImages,
                  },
                  OtherFeatures: {
                    set: args.otherFeature,
                  },
                  Seller: {
                    connect: {
                      id: ctx.request.sellerId,
                    },
                  },
                },
              });
    
              // category
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
                  await prisma.tag.create({
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
                  await prisma.color.create({
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
    
              return ITEM;
            } catch (error) {
              console.log("Items -> CreateItem -> error", error.message);
    
              throw new Error(`Items -> CreateItem -> error", ${error.message}`);
            }
          }
        
      });
      t.field("UpdateItem", {
        type: "Item",
        args: {
          id: stringArg({ required: true }),
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
          images: stringArg({ list: true, nullable: true }),
          eagerImages: stringArg({ list: true, nullable: true }),
          catagory: stringArg({ list: true, nullable: true }),
          tags: stringArg({ list: true, nullable: true }),
          colors: stringArg({ list: true, nullable: true }),
          otherFeature: stringArg({ list: true, nullable: true }),
        },
        description: "Update Item",
        //@ts-ignore
        resolve: 
          async (__: any, args: UpdateItemArgs, ctx: any, _: any) => {
            try {
              const ITEM = await prisma.item.findOne({
                include: { Seller: true },
                where: { id: args.id },
              });
              if (!ITEM) throw new Error(`Item Not Found`);
    
              if (ITEM.Seller && ITEM.Seller.id !== ctx.request.sellerId)
                throw new Error(`You Don't Own This Item`);
    
              if (
                (ITEM.Seller && ITEM.Seller.role === "SELLER") ||
                (ITEM.Seller && ITEM.Seller.role === "ADMIN")
              ) {
                const UPDATED_ITEM = await prisma.item.update({
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
                    images: {
                      set: args.images,
                    },
                    eagerImages: {
                      set: args.eagerImages,
                    },
                    OtherFeatures: {
                      set: args.otherFeature,
                    },
                  },
                });
    
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
                  await prisma.tag.deleteMany({
                    where: {
                      itemId: UPDATED_ITEM.id,
                    },
                  });
    
                  args.tags.forEach(async (tag) => {
                    await prisma.tag.create({
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
                  await prisma.color.deleteMany({
                    where: {
                      itemId: UPDATED_ITEM.id,
                    },
                  });
    
                  args.colors.forEach(async (color) => {
                    await prisma.color.create({
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
    
                return UPDATED_ITEM;
              }
            } catch (error) {
              console.log("Items -> UpdateItem -> error", error.message);
              throw new Error(`Items -> UpdateItem -> error", ${error.message}`);
            }
          }
        
      });
      //TODO Copy UpdateItem and create it with admin auth(give admin access of update item)
      t.field("DeleteItem", {
        type: "String",
        args: { itemId: stringArg({ required: true }) },
        description: "Delete Item",
        //@ts-ignore
        resolve: 
          async (__: any, args: { itemId: string }, ctx: any, _: any) => {
            try {
              const ITEM = await prisma.item.findOne({
                include: { Seller: true },
                where: { id: args.itemId },
              });
    
              if (!ITEM) throw new Error(`Item Not Found`);
              if (ITEM.Seller && ITEM.Seller.id !== ctx.request.sellerId)
                throw new Error(`You Don't Own This Item`);
    
              if (
                (ITEM.Seller && ITEM.Seller.role === "SELLER") ||
                (ITEM.Seller && ITEM.Seller.role === "ADMIN")
              ) {
                try {
                  await prisma.tag.deleteMany({ where: { itemId: args.itemId } });
    
                  await prisma.color.deleteMany({
                    where: { itemId: args.itemId },
                  });
                  await prisma.catagory.deleteMany({
                    where: { itemId: args.itemId },
                  });
    
                  await prisma.item.delete({
                    where: {
                      id: args.itemId,
                    },
                  });
                } catch (error) {
                  console.log(
                    "Items -> Delete Item itemImage tags colors catagory otherFeature ->  error",
                    error.message
                  );
                  throw new Error(
                    `"Items -> Delete Item itemImage tags colors catagory otherFeature ->  error", ${error.message}`
                  );
                }
              }
    
              return `Success! Item is Deleted `;
            } catch (error) {
              console.log("Items -> Delete Item -> error", error.message);
              throw new Error(`"Items -> Delete Item -> error", ${error.message}`);
            }
          }
        
      });
      //TODO Copy DeleteItem and create it with admin auth(give admin access of delete item)
      t.field("ToggleLikeItem", {
        type: "String",
        args: { itemId: stringArg({ required: true }) },
        description: "Like Or Remove Like From Item",
        //@ts-ignore
        resolve: 
          async (parent: any, args: { itemId: string }, ctx: any, info: any) => {
            try {
              const userId: string = ctx.request.userId;
    
              const [Exists] = await prisma.like.findMany({
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
        
      });
      t.field("RemoveAllLikes", {
        type: "String",
        args: { userId: stringArg({ required: true }) },
        description: "Remove All Items From Wishlist",
        //@ts-ignore
        resolve: 
          async (
            parent: any,
            args: { userId: string },
            ctx: Context,
            info: any
          ) => {
            try {
              const userId = ctx.request.userId;
              const Items = await prisma.like.deleteMany({
                where: {
                  userId: args.userId,
                },
              });
    
              return `Your Wishlist is Empty now`;
            } catch (error) {
              throw new Error(error.message);
            }
          }
        
      });
      t.field("CreateItemReview", {
        type: "Review",
        args: {
          itemId: stringArg({ required: true }),
          text: stringArg({ required: true }),
          rating: floatArg({ required: true }),
        },
        description: "Create Item Review",
        //@ts-ignore
        resolve: 
          async (
            parent: any,
            args: { itemId: string; text: string; rating: number },
            ctx: any,
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
        
      });
      t.field("ToggleReviewUpVote", {
        type: "String",
        args: {
          reviewId: stringArg({ required: true }),
          itemId: stringArg({ required: true }),
        },
        description: "Toggle Vote Up For Review",
        //@ts-ignore
        resolve: 
          async (
            parent: any,
            args: { itemId: string; reviewId: string },
            ctx: any,
            info: any
          ) => {
            try {
              const userId: string = ctx.request.userId;
              const [ExistsUpVote] = await prisma.upReview.findMany({
                where: {
                  AND: [
                    {
                      authorId: userId,
                    },
                    {
                      Review: {
                        id: args.reviewId,
                      },
                      itemId: args.itemId,
                    },
                  ],
                },
              });
    
              if (ExistsUpVote) {
                await prisma.upReview.delete({
                  where: {
                    id: ExistsUpVote.id,
                  },
                });
              } else {
                await prisma.upReview.create({
                  data: {
                    author: {
                      connect: { id: userId },
                    },
                    item: {
                      connect: { id: args.itemId },
                    },
                    Review: {
                      connect: { id: args.reviewId },
                    },
                    voteUp: true,
                  },
                });
              }
              const UpdateCount = await prisma.review.update({
                where: { id: args.reviewId },
                data: {
                  upVoteCount: await prisma.upReview.count({
                    where: {
                      Review: {
                        id: args.reviewId,
                      },
                    },
                  }),
                },
              });
              return `Success! Thank Your For Voting`;
            } catch (error) {
              console.log("error", error);
              throw new Error(`${error.message}`);
            }
          }
        
      });
      t.field("ToggleReviewDownVote", {
        type: "String",
        args: {
          reviewId: stringArg({ required: true }),
          itemId: stringArg({ required: true }),
        },
        description: "Toggle Vote Down For Review",
        //@ts-ignore
        resolve: 
          async (
            parent: any,
            args: { itemId: string; reviewId: string },
            ctx: any,
            info: any
          ) => {
            try {
              const userId: string = ctx.request.userId;
              const [ExistsDownVote] = await prisma.downReview.findMany({
                where: {
                  AND: [
                    {
                      authorId: userId,
                    },
                    {
                      Review: {
                        id: args.reviewId,
                      },
                      itemId: args.itemId,
                    },
                  ],
                },
              });
              if (ExistsDownVote) {
                await prisma.downReview.delete({
                  where: {
                    id: ExistsDownVote.id,
                  },
                });
              } else {
                await prisma.downReview.create({
                  data: {
                    author: {
                      connect: { id: userId },
                    },
                    item: {
                      connect: { id: args.itemId },
                    },
                    Review: {
                      connect: { id: args.reviewId },
                    },
                    voteDown: true,
                  },
                });
              }
              const UpdateCount = await prisma.review.update({
                where: { id: args.reviewId },
                data: {
                  downVoteCount: await prisma.downReview.count({
                    where: {
                      Review: {
                        id: args.reviewId,
                      },
                    },
                  }),
                },
              });
              return `Success! Your Vote Has Been Cancled`;
            } catch (error) {
              console.log("error", error);
              throw new Error(`${error.message}`);
            }
          }
        
      });
      t.field("AddItemToTheCart", {
        type: "String",
        args: {
          itemId: stringArg({ required: true }),
          quantity: intArg({ required: true }),
        },
        description: "Add Item To Cart",
        //@ts-ignore
        resolve: 
          async (
            __: any,
            args: { itemId: string; quantity: number },
            ctx: any,
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
        
      });
      t.field("DeleteCartItem", {
        type: "CartItem",
        args: {
          cartItemId: stringArg({ required: true }),
        },
        description: "",
        //@ts-ignore
        resolve: 
          async (__: any, args: { cartItemId: string }, ctx: any, _: any) => {
            try {
              let Item;
              const [ITEM] = await prisma.cartItem.findMany({
                where: {
                  AND: [
                    { itemId: args.cartItemId },
                    { userId: ctx.request.userId },
                  ],
                },
              });
    
              if (ITEM) {
                Item = await prisma.cartItem.delete({ where: { id: ITEM.id } });
              } else {
                throw new Error(`Item Not Found`);
              }
              return Item;
            } catch (error) {
              console.log("error  -> DeleteCartItem", error.message);
              throw new Error(`"error  -> DeleteCartItem",${error.message}`);
            }
          }
        
      });
      t.field("EmptyUserCart", {
        type: "String",
        args: { userId: stringArg({ required: true }) },
        description: "",
        //@ts-ignore
        resolve: 
          async (__: any, args: { userId: string }, ctx: any, _: any) => {
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
        
      });
      t.field("CreateOrder", {
        type: "Order",
        args: { token: stringArg({ required: true }) },
        description: "",
        //@ts-ignore
        resolve: 
          async (__: any, args: { token: string }, ctx: any, _: any) => {
            try {
              // Get Current User
              const CurrentUserCart = await prisma.cartItem.findMany({
                include: { item: true, user: true },
                where: { userId: ctx.request.userId },
              });
    
              //2 recalculate total amount
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
              const OrderItems = cart.map((cartItem) => {
                const OrderItem = {
                  title: cartItem.item.title,
                  description: cartItem.item.description,
                  price: cartItem.item.price,
                  beforeDiscountPrice: cartItem.item.beforeDiscountPrice,
                  images: {
                    set: cartItem.item.images,
                  },
                  eagerImages: {
                    set: cartItem.item.eagerImages,
                  },
                  overview: cartItem.item.overview,
                  otherInfo: cartItem.item.otherInfo,
                  videoLink: cartItem.item.videoLink,
                  brand: cartItem.item.brand,
                  weight: cartItem.item.weight,
                  dimensions: cartItem.item.dimensions,
                  materials: cartItem.item.materials,
                  stock: cartItem.item.stock,
                  quantity: cartItem.quantity,
                };
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
    
              return orders;
            } catch (error) {
              console.log("error -> CreateOrder", error.message);
              throw new Error(`"error -> CreateOrder", ${error.message}`);
            }
          }
        
      });

}