import { PrismaClient } from '@prisma/client'
import { PubSub } from 'graphql-yoga'


export interface Context {
  prisma: PrismaClient
  request: any
  response: any
  pubsub: PubSub
}

const prisma = new PrismaClient()
const pubsub = new PubSub()

export function createContext(request: any, response: any): Context {
  return {
    prisma,
    ...request,
    ...response,
    pubsub,
  }
}
