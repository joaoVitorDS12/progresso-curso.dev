const dotenv = require("dotenv");
const nextJest = require("next/jest");

const createJestConfig = nextJest();
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

dotenv.config({ path: "./.env.development" });

dotenv.config({ path: "./.env.local" });

module.exports = jestConfig;
