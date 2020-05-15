export const FourDigitKey: string = Math.floor(
  Math.random() * 100000
).toString();

export const ElevenDigitKey: string = Math.random()
  .toString(36)
  .substr(2);
