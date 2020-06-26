import { objectType } from "@nexus/schema";

import { USERS } from "./User/User";

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.crud.item(); // being used
    t.crud.items({
      filtering: true,
      ordering: true,
    });
    t.crud.seller(),
      t.crud.sellers(),
      t.crud.user(),
      t.crud.addresses(),
      t.crud.users(),
      USERS(t);
  },
});
