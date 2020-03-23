'use strict';
const fs = require('fs');
const csvConverter = require('csv-to-js-parser');
const csvToObj =csvConverter.csvToObj;
const objToCsv = csvConverter.objToCsv;
const combineArrays = csvConverter.combineArrays;
const separateArrays = csvConverter.separateArrays;

const data = fs.readFileSync('data.csv').toString();

const description =
	{
		customer_id: {constant: true, type: 'number', mainKey: true},
		product: {constant: false, type: 'string'},
		product_id:{constant: false, type: 'number'},
		customer_name: {constant: true, type: 'string'},
		price: {constant: false, type: 'number'},
		closed: {constant: false, type: 'boolean'},
		customer_status: {constant: true, type: 'number'}
	};

//Csv to JavaScript object
let obj;
obj = csvToObj(data, ';', description);
console.log('Object:');
console.log(obj);
console.log();

//Combine arrays in obj
obj = combineArrays(obj, 'products', ['product_id', 'product', 'price', 'closed'], ['product_id', 'name', 'price', 'closed']);
const util = require('util');
console.log('Combined arrays object:')
console.log(util.inspect(obj, false, 3)); //using util.inspect to show objects in arrays
console.log();

//Saving to JSON:
const json = JSON.stringify(obj, null, ' ');
fs.writeFileSync('data.json', json);

//Separate arrays
obj = separateArrays(obj, 'products', ['product_id', 'name', 'price', 'closed'], ['product_id', 'product', 'price', 'closed']);
console.log('Separate arrays object (should equal first object)');
console.log(obj);

//JavaScript object to csv
const csv = objToCsv(obj, ';');
fs.writeFileSync('newData.csv', csv);
