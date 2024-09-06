import { Animais } from "./animais.js";
import { RecintosExistentes } from "./recintos-existentes.js";

class RecintosZoo {
    constructor() {
        this.animais = new Animais();
        this.recintosExistentes = new RecintosExistentes();
    }

    analisaRecintos(animal, quantidade) {
        const todosAnimais = this.animais.getAnimais();
        if (!todosAnimais[animal]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade < 1 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, biomas } = todosAnimais[animal];
        const recintosViaveis = [];
        const recintos = this.recintosExistentes.getRecintosExistentes();

        for (const recinto of recintos) {
            if (!biomas.includes(recinto.bioma) && !(animal === 'HIPOPOTAMO' && recinto.bioma === 'savana e rio')) {
                continue;
            }

            const espacoOcupado = recinto.animaisExistentes.reduce((acc, { quantidade, tamanho }) => acc + (quantidade * tamanho), 0);
            const espacoNecessario = (recinto.animaisExistentes.length > 0 ? 1 : 0) + (quantidade * tamanho);

            if (espacoOcupado + espacoNecessario > recinto.tamanhoTotal) {
                continue;
            }

            if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animaisExistentes.length > 0) {
                continue;
            }

            if ((animal === 'LEAO' || animal === 'LEOPARDO' || animal === 'CROCODILO') && recinto.animaisExistentes.some(({ especie }) => especie !== animal)) {
                continue;
            }

            if (recinto.animaisExistentes.some(({ especie, quantidade: qtdExistente }) => {
                const { tamanho: tamanhoExistente } = todosAnimais[especie];
                const novoEspacoOcupado = espacoOcupado + (qtdExistente * tamanhoExistente) + (recinto.animaisExistentes.length > 1 ? 1 : 0);
                return novoEspacoOcupado + (quantidade * tamanho) > recinto.tamanhoTotal;
            })) {
                continue;
            }

            if (animal === 'MACACO' && (recinto.animaisExistentes.length === 0 && quantidade === 1)) {
                continue;
            }

            if (animal === 'MACACO' && recinto.animaisExistentes.length === 0 && quantidade === 1) {
                continue;
            }

            if (espacoOcupado + espacoNecessario > recinto.tamanhoTotal) {
                continue;
            }

            const espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoNecessario;
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };