import { nouns, adjective } from "./Words";
export const SecretGenerator = () => {
  const randomNumber = Math.floor(Math.random() * adjective.length);
  return `${adjective[randomNumber]} ${nouns[randomNumber]}`;
};
