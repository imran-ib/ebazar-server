import { mutationType } from "@nexus/schema";

import { USERS } from "./Users/Users";


export const Mutation = mutationType({
  definition(t) {
    USERS(t);
  }
});
