import { nexusPrismaPlugin } from "nexus-prisma";
import { makeSchema, subscriptionField, connectionPlugin } from "@nexus/schema";
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
  Tags,
  Colors,
  OherFeatures,
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
    Tags,
    Colors,
    OherFeatures,
    Review,
    Address,
  ],
  plugins: [
    nexusPrismaPlugin(),

    connectionPlugin({
      typePrefix: "Analytics",
      nexusFieldName: "analyticsConnection",
      extendConnection: {
        totalCount: { type: "Int" },
        avgDuration: { type: "Int" },
      },
    }),
    connectionPlugin({}),
  ],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});
