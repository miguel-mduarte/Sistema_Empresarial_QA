const express = require("express");
const ColaboradorController = require("./controllers/colaboradorController");
const FolhaPagamentoController = require("./controllers/folhaPagamentoController");
const ColaboradorRepository = require("./repositories/colaboradorRepository");
const ColaboradorService = require("./services/colaboradorService");
const FolhaPagamentoService = require("./services/folhaPagamentoService");

function createApp({ databasePath } = {}) {
  const app = express();
  const repository = new ColaboradorRepository(databasePath);
  const colaboradorService = new ColaboradorService(repository);
  const colaboradorController = new ColaboradorController(colaboradorService);
  const folhaPagamentoService = new FolhaPagamentoService(colaboradorService);
  const folhaPagamentoController = new FolhaPagamentoController(
    folhaPagamentoService,
  );

  app.use(express.json());

  app.get(
    "/api/folha-pagamento",
    folhaPagamentoController.gerar.bind(folhaPagamentoController),
  );
  app.get(
    "/api/colaboradores",
    colaboradorController.listar.bind(colaboradorController),
  );
  app.get(
    "/api/colaboradores/:matricula",
    colaboradorController.buscarPorMatricula.bind(colaboradorController),
  );
  app.post(
    "/api/colaboradores",
    colaboradorController.cadastrar.bind(colaboradorController),
  );

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
