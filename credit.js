var fs = require('file-system');
var fastCsv = require("fast-csv");
var _ = require('lodash');
var synaptic = require('synaptic');
var arquivoCSV = fs.createReadStream("credit-data.csv");
var csv = [];
var entradas = [];
var saidas = [];
const PAGOU = '1';


/**
 * Ler o csv com o dados
 */
var csvStream = fastCsv.parse().on("data", function (data) {
    csv.push(data[0].split(";"));
}).on("end", function () {
    // Chama a funcao principal
    inicio();
});

arquivoCSV.pipe(csvStream);

/**
 * Chama as demais funcoes
 */
function inicio() {
    separaEntradaSaida();
    let base = preparaBase();   
    treinaRede(base);
}

/**
 * Realiza o treinamento da rede
 * @param {*} base 
 */
function treinaRede(base) {
    // Cria perceptron com 3 entradas, 6 neuronios na camada oculta e 2 saidas
    let network = new synaptic.Architect.Perceptron(3, 6, 2);
    // Instancia o objeto para realizar o treinamento
    let trainer = new synaptic.Trainer(network);

    /**
     * Configura para treinar
     * Taxa de aprendizagem : 0.003
     * Epocas: 1000000
     * Taxa Erro : 0.01%
     */
    trainer.train(base, {
        rate: 0.003,
        iterations: 1000000,
        error: 0.0001,
        shuffle: false,
        log: 1000,
        cost: synaptic.Trainer.cost.CROSS_BINARY
    });
}

/**
 * Separa os dados de entrada dos de saidas
 */
function separaEntradaSaida() {
    csv.map((valor, i) => {
        entradas.push(_.slice(valor, 1, 4));
        saidas.push(ajustaSaidas(_.slice(valor, 4, 5)[0]));
    });
    entradas.map((valor, i) => {
        valor[1] = entradas[i][1].split(".").shift();
    });
}

/**
 * Realiza os ajuste nos valores da base
 */
function preparaBase() {
    let idade = [];
    let vlSalario = [];
    let vlEmprestimo = [];
    let base = [];

    // Pega as colunas da entrada para tratamento
    entradas.map(number => {
        vlSalario = _.concat(vlSalario, number[0]);
        idade = _.concat(idade, number[1]);
        vlEmprestimo = _.concat(vlEmprestimo, number[2]);
    });
    let retorno = geraMaxMin(vlSalario, idade, vlEmprestimo);

    // Separo o maximo do minimo
    let maximo = retorno[0];
    let minimo = retorno[1];

    // Realiza o ajuste de escala
    vlSalario = ajusteEscala(vlSalario, maximo.salario, minimo.salario);
    idade = ajusteEscala(idade, maximo.idade, minimo.idade);
    vlEmprestimo = ajusteEscala(vlEmprestimo, maximo.emprestimo, minimo.emprestimo);

    // Coloca as colunas ajustadas na variavel de entrada, e ja realizar o input dos dados
    entradas.map((valor, index) => {
        valor[0] = vlSalario[index];
        valor[1] = idade[index];
        valor[2] = vlEmprestimo[index];
        // Cria var base para treinamento com entradas x saidas
        base.push({
            input: valor,
            output: saidas[index]
        });
    });

    return base;
}

/**
 * Retorna os maximos e minimos
 * @param {Float} vlSalario 
 * @param {int} vlIdade 
 * @param {Float} vlEmprestimo 
 */
function geraMaxMin(vlSalario, vlIdade, vlEmprestimo) {
    let mm = [{
        salario: _.max(vlSalario),
        idade: _.max(vlIdade),
        emprestimo: _.max(vlEmprestimo)
    }, {
        salario: _.min(vlSalario),
        idade: _.min(vlIdade),
        emprestimo: _.min(vlEmprestimo)
    }];

    return mm;
}

/**
 * Retorna um array onde:
 * [1, 0] -> Aprovado
 * [0, 1] -> Reprovado
 * @param {String} vlSaida 
 */
function ajustaSaidas(vlSaida) {
    if (vlSaida === PAGOU) {
        return [1, 0];
    } else {
        return [0, 1];
    }
}

/**
 * Retorna a coluna com o ajuste de escalas para nao haver informação com peso maior
 * @param {Float} coluna 
 * @param {Float} max 
 * @param {Float} min 
 */
function ajusteEscala(coluna, max, min) {
    let novaColuna = [];
    for (var i = 0; i < coluna.length; i++) {
        novaColuna[i] = (coluna[i] - min) / (max - min);
    }
    return novaColuna;
}