import { Context } from "./../../../context";
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core";
import { User } from "@prisma/client";
import { prisma } from "../../Primsa/Prisma";

export const USERS = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("CurrentUser", {
    type: "User",

    description: "Current User",
    nullable: true,
    resolve: async (
      __: any,
      _args: any,
      ctx: Context,
      _: any
    ): Promise<User | null> => {
      try {
        if (!ctx.request.user) throw new Error(`You Are Not Authenticated`);
        const user: User = ctx.request.user;

        const User = await prisma.user.findOne({
          where: { id: user.id },
        });
        return User;
      } catch (error) {
        throw new Error(`No User Found ${error.message}`);
      }
    },
  });
};
