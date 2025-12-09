import bcryptjs from "bcryptjs";
import { ValidationError } from "infra/errors";

async function hash(password) {
  const rounds = getNumberOfRounds();

  if (!password || typeof password !== "string" || password.trim() === "") {
    throw new ValidationError({
      message: "A senha informada é inválida ou não foi fornecida.",
      action: "Informe uma senha válida para continuar.",
    });
  }

  const peppered = applyPepper(password);
  return await bcryptjs.hash(peppered, rounds);
}

function applyPepper(password) {
  return `${process.env.PASSWORD_PEPPER}${password}${process.env.PASSWORD_PEPPER}`;
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  const peppered = applyPepper(providedPassword);
  return await bcryptjs.compare(peppered, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
