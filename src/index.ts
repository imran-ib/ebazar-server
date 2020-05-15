import "./env";
import { PrismaClient } from "@prisma/client";
import { GraphQLServer } from "graphql-yoga";

import helmet from "helmet";
import logger from "morgan";
import cookieParser from "cookie-parser";
import createServer from "./server";
import { authenticateJwt } from "./Utils/PassportJs/jwtStrategy";
import { DecaodeJWT } from "./Utils/JWT/GenerateJwt";

const prisma = new PrismaClient();

const server: GraphQLServer | any = createServer();

server.express.use(cookieParser());
server.express.use(helmet());
server.express.use(logger("dev"));
server.express.use(authenticateJwt);

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    },
    //in order to know which user is logedin in subscription
    subscriptions: {
      path: "/subscriptions",
      onConnect: async (connectionPrams: any) => {
        try {
          const HEADER = connectionPrams.Authorization;
          const Token = HEADER.split(" ")[1];
          if (Token) {
            const User = await DecaodeJWT(Token);
            if (User) {
              const userId = User.userId;
              const user = await prisma.user.findOne({ where: { id: userId } });
              return {
                currentUser: user
              };
            }
          }
        } catch (error) {
          console.log(error.message);
        }

        throw new Error("ACCESS DENIED,  AUTHORISATION FAILED");
      }
    }
  },

  (deets: { port: any }) => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
