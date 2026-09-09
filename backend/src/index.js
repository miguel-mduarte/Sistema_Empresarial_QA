require("dotenv").config({ quiet: true });

const createApp = require("./app");

const port = Number(process.env.PORT) || 3000;
const app = createApp({
  databasePath: process.env.COLABORADORES_DB_PATH,
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
