import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function executeWithDatabaseClient(fn) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    return await fn(dbClient);
  } finally {
    await dbClient?.end();
  }
}

function getMigrationsOptions(client, dryRun = true) {
  return {
    dbClient: client,
    dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}

async function getHandler(request, response) {
  const pendingMigrations = await executeWithDatabaseClient((client) =>
    migrationRunner(getMigrationsOptions(client)),
  );

  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await executeWithDatabaseClient((client) =>
    migrationRunner(getMigrationsOptions(client, false)),
  );

  if (migratedMigrations.length > 0)
    return response.status(201).json(migratedMigrations);

  return response.status(200).json(migratedMigrations);
}
