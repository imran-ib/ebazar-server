import { schema } from "./schema";
import { GraphQLServer, PubSub } from "graphql-yoga";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const pubsub = new PubSub();

function CreateServer() {
  const server = new GraphQLServer({
    schema,
    context: req => {
      const { connection: { context = null } = {} } = req;
      return {
        ...req,
        prisma,
        context,
        pubsub
      };
    }
  });
  return server;
}

export default CreateServer;
