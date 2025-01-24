import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

import database from "infra/database";

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

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method))
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(
        getMigrationsOptions(dbClient),
      );
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner(
        getMigrationsOptions(dbClient, false),
      );

      if (migratedMigrations.length > 0)
        return response.status(201).json(migratedMigrations);

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
