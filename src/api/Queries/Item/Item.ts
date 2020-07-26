import {
  ObjectDefinitionBlock,
  stringArg,
  queryField,
} from "@nexus/schema/dist/core";
import { prisma } from "../../Primsa/Prisma";
import { AdminAuthResolver } from "../../../Utils/Auth/AuthResolver";
import { connectionFromArray } from "graphql-relay";

export const ITEMS = (t: ObjectDefinitionBlock<"Query">) => {
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
    resolve: AdminAuthResolver(async (root, args, ctx, info) => {
      return connectionFromArray(await prisma.item.findMany(), args);
    }),
  });
};
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
      return connectionFromArray(
        await prisma.item.findMany({
          where: {
            tags: {
              some: {
                text: {
                  contains: args.tag,
                },
              },
            },

            catagory: {
              some: {
                text: {
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
    },
  });
});
