import { rule, shield } from "graphql-shield";
import { getUserId } from "../utils";
import { Context } from "../context";

const rules = {
  isAuthenticatedUser: rule()((parent, args, context: Context) => {
    const userId = context.request.userId;
    return Boolean(userId);
  }),
  isAuthenticatedSeller: rule()((parent, args, context: Context) => {
    const sellerId = context.request.sellerId;
    return Boolean(sellerId);
  }),
  isAuthenticatedAdmin: rule()(async (parent, args, context: Context) => {
    const userId = context.request.userId;
    const sellerId = context.request.sellerId;
    let isAdmin: boolean = false;
    const [UserIsAdmin] = userId
      ? await context.prisma.user.findMany({
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
      ? await context.prisma.seller.findMany({
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
    return Boolean(isAdmin);
  }),
  // TODO User And Seller Should be owner of account before deleting it(see if these condition can be moved out from delete account mutation)
  // TODO Item Owned By Seller (Delete or)
  isPostOwner: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context);
    const author = await context.prisma.post
      .findOne({
        where: {
          id: Number(id),
        },
      })
      .author();
    return userId === author.id;
  }),
};

export const permissions = shield(
  {
    Query: {
      Order: rules.isAuthenticatedUser,
      UserLikes: rules.isAuthenticatedUser,
      UserOrder: rules.isAuthenticatedUser,
      AllItems: rules.isAuthenticatedAdmin,
      AllUsers: rules.isAuthenticatedAdmin,
      AllSeller: rules.isAuthenticatedAdmin,
    },
    Mutation: {
      //User
      DeleteUserAccount: rules.isAuthenticatedUser,
      ResetUsersPasswordFromProfile: rules.isAuthenticatedUser,
      ToggleLikeItem: rules.isAuthenticatedUser,
      RemoveAllLikes: rules.isAuthenticatedUser,
      CreateItemReview: rules.isAuthenticatedUser,
      ToggleReviewUpVote: rules.isAuthenticatedUser,
      ToggleReviewDownVote: rules.isAuthenticatedUser,
      AddItemToTheCart: rules.isAuthenticatedUser,
      DeleteCartItem: rules.isAuthenticatedUser,
      EmptyUserCart: rules.isAuthenticatedUser,
      CreateOrder: rules.isAuthenticatedUser,
      CreateAddress: rules.isAuthenticatedUser,
      TogglePrimaryAddress: rules.isAuthenticatedUser,

      //Serller
      DeleteSellersAccount: rules.isAuthenticatedSeller,
      CreateItem: rules.isAuthenticatedSeller,
      UpdateItem: rules.isAuthenticatedSeller,
      DeleteItem: rules.isAuthenticatedSeller,
      //Admin

      UpdateRole: rules.isAuthenticatedAdmin,
    },
  },
  {
    allowExternalErrors: true,
  }
);
