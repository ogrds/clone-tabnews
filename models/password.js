import bcyptjs from "bcryptjs";
import crypto from "node:crypto";

async function hash(password) {
  const rounds = getNumberOfRounds();
  const pepperedPassword = applyPepperToPassword(password);
  return await bcyptjs.hash(pepperedPassword, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  const pepperedPassword = applyPepperToPassword(providedPassword);

  return await bcyptjs.compare(pepperedPassword, storedPassword);
}

function applyPepperToPassword(password) {
  const pepper = process.env.PEPPER;
  if (!pepper) return password;

  const pepperedPassword = crypto
    .createHmac("sha256", pepper)
    .update(password)
    .digest("base64");

  return pepperedPassword;
}

const password = {
  hash,
  compare,
};

export default password;
