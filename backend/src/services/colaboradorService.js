const Colaborador = require("../models/colaboradorModel");
const ColaboradorRepository = require("../repositories/colaboradorRepository");

class ErroDeNegocio extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ColaboradorService {
  constructor(repository = new ColaboradorRepository()) {
    this.repository = repository;
  }

  cadastrar({ matricula, nome, salarioBase, tipo }) {
    const matriculaNormalizada = typeof matricula === "string"
      ? matricula.trim()
      : "";
    const nomeNormalizado = typeof nome === "string" ? nome.trim() : "";
    const salarioNormalizado = Number(salarioBase);

    if (
      !matriculaNormalizada
      || !nomeNormalizado
      || salarioBase === ""
      || salarioBase == null
      || !tipo
    ) {
      throw new ErroDeNegocio("Todos os campos são obrigatórios.");
    }

    if (!Number.isFinite(salarioNormalizado) || salarioNormalizado < 0) {
      throw new ErroDeNegocio(
        "O salário base deve ser um número igual ou maior que zero.",
      );
    }

    if (tipo !== "Padrão") {
      throw new ErroDeNegocio(
        "RF002 permite apenas colaboradores do tipo Padrão.",
      );
    }

    const colaboradorExistente = this.repository.listar().find(
      (colaborador) => colaborador.matricula.localeCompare(
        matriculaNormalizada,
        "pt-BR",
        { sensitivity: "accent" },
      ) === 0,
    );

    if (colaboradorExistente) {
      throw new ErroDeNegocio("A matrícula já está cadastrada.", 409);
    }

    const colaborador = new Colaborador({
      matricula: matriculaNormalizada,
      nome: nomeNormalizado,
      salarioBase: salarioNormalizado,
      tipo,
    });

    return this.repository.adicionar(colaborador);
  }

  listar() {
    return this.repository.listar();
  }

  buscarPorMatricula(matricula) {
    return this.repository.listar().find(
      (colaborador) => colaborador.matricula.localeCompare(
        matricula,
        "pt-BR",
        { sensitivity: "accent" },
      ) === 0,
    );
  }
}

module.exports = ColaboradorService;
