import { nexusPrismaPlugin } from "nexus-prisma";
import { makeSchema } from "@nexus/schema";

import {
  User,
  Seller,
  Like,
  ItemImage,
  CartItem,
  Order,
  Item,
  OrderItem,
  Catagory,
  Tag,
  Color,
  OtherFeature,
  Review,
  Address,
} from "./api/Models/Modles";
import { Query } from "./api/Queries/Queries";
import { Mutation } from "./api/Mutations/Mutations";

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    Seller,
    Like,
    ItemImage,
    CartItem,
    Order,
    Item,
    OrderItem,
    Catagory,
    Tag,
    Color,
    OtherFeature,
    Review,
    Address,
  ],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  typegenAutoConfig: {
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
