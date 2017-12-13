var fs = require('file-system');
var fastCsv = require("fast-csv");
var _ = require('lodash');
var synaptic = require('synaptic');
var arquivoCSV = fs.createReadStream("credit-data.csv");
var csv = [];
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
function inicio(){
    separaEntradaSaida();
}

/**
 * Separa os dados de entrada dos de saidas
 */
function separaEntradaSaida(){
    let entradas = [];
    let saidas = [];
    csv.map((valor, i) => {
        entradas.push(_.slice(valor, 1, 4));
        saidas.push(ajustaSaidas(_.slice(valor, 4, 5)[0]));
    });
    entradas.map((valor, i) => {        
        valor[1] = entradas[i][1].split(".").shift();        
    });
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