import * as jwt from "jsonwebtoken";

export const GenerateToken = (
  userId: string | null,
  sellerId: string | null,
  response: any
): string => {
  const token: string = jwt.sign(
    { userId: userId, sellerId: sellerId },
    process.env.APP_SECRET || ""
  );

  // set JWT as cookie on the response
  response.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1year cookie
  });

  return token;
};

export const GenUserToke = (userId: string) => {
  const Token = jwt.sign({ userId: userId }, process.env.APP_SECRET || "");

  return Token;
};

export const DecaodeJWT = async (token: any): Promise<any> => {
  try {
    const decoded = await jwt.verify(token, process.env.APP_SECRET || "");

    return decoded;
  } catch (error) {
    return undefined;
  }
};
