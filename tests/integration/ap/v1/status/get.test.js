test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const data = await response.json();

  expect(response.status).toBe(200);
  // expect(data).toBe({ status: "Alunos do curso.dev são acima de média." });
});
