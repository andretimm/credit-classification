# Rede Neural para classificação de risco de crétido

Bibliotecas utilizadas :
* `Lodash` : Utilizado para manipulação de array.
* `Fast-csv` : Utilizado para leitura dos arquivos csv's.
* `Synapctic.js` : Utilizado para criar e configurar a rede neural.

#### Instalar dependências
```shell
$ npm install
```
#### Executar a rede
```shell
$ node credit.js
```

O objetivo da rede, é analisar a base de dados  [credit-data.csv](https://github.com/andretimm/credit-classification/blob/master/credit-data.csv), que contém os os dados de pessoas que realizaram empréstimos a um banco, nessa base mostra se a pessoa pagou ou não. Então com base nesses dados a rede se baseia na idade, renda e valor de empréstimo, para ver o percentual de risco, que o banco corre quando uma nova pessoa realiza um empréstimo. 

Apos a rede estar treinada, ela usa os dados, [credit-teste.csv](https://github.com/andretimm/credit-classification/blob/master/credit-teste.csv) , para tentar validar a precisão da rede. Nessa base tem os mesmo tipos de informações da base anterior, mas com outros valores, e se a pessoa pagou ou não. 