import Colaborador from "./colaboradorModel.js";
import type { DadosPadrao } from "./colaboradorTypes.js";

class ColaboradorPadrao extends Colaborador {
  constructor(dados: DadosPadrao) {
    super(dados);
    this.definirRemuneracao();
  }
}

export default ColaboradorPadrao;
