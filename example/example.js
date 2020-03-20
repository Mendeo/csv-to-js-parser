'use strict';
const fs = require('fs');
const csvToObj = require('../app').csvToObj;
const objToCsv = require('../app').objToCsv;

const data = fs.readFileSync('data.csv').toString();

const description =
	{
		customer_id: {constant: true, type: 'number', mainKey: true},
		product: {constant: false, type: 'string'},
		name: {constant: true, type: 'string'},
		price: {constant: false, type: 'number'},
		closed: {constant: false, type: 'boolean'}
	};

//Csv to JavaScript object
const obj = csvToObj(data, ';', description);
console.log(obj);

//Saving to JSON:
const json = JSON.stringify(obj, null, ' ');
fs.writeFileSync('data.json', json);

//JavaScript object to csv
const csv = objToCsv(obj, ';');
fs.writeFileSync('newData.csv', csv);