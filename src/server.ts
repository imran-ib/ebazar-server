import "./env";
import { GraphQLServer } from "graphql-yoga";
import { permissions } from "./permissions";
import { schema } from "./schema";
import { createContext } from "./context";
import cookieParser from "cookie-parser";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
});
server.express.use(cookieParser());

const options = {
  port: process.env.PORT || 4444,
  endpoint: "/",
  subscriptions: "/subscriptions",
  playground: "/",
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  },
};

export const getTokenFromReq = (req: Request) => {
  try {
    const Authorization = req.headers["authorization"];
    if (Authorization) {
      let token = Authorization.replace("Bearer ", "");

      return token;
    }
  } catch (error) {
    return "";
  }
};

export const getCookieFromReq = (req: Request, cookieKey: string): string => {
  try {
    const cookie = req.cookies[cookieKey];
    const signedCookie = req.signedCookies[cookieKey];

    if (cookie) return cookie;
    if (signedCookie) return signedCookie;
    return "";
  } catch (error) {
    return "";
  }
};

server.express.use((req: any, res, next) => {
  // const { token } = req.cookies;
  let token = getTokenFromReq(req);
  if (!token) token = getCookieFromReq(req, "token") || "";

  if (token) {
    const { sellerId }: any = verify(token, process.env.APP_SECRET || "");
    const { userId }: any = verify(token, process.env.APP_SECRET || "");
    req.sellerId = sellerId;
    req.userId = userId;
  }

  next();
});

server.express.use(async (req: any, res, next) => {
  if (!req.sellerId) return next();
  const seller = await prisma.seller.findOne({ where: { id: req.sellerId } });
  req.seller = seller;

  next();
});

server.express.use(async (req: any, res, next) => {
  if (!req.userId) return next();

  const user = await prisma.user.findOne({ where: { id: req.userId } });

  req.user = user;

  next();
});

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
