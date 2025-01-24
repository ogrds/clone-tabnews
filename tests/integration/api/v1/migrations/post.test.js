import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const responseOne = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(responseOne.status).toBe(201);

        const responseOneBody = await responseOne.json();

        expect(Array.isArray(responseOneBody)).toBe(true);
        expect(responseOneBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const responseTwo = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(responseTwo.status).toBe(200);

        const responseTwoBody = await responseTwo.json();

        expect(Array.isArray(responseTwoBody)).toBe(true);
        expect(responseTwoBody.length).toBe(0);
      });
    });
  });
});
