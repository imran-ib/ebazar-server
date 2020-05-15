import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.APP_SECRET
};
const veryfyUser = async (payload: any, done: any) => {
  try {
    const User = await prisma.user.findOne({
      where: { id: payload.userId }
    });

    // const [User] = await prisma.users({ where: { id: payload.id } });
    if (User !== null) {
      return done(null, User);
    } else {
      return done(null, false);
    }
  } catch (error) {
    console.log(`Ubable To create Srategy ${error.message}`);
    return done(null, false);
  }
};
//@ts-ignore
export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", (error, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

passport.use(new Strategy(JwtOptions, veryfyUser));
