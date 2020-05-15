import { Context } from "./../../../context";
import { GenUserToke } from "../../../Utils/JWT/GenerateJwt";
import { User } from "@prisma/client";
import { stringArg } from "@nexus/schema";
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core";
import validateEmail from "../../../Utils/Mails/ValidateEmail";
import { SecretGenerator } from "../../../Utils/RandomWords/GenerateRandomWord";
import { Mails } from "../../../Utils/Mails/SendMail";
import AuthResolver from "../../../Utils/Auth/AuthResolver";

export const USERS = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.crud.updateOneUser();
  t.crud.deleteOneUser();

};
