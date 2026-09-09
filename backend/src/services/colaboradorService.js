const ErroDeNegocio = require("../errors/erroDeNegocio");
const ColaboradorFactory = require("../factories/colaboradorFactory");
const ColaboradorRepository = require("../repositories/colaboradorRepository");
const validarColaborador = require("../validators/colaboradorValidator");

function matriculasIguais(primeiraMatricula, segundaMatricula) {
  return primeiraMatricula.localeCompare(
    segundaMatricula,
    "pt-BR",
    { sensitivity: "accent" },
  ) === 0;
}

class ColaboradorService {
  constructor(repository = new ColaboradorRepository()) {
    this.repository = repository;
  }

  cadastrar(dados) {
    const dadosValidados = validarColaborador(dados);

    const colaboradorExistente = this.repository.listar().find(
      (colaborador) => matriculasIguais(
        colaborador.matricula,
        dadosValidados.matricula,
      ),
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
      (colaborador) => matriculasIguais(colaborador.matricula, matricula),
    );
  }

  alterar(matriculaAtual, dados) {
    const colaboradores = this.repository.listar();
    const indiceAtual = colaboradores.findIndex(
      (colaborador) => matriculasIguais(
        colaborador.matricula,
        matriculaAtual,
      ),
    );
    const colaboradorAtual = colaboradores[indiceAtual];

    if (!colaboradorAtual) {
      throw new ErroDeNegocio("Colaborador não encontrado.", 404);
    }

    const dadosValidados = validarColaborador(dados);
    const matriculaEmUso = colaboradores.some(
      (colaborador, indice) => indice !== indiceAtual
        && matriculasIguais(
          colaborador.matricula,
          dadosValidados.matricula,
        ),
    );

    if (matriculaEmUso) {
      throw new ErroDeNegocio("A matrícula já está cadastrada.", 409);
    }

    const colaboradorAtualizado = ColaboradorFactory.criar({
      ...dadosValidados,
      id: colaboradorAtual.id,
      criadoEm: colaboradorAtual.criadoEm,
      atualizadoEm: new Date().toISOString(),
    });

    return this.repository.substituir(
      colaboradorAtual.matricula,
      colaboradorAtualizado,
    );
  }

  excluir(matricula) {
    const colaboradorAtual = this.repository.listar().find(
      (colaborador) => matriculasIguais(colaborador.matricula, matricula),
    );

    if (!colaboradorAtual) {
      throw new ErroDeNegocio("Colaborador não encontrado.", 404);
    }

    return this.repository.excluir(colaboradorAtual.matricula);
  }
}

module.exports = ColaboradorService;
