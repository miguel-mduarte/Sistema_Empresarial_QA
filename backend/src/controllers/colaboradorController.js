const ColaboradorService = require("../services/colaboradorService");

class ColaboradorController {
constructor() {
this.service = new ColaboradorService();
}

cadastrar(req, res) {
    try {
        const {
            matricula,
            nome,
            salarioBase,
            tipoColaborador
        } = req.body;

        const colaborador = this.service.cadastrar(
            matricula,
            nome,
            salarioBase,
            tipoColaborador
        );

        return res.status(201).json(colaborador);

    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
}

listar(req, res) {
    return res.status(200).json(this.service.listar());
}

buscarPorMatricula(req, res) {
    const { matricula } = req.params;

    const colaborador = this.service.buscarPorMatricula(matricula);

    if (!colaborador) {
        return res.status(404).json({
            mensagem: "Colaborador não encontrado."
        });
    }

    return res.status(200).json(colaborador);
}

}

module.exports = ColaboradorController;