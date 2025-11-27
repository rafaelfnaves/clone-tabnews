import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

const migrationRunnerOptions = (dryRun) => {
  return {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: dryRun,
    dir: join("infra", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: true,
  };
};

export default async function migrations(request, response) {
  let migrations = [];
  if (request.method === "GET") {
    migrations = await migrationRunner(migrationRunnerOptions(true));
  } else if (request.method === "POST") {
    migrations = await migrationRunner(migrationRunnerOptions(false));
  } else {
    return response.status(405).end();
  }

  response.status(200).json(migrations);
}
