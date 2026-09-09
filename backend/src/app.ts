import express from "express";
import dotenv from "dotenv";
import { pathToFileURL } from "node:url";
import ColaboradorRepository from "./data/colaboradorRepository.js";
import colaboradorRoutes from "./routes/colaboradorRoutes.js";
import colaboradorPadraoRoutes from "./routes/colaboradorPadraoRoutes.js";
import colaboradorComissionadoRoutes from "./routes/colaboradorComissionadoRoutes.js";
import colaboradorProducaoRoutes from "./routes/colaboradorProducaoRoutes.js";
import folhaPagamentoRoutes from "./routes/folhaPagamentoRoutes.js";
import errorHandler from "./errors/errorHandler.js";

export default function createApp({ databasePath }: { databasePath?: string } = {}) {
  const app = express();
  app.locals.colaboradorRepository = new ColaboradorRepository(databasePath);

  app.use(express.json());

  app.use("/api/colaboradores-padrao", colaboradorPadraoRoutes);
  app.use("/api/colaboradores-comissionados", colaboradorComissionadoRoutes);
  app.use("/api/colaboradores-producao", colaboradorProducaoRoutes);
  app.use("/api/colaboradores", colaboradorRoutes);
  app.use("/api/folha-pagamento", folhaPagamentoRoutes);

  app.use(errorHandler);
  return app;
}

// Executado por npm run dev / npm start; importar nos testes não abre uma porta.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  dotenv.config({ quiet: true });
  const app = createApp({ databasePath: process.env.COLABORADORES_DB_PATH });
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Servidor iniciado na porta ${port}`));
}
