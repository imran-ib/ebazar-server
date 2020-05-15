import { nexusPrismaPlugin } from "nexus-prisma";
import { makeSchema, subscriptionField, connectionPlugin } from "@nexus/schema";
import {
  User,
  Like,
} from "./api/Models/Modles";
import { Query } from "./api/Queries/Queries";
import { Mutation } from "./api/Mutations/Mutations";
import { Subscriptions } from "./api/Subscription/Subscriptios";

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Subscriptions,
    User,
    Like,
  
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
