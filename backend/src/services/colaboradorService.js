const ErroDeNegocio = require("../errors/erroDeNegocio");
const ColaboradorFactory = require("../factories/colaboradorFactory");
const ColaboradorRepository = require("../repositories/colaboradorRepository");
const validarColaborador = require("../validators/colaboradorValidator");

class ColaboradorService {
  constructor(repository = new ColaboradorRepository()) {
    this.repository = repository;
  }

  cadastrar(dados) {
    const dadosValidados = validarColaborador(dados);

    const colaboradorExistente = this.repository.listar().find(
      (colaborador) => colaborador.matricula.localeCompare(
        dadosValidados.matricula,
        "pt-BR",
        { sensitivity: "accent" },
      ) === 0,
    );

    if (colaboradorExistente) {
      throw new ErroDeNegocio("A matrícula já está cadastrada.", 409);
    }

    const colaborador = ColaboradorFactory.criar(dadosValidados);

    return this.repository.adicionar(colaborador);
  }

  listar() {
    return this.repository.listar().map(
      (colaborador) => ColaboradorFactory.criar(colaborador),
    );
  }

  buscarPorMatricula(matricula) {
    return this.listar().find(
      (colaborador) => colaborador.matricula.localeCompare(
        matricula,
        "pt-BR",
        { sensitivity: "accent" },
      ) === 0,
    );
  }
}

module.exports = ColaboradorService;
