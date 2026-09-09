const FolhaPagamentoService = require("../services/folhaPagamentoService");

class FolhaPagamentoController {
  constructor(service = new FolhaPagamentoService()) {
    this.service = service;
  }

  gerar(req, res, next) {
    try {
      return res.status(200).json(this.service.gerar());
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = FolhaPagamentoController;
