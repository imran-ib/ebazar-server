import { Context } from "./../../context";
import { objectType, stringArg } from "@nexus/schema";
import AuthResolver from "../../Utils/Auth/AuthResolver";
import { User } from "@prisma/client";
import { prisma } from "../Primsa/Prisma";

import { USERS } from "./User/User";

export const Query = objectType({
  name: "Query",
  definition(t) {
       USERS(t);
  }
});
