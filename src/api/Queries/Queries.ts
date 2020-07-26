import { objectType } from "@nexus/schema";
import { USERS } from "./User/User";
import { ITEMS } from "./Item/Item";

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.crud.addresses({
      alias: "AllAddress",
      type: "Address",
      filtering: true,
      ordering: true,
    }),
      t.crud.address({
        alias: "SingleAddress",
        type: "Address",
      }); //in use

    USERS(t);
    ITEMS(t);
  },
});
