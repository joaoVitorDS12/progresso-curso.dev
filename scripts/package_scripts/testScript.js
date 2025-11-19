/* eslint-env node */

const run = require("./run.js");

async function main() {
  try {
    await run("npm", ["run", "services:up"]);

    await run("npx", [
      "concurrently",
      "-n",
      "next,jest",
      "--hide",
      "next",
      "-k",
      "-s",
      "command-jest",
      '"next dev"',
      '"jest --runInBand --verbose"',
    ]);

    await run("npm", ["run", "services:stop"]);

    process.exit(0);
  } catch (err) {
    console.error("❌ ERRO:", err);
    process.exit(1);
  }
}

main();
