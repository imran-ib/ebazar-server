import { Context } from "graphql-yoga/dist/types";

async function IsAdmin(ctx: Context) {
  const user = await ctx.prisma.query.user(
    {
      where: {
        id: ctx.request.userId
      }
    },
    `{
              id
              name
              email
              permissions
            }`
  );
  if (!user) throw new Error("You Must Login ");

  return user.permissions.includes("ADMIN");
}

export default IsAdmin;
