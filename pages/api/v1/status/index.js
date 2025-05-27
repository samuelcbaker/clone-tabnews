import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const resultVersion = await database.query("SHOW server_version;");
  const versionValue = resultVersion.rows[0].server_version;

  const resultMaxConnections = await database.query("SHOW max_connections;");
  const maxConnectionsValue = parseInt(
    resultMaxConnections.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const resultActiveConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const activeConnectionsValue = resultActiveConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionValue,
        max_connections: maxConnectionsValue,
        opened_connections: activeConnectionsValue,
      },
    },
  });
}

export default status;
