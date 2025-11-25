import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function createNewClient() {
  const dbClient = await database.getNewClient();

  return {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}

async function getHandler(request, response) {
  const migrationRunnerConfig = await createNewClient();

  try {
    const pendingMigrations = await migrationRunner(migrationRunnerConfig);
    return response.status(200).json(pendingMigrations);
  } finally {
    await migrationRunnerConfig.dbClient.end();
  }
}

async function postHandler(request, response) {
  const migrationRunnerConfig = await createNewClient();

  try {
    const migratedMigrations = await migrationRunner({
      ...migrationRunnerConfig,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  } finally {
    await migrationRunnerConfig.dbClient.end();
  }
}
