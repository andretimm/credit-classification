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
    console.log(base)
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


    // Pega as colunas da entrada para tratamento
    entradas.map(number => {
        vlSalario = _.concat(vlSalario, number[0]);
        idade = _.concat(idade, number[1]);
        vlEmprestimo = _.concat(vlEmprestimo, number[2]);
    });
    let retorno = geraMaxMin(vlSalario,idade,vlEmprestimo);  

    // Separo o maximo do minimo
    let maximo = retorno[0];
    let minimo = retorno[1];

    // Realiza o ajuste de escala
    vlSalario = ajusteEscala(vlSalario, maximo.salario, minimo.salario);
    idade = ajusteEscala(idade, maximo.idade, minimo.idade);
    vlEmprestimo = ajusteEscala(vlEmprestimo, maximo.emprestimo, minimo.emprestimo);

    return [{ Input: [1, 2, 3], Output: [1, 0] }];
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