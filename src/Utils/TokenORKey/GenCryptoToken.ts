import crypto from "crypto";

function resetPasswordToken() {
  return crypto.randomBytes(64).toString("hex");
}
function validateEmailToken() {
  return crypto.randomBytes(64).toString("hex");
}

export { resetPasswordToken, validateEmailToken };
