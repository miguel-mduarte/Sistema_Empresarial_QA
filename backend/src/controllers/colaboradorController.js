const ColaboradorService = require("../services/colaboradorService");

class ColaboradorController {
  constructor(service = new ColaboradorService()) {
    this.service = service;
  }

  cadastrar(req, res, next) {
    try {
      const colaborador = this.service.cadastrar({
        ...req.body,
        tipo: req.body?.tipo ?? req.body?.tipoColaborador,
      });

      return res.status(201).json(colaborador);
    } catch (error) {
      return next(error);
    }
  }

  listar(req, res, next) {
    try {
      return res.status(200).json(this.service.listar());
    } catch (error) {
      return next(error);
    }
  }

  buscarPorMatricula(req, res, next) {
    try {
      const { matricula } = req.params;

      const colaborador = this.service.buscarPorMatricula(matricula);

      if (!colaborador) {
        return res.status(404).json({
          mensagem: "Colaborador não encontrado.",
        });
      }

      return res.status(200).json(colaborador);
    } catch (error) {
      return next(error);
    }
  }

  alterar(req, res, next) {
    try {
      const colaborador = this.service.alterar(req.params.matricula, {
        ...req.body,
        tipo: req.body?.tipo ?? req.body?.tipoColaborador,
      });

      return res.status(200).json(colaborador);
    } catch (error) {
      return next(error);
    }
  }

  excluir(req, res, next) {
    try {
      this.service.excluir(req.params.matricula);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ColaboradorController;
