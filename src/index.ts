import "./env";
import { PrismaClient } from "@prisma/client";
import { GraphQLServer } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import cookieParser from "cookie-parser";
import createServer from "./server";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import { Request, Response } from "express-serve-static-core";

// process.env.NODE_ENV = "production";

const server: GraphQLServer = createServer();
server.express.use(cookieParser());
server.express.use(helmet());
server.express.use(logger("dev"));

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

server.express.use((req, res, next) => {
  // const { token } = req.cookies;
  let token = getTokenFromReq(req);
  if (!token) token = getCookieFromReq(req, "token") || "";

  if (token) {
    const { sellerId }: any = jwt.verify(token, process.env.APP_SECRET || "");
    const { userId }: any = jwt.verify(token, process.env.APP_SECRET || "");
    req.sellerId = sellerId;

    req.userId = userId;
  }

  next();
});

server.express.use(async (req, res, next) => {
  if (!req.sellerId) return next();
  const seller = await prisma.seller.findOne({ where: { id: req.sellerId } });
  req.seller = seller;

  next();
});

server.express.use(async (req, res, next) => {
  if (!req.userId) return next();

  const user = await prisma.user.findOne({ where: { id: req.userId } });

  req.user = user;

  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
    // //in order to know which user is logedin in subscription
    // subscriptions: {
    //   path: "/subscriptions",
    //   onConnect: async (connectionPrams: any) => {
    //     try {
    //       const HEADER = connectionPrams.Authorization;
    //       const token = HEADER.split(" ")[1];
    //       if (token) {
    //         const User = await DecaodeJWT(token);
    //         if (User) {
    //           const userId = User.userId;
    //           const user = await prisma.user.findOne({ where: { id: userId } });
    //           return {
    //             currentUser: user
    //           };
    //         }
    //       }
    //     } catch (error) {
    //       console.log(error.message);
    //     }

    //     throw new Error("ACCESS DENIED,  AUTHORISATION FAILED");
    //   }
    // }
  },

  (deets) => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
