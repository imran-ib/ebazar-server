import { mutationType } from "@nexus/schema";

import { USERS } from "./Users/Users";
import { UserAddress } from "./Address/Address";
import { Seller } from "./Seller/Seller";
import { Items } from "./Items/Itmes";

export const Mutation = mutationType({
  definition(t) {
    USERS(t);
    UserAddress(t);
    Seller(t);
    Items(t);
  },
});
