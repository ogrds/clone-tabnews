import database from "../../../../infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1+1 as sum;");
  console.log("result", result.rows);
  response
    .status(200)
    .json({ status: "Alunos do curso.dev são acima de média." });
}

export default status;
