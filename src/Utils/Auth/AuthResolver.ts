import { Context } from "../../context";
import { prisma } from "../../api/Primsa/Prisma";

export const UserAuthResolver = (resolverFunctions: any) => async (
  parent: any,
  args: any,
  ctx: Context,
  info: any
) => {
  const user = ctx.request.user;
  if (!user) {
    throw new Error(
      "ACCESS DENIED,  AUTHORIZATION FAILED , YOU ARE NOT LOGGED IN AS USER"
    );
  }
  const resolver = await resolverFunctions(parent, args, ctx, info);
  return resolver;
};

export const SellerAuthResolver = (resolverFunctions: any) => async (
  parent: any,
  args: any,
  ctx: Context,
  info: any
) => {
  const seller = ctx.request.seller;

  if (!seller) {
    throw new Error(
      "ACCESS DENIED,  AUTHORIZATION FAILED , YOU ARE NOT LOGGED IN AS SELLER"
    );
  }
  const resolver = await resolverFunctions(parent, args, ctx, info);
  return resolver;
};
export const AdminAuthResolver = (resolverFunctions: any) => async (
  parent: any,
  args: any,
  ctx: Context,
  info: any
) => {
  const userId = ctx.request.userId;
  const sellerId = ctx.request.sellerId;
  let isAdmin: boolean = false;

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
    isAdmin = true;
  } else if (SellerAdmin) {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

  if (!isAdmin) {
    throw new Error("ACCESS DENIED,  AUTHORIZATION FAILED , YOU ARE NOT ADMIN");
  }
  const resolver = await resolverFunctions(parent, args, ctx, info);
  return resolver;
};
