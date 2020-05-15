import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    prisma
  };
}
