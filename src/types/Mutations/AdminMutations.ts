import { stringArg, arg } from "@nexus/schema";
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core";
import { Context } from "../../context";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const AdminMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("UpdateRole", {
    type: "String",
    args: {
      userId: stringArg(),
      sellerId: stringArg(),
      role: arg({ type: "Role" }),
    },
    description: "Update User Or Seller's Roles",
    //@ts-ignore
    resolve: async (parent: any, args: any, ctx: any, info: any) => {
      try {
        if (args.userId) {
          await prisma.user.update({
            where: { id: args.userId },
            data: {
              role: args.role,
            },
          });
        } else if (args.sellerId) {
          await prisma.seller.update({
            where: { id: args.sellerId },
            data: {
              role: args.role,
            },
          });
        }
        return `Success! Role is Updated Successfully`;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });
};
