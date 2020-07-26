import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  request: any;
  response: any;
  pubsub: any;
}

export function createContext(
  request: any,
  pubsub: any,
  response: any,
  prisma: any
) {
  return {
    ...request,
    response,
    pubsub,
    prisma,
  };
}
