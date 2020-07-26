import { mutationType } from "@nexus/schema";
import { USERS } from "./Users/Users";
import { UserAddress } from "./Address/Address";
import { Seller } from "./Seller/Seller";
import { Items } from "./Items/Itmes";
import { Admin } from "./Admin/Admin";

export const Mutation = mutationType({
  definition(t) {
    USERS(t);
    UserAddress(t);
    Seller(t);
    Items(t);
    Admin(t);
  },
});
