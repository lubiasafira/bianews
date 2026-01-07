import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVersionResult = await database.query("SHOW server_version;");
  const postgres_version = postgresVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(maxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;

  const openedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::integer AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    openedConnectionsResult.rows[0].opened_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependences: {
      database: {
        postgres_version: postgres_version,
        max_connections: maxConnections,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
