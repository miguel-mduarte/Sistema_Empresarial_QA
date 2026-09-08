const Colaborador = require("../models/colaboradorModel");

class ColaboradorService {
constructor() {
this.colaboradores = [];
}

cadastrar(matricula, nome, salarioBase, tipoColaborador) {
    if (!matricula || !nome || !salarioBase || !tipoColaborador) {
        throw new Error("Todos os campos são obrigatórios.");
    }

    const colaboradorExistente = this.colaboradores.find(
        colaborador => colaborador.matricula === matricula
    );

    if (colaboradorExistente) {
        throw new Error("A matrícula já está cadastrada.");
    }

    const colaborador = new Colaborador(
        matricula,
        nome,
        salarioBase,
        tipoColaborador
    );

    this.colaboradores.push(colaborador);

    return colaborador;
}

listar() {
    return this.colaboradores;
}

buscarPorMatricula(matricula) {
    return this.colaboradores.find(
        colaborador => colaborador.matricula === matricula
    );
}

}

module.exports = ColaboradorService;