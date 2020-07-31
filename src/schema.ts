import { makeSchema, connectionPlugin } from "@nexus/schema";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import { Mutation } from "./types/Mutation";
import { Query, SearchTermResults, ItemsQueryField } from "./types/Query";
import { AuthPayload } from "./types/AuthPayload";

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
} from "./types/Models";

export const schema = makeSchema({
  types: [
    Mutation,
    Query,
    AuthPayload,
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
    SearchTermResults,
    ItemsQueryField,
  ],
  plugins: [
    nexusSchemaPrisma({
      experimentalCRUD: true,
      paginationStrategy: "prisma",
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
