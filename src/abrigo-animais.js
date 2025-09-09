export default class AbrigoAnimais {
  constructor() {
    this.animais = {
      Rex: { tipo: "cão", brinquedos: ["RATO", "BOLA"] },
      Mimi: { tipo: "gato", brinquedos: ["BOLA", "LASER"] },
      Fofo: { tipo: "gato", brinquedos: ["BOLA", "RATO", "LASER"] },
      Zero: { tipo: "gato", brinquedos: ["RATO", "BOLA"] },
      Bola: { tipo: "cão", brinquedos: ["CAIXA", "NOVELO"] },
      Bebe: { tipo: "cão", brinquedos: ["LASER", "RATO", "BOLA"] },
      Loco: { tipo: "jabuti", brinquedos: ["SKATE", "RATO"] },
    };
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, listaAnimais) {
    const pessoa1 = this._toArray(brinquedosPessoa1);
    const pessoa2 = this._toArray(brinquedosPessoa2);
    const ordem = this._toArray(listaAnimais);

    const erro = this._validaEntradas(pessoa1, pessoa2, ordem);
    if (erro) return { erro };

    let resultado = [];
    let adotados = { pessoa1: [], pessoa2: [] };

    for (let nome of ordem) {
      const destino = this._decideDestino(
        nome,
        pessoa1,
        pessoa2,
        adotados,
        resultado
      );
      resultado.push(`${nome} - ${destino}`);
    }

    resultado.sort();
    return { lista: resultado };
  }

  _toArray(str) {
    return str.split(",").map((s) => s.trim());
  }

  _validaEntradas(p1, p2, ordem) {
    const brinquedosValidos = [
      "RATO",
      "BOLA",
      "LASER",
      "CAIXA",
      "NOVELO",
      "SKATE",
    ];

    const setAnimais = new Set(ordem);
    for (let animal of ordem) {
      if (!this.animais[animal]) {
        return "Animal inválido";
      }
    }
    if (setAnimais.size !== ordem.length) {
      return "Animal inválido";
    }

    const setP1 = new Set(p1);
    if (setP1.size !== p1.length) {
      return "Brinquedo inválido";
    }
    for (let b of p1) {
      if (!brinquedosValidos.includes(b)) {
        return "Brinquedo inválido";
      }
    }

    const setP2 = new Set(p2);
    if (setP2.size !== p2.length) {
      return "Brinquedo inválido";
    }
    for (let b of p2) {
      if (!brinquedosValidos.includes(b)) {
        return "Brinquedo inválido";
      }
    }

    return null;
  }

  _decideDestino(nomeAnimal, pessoa1, pessoa2, adotados, resultado) {
    const animal = this.animais[nomeAnimal];
    if (!animal) return "abrigo";

    const favoritos = animal.brinquedos;
    let atendeP1, atendeP2;

    // 🔹 Regra geral: subsequência (ou todos, no caso do Loco)
    if (nomeAnimal === "Loco") {
      atendeP1 = favoritos.every((f) => pessoa1.includes(f));
      atendeP2 = favoritos.every((f) => pessoa2.includes(f));
    } else {
      atendeP1 = this._isSubsequence(favoritos, pessoa1);
      atendeP2 = this._isSubsequence(favoritos, pessoa2);
    }

    // 🔹 Regra: cada pessoa pode ter no máximo 3 animais
    if (atendeP1 && adotados.pessoa1.length >= 3) atendeP1 = false;
    if (atendeP2 && adotados.pessoa2.length >= 3) atendeP2 = false;

    // 🔹 Regra: Loco só vai se já houver outro animal na casa
    if (nomeAnimal === "Loco") {
      if (atendeP1 && adotados.pessoa1.length === 0) atendeP1 = false;
      if (atendeP2 && adotados.pessoa2.length === 0) atendeP2 = false;
    }

    // 🔹 Regra: gatos não dividem brinquedos
    if (animal.tipo === "gato") {
      if (!adotados.brinquedosGatos) {
        adotados.brinquedosGatos = new Set();
      }
      const usados = adotados.brinquedosGatos;
      if (atendeP1 || atendeP2) {
        const conflito = favoritos.some((b) => usados.has(b));
        if (conflito) {
          atendeP1 = false;
          atendeP2 = false;
        }
      }
    }

    // 🔹 Decisão final
    if (atendeP1 && atendeP2) {
      return "abrigo";
    } else if (atendeP1) {
      adotados.pessoa1.push(nomeAnimal);
      if (animal.tipo === "gato") {
        favoritos.forEach((b) => adotados.brinquedosGatos.add(b));
      }
      return "pessoa 1";
    } else if (atendeP2) {
      adotados.pessoa2.push(nomeAnimal);
      if (animal.tipo === "gato") {
        favoritos.forEach((b) => adotados.brinquedosGatos.add(b));
      }
      return "pessoa 2";
    } else {
      return "abrigo";
    }
  }

  _isSubsequence(necessarios, pessoa) {
    let i = 0;
    for (let brinquedo of pessoa) {
      if (brinquedo === necessarios[i]) {
        i++;
        if (i === necessarios.length) return true;
      }
    }
    return i === necessarios.length;
  }
}
