const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_DATABASE_PATH = path.resolve(
  __dirname,
  "../../data/colaboradores.json",
);

class ColaboradorRepository {
  constructor(databasePath = DEFAULT_DATABASE_PATH) {
    this.databasePath = databasePath;
    this.garantirBancoDeDados();
  }

  garantirBancoDeDados() {
    fs.mkdirSync(path.dirname(this.databasePath), { recursive: true });

    if (!fs.existsSync(this.databasePath)) {
      fs.writeFileSync(this.databasePath, "[]\n", "utf8");
    }
  }

  listar() {
    const conteudo = fs.readFileSync(this.databasePath, "utf8");
    const colaboradores = JSON.parse(conteudo);

    if (!Array.isArray(colaboradores)) {
      throw new Error("O banco de dados de colaboradores possui formato inválido.");
    }

    return colaboradores;
  }

  adicionar(colaborador) {
    const colaboradores = this.listar();
    colaboradores.push(colaborador);

    this.salvar(colaboradores);

    return colaborador;
  }

  substituir(matriculaAtual, colaboradorAtualizado) {
    const colaboradores = this.listar();
    const indice = colaboradores.findIndex(
      (colaborador) => colaborador.matricula === matriculaAtual,
    );

    if (indice === -1) return undefined;

    colaboradores[indice] = colaboradorAtualizado;
    this.salvar(colaboradores);

    return colaboradorAtualizado;
  }

  excluir(matricula) {
    const colaboradores = this.listar();
    const indice = colaboradores.findIndex(
      (colaborador) => colaborador.matricula === matricula,
    );

    if (indice === -1) return undefined;

    const [colaboradorExcluido] = colaboradores.splice(indice, 1);
    this.salvar(colaboradores);

    return colaboradorExcluido;
  }

  salvar(colaboradores) {
    const arquivoTemporario = `${this.databasePath}.${process.pid}.tmp`;
    fs.writeFileSync(
      arquivoTemporario,
      `${JSON.stringify(colaboradores, null, 2)}\n`,
      "utf8",
    );
    fs.renameSync(arquivoTemporario, this.databasePath);
  }
}

module.exports = ColaboradorRepository;
