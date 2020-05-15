import { objectType } from "@nexus/schema";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id()
  },
});


export const Like = objectType({
  name: "Like",
  definition(t) {
    t.model.id()
  
  },
});

