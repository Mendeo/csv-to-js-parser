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
	customer_id:     {type: 'number', group: 1},
	product:         {type: 'string'},
	product_id:      {type: 'number'},
	customer_name:   {type: 'string', group: 2},
	price:           {type: 'number'},
	closed:          {type: 'boolean'},
	customer_status: {type: 'number', group: 2}
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
