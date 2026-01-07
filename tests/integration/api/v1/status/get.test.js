test("GET to api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  //testar se retonar a versão correta
  const postgresVersion = responseBody.dependences.database.postgres_version;
  expect(postgresVersion).toEqual("16.11");

  //testa se retonar o número de maxConnections
  const maxConnections = responseBody.dependences.database.max_connections;
  expect(Number.isInteger(maxConnections)).toBe(true);

  // teste de número de usedConnections
  const usedConnections = responseBody.dependences.database.opened_connections;
  expect(usedConnections).toBe(1);
});
