import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(_, tryNumber) {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (!response.ok) {
        const message = `HTTP error ${response.status}`;
        console.log(`[fetchStatusPage] Attempt ${tryNumber} - ${message}`);
        throw new Error(message);
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
