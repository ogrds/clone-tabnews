function status(request, response) {
  response
    .status(200)
    .json({ status: "Alunos do curso.dev são acima de média." });
}

export default status;
