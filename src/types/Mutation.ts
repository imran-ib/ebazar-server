import { mutationType } from "@nexus/schema";
import { UserMutations } from "./Mutations/UserMutations";
import { SellerMutations } from "./Mutations/SellerMutations";
import { ItemMutations } from "./Mutations/ItemMutations";
import { AddressMutations } from "./Mutations/AddressMutations";
import { AdminMutations } from "./Mutations/AdminMutations";

export const Mutation = mutationType({
  definition(t) {
    UserMutations(t);
    SellerMutations(t);
    ItemMutations(t);
    AddressMutations(t);
    AdminMutations(t);
  },
});
