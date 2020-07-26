import { nexusPrismaPlugin } from "nexus-prisma";
import { makeSchema, connectionPlugin } from "@nexus/schema";
import {
  User,
  Seller,
  Like,
  CartItem,
  Order,
  Item,
  OrderItem,
  Catagory,
  Tag,
  Color,
  Review,
  Address,
  UpReview,
  DownReview,
} from "./api/Models/Modles";
import { Query } from "./api/Queries/Queries";
import { Mutation } from "./api/Mutations/Mutations";
import { ItemsQueryField, SearchTermResults } from "./api/Queries/Item/Item";

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    User,
    Seller,
    Like,
    CartItem,
    Order,
    Item,
    OrderItem,
    Catagory,
    Tag,
    Color,
    Review,
    Address,
    UpReview,
    DownReview,
    ItemsQueryField,
    SearchTermResults,
  ],
  plugins: [
    nexusPrismaPlugin({
      shouldGenerateArtifacts: true,
    }),
    connectionPlugin(),
  ],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  shouldGenerateArtifacts: true,
  typegenAutoConfig: {
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
