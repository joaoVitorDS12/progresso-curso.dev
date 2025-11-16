const { spawn } = require("child_process");

function run(command) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");

    const proc = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
    });

    proc.on("close", (code, signal) => {
      if (signal === "SIGINT" || signal === "SIGTERM") {
        return resolve("killed");
      }

      if (code !== 0) {
        return reject(new Error(`Command failed: ${command}`));
      }

      resolve();
    });
  });
}

let stopping = false;

function stopServices() {
  if (stopping) return;
  stopping = true;

  console.log("\n[DEV] -> Parando serviços Docker...");
  spawn("npm", ["run", "services:stop"], { stdio: "inherit", shell: true });
}

async function main() {
  process.on("SIGINT", stopServices);
  process.on("SIGTERM", stopServices);

  try {
    await run("npm run services:up");
    await run("npm run services:wait:database");
    await run("npm run migrations:up");
    await run("next dev");
  } catch (err) {
    console.log("\n[DEV] > Processo finalizado.");
  } finally {
    stopServices();
  }
}

main();
