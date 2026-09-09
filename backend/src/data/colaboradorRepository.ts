import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type Colaborador from "../models/colaboradorModel.js";
import validarColaborador, { validarObjeto } from "./colaboradorParser.js";

// Same location in src/data and dist/data; never relative to the process cwd.
const DEFAULT_DATABASE_PATH = fileURLToPath(new URL("../../data/colaboradores.json", import.meta.url));

class ColaboradorRepository {
  databasePath: string;
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
    const colaboradores: unknown = JSON.parse(conteudo);

    if (!Array.isArray(colaboradores)) {
      throw new Error("O banco de dados de colaboradores possui formato inválido.");
    }

    return colaboradores.map((entrada: unknown) => {
      try {
        const registro = validarObjeto(entrada);
        const dados = validarColaborador(registro);
        return {
          ...registro,
          ...dados,
          ...(typeof registro.id === "string" ? { id: registro.id } : {}),
          ...(typeof registro.criadoEm === "string" ? { criadoEm: registro.criadoEm } : {}),
          ...(typeof registro.atualizadoEm === "string" ? { atualizadoEm: registro.atualizadoEm } : {}),
        };
      } catch {
        throw new Error("O arquivo JSON de colaboradores possui um registro inválido.");
      }
    });
  }

  adicionar(colaborador: Colaborador) {
    const colaboradores: unknown[] = this.listar();
    colaboradores.push(colaborador);

    this.salvar(colaboradores);

    return colaborador;
  }

  substituir(matriculaAtual: string, colaboradorAtualizado: Colaborador) {
    const colaboradores: Array<{ matricula: string }> = this.listar();
    const indice = colaboradores.findIndex(
      (colaborador) => colaborador.matricula === matriculaAtual,
    );

    if (indice === -1) return undefined;

    colaboradores[indice] = colaboradorAtualizado;
    this.salvar(colaboradores);

    return colaboradorAtualizado;
  }

  excluir(matricula: string) {
    const colaboradores = this.listar();
    const indice = colaboradores.findIndex(
      (colaborador) => colaborador.matricula === matricula,
    );

    if (indice === -1) return undefined;

    const [colaboradorExcluido] = colaboradores.splice(indice, 1);
    this.salvar(colaboradores);

    return colaboradorExcluido;
  }

  salvar(colaboradores: unknown[]) {
    const arquivoTemporario = `${this.databasePath}.${process.pid}.tmp`;
    fs.writeFileSync(
      arquivoTemporario,
      `${JSON.stringify(colaboradores, null, 2)}\n`,
      "utf8",
    );
    fs.renameSync(arquivoTemporario, this.databasePath);
  }
}

export default ColaboradorRepository;
