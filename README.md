# Rede Neural para classifica��o de risco de cr�tido

Bibliotecas utilizadas :
* `Lodash` : Utilizado para manipula��o de array.
* `Fast-csv` : Utilizado para leitura dos arquivos csv's.
* `Synapctic.js` : Utilizado para criar e configurar a rede neural.

#### Instalar depend�ncias
```shell
$ npm install
```
#### Executar a rede
```shell
$ node credit.js
```

O objetivo da rede, � analisar a base de dados  [credit-data.csv](https://github.com/andretimm/credit-classification/blob/master/credit-data.csv), que cont�m os os dados de pessoas que realizaram empr�stimos a um banco, nessa base mostra se a pessoa pagou ou n�o. Ent�o com base nesses dados a rede se baseia na idade, renda e valor de empr�stimo, para ver o percentual de risco, que o banco corre quando uma nova pessoa realiza um empr�stimo. 

Apos a rede estar treinada, ela usa os dados, [credit-teste.csv](https://github.com/andretimm/credit-classification/blob/master/credit-teste.csv) , para tentar validar a precis�o da rede. Nessa base tem os mesmo tipos de informa��es da base anterior, mas com outros valores, e se a pessoa pagou ou n�o. 