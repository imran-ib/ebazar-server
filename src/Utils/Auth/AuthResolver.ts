import { Context } from "../../context";

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
