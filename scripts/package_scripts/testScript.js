/* eslint-env node */
const { spawn } = require("child_process");

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

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
