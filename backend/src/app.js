const express = require("express");
const ColaboradorController = require("./controllers/colaboradorController");
const ColaboradorRepository = require("./repositories/colaboradorRepository");
const ColaboradorService = require("./services/colaboradorService");

function createApp({ databasePath } = {}) {
  const app = express();
  const repository = new ColaboradorRepository(databasePath);
  const service = new ColaboradorService(repository);
  const controller = new ColaboradorController(service);

  app.use(express.json());

  app.get("/api/colaboradores", controller.listar.bind(controller));
  app.get(
    "/api/colaboradores/:matricula",
    controller.buscarPorMatricula.bind(controller),
  );
  app.post("/api/colaboradores", controller.cadastrar.bind(controller));

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return res.status(400).json({ mensagem: "O corpo da requisição contém JSON inválido." });
    }

    const statusCode = error.statusCode ?? 500;
    const mensagem = statusCode === 500
      ? "Não foi possível acessar o banco de dados de colaboradores."
      : error.message;

    return res.status(statusCode).json({ mensagem });
  });

  return app;
}

module.exports = createApp;
