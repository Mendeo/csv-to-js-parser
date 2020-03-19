'use strict';
//module.exports.f = function(a, b) {return a * b}

const path = require('path');
//const fs = require('fs');
//const CSV_PATH = process.argv[2];
//const OUT_FILE = path.join(path.dirname(CSV_PATH), path.basename(CSV_PATH, '.csv') + '.json');
const CONSTANTS = process.argv[3].split(','); //Константные параметры.
const NEW_ROW = '\r\n';
const CSV_DELIM = ';';

console.log('Reading file ' + CSV_PATH);
let data = fs.readFileSync(CSV_PATH).toString().split(NEW_ROW);
let header = data[0].split(CSV_DELIM);

let constants = {};
let constantsIndexes = {};
CONSTANTS.forEach((index) => 
	{
		constants[header[index]] = '';
		constantsIndexes[header[index]] = index;
	});

let arrays = {};
let arraysIndexes = {};
for (let i = 0; i < header.length; i++)	
{
	if (!CONSTANTS.includes(String(i)))
	{
		arrays[header[i]] = [];
		arraysIndexes[header[i]] = i;
	}
}

let mainKey;
for (let key in constants)
{
	mainKey = key;
	break;
}

console.log();
console.log('constants:');
for (let key in constants) console.log(key);
console.log();
console.log('arrays:');
for (let key in arrays) console.log(key);
console.log();

let startRow = 1;
let index = startRow;
let mainValueOld;
let mainValue;
let row;
let flag = true;
let out = [];
console.log('Converting data');

while(flag)
{
	for (let key in arrays) arrays[key] = [];
	if (index === startRow)
	{
		row = data[index].split(CSV_DELIM);
		mainValueOld = row[constantsIndexes[mainKey]];
		mainValue = mainValueOld;
	}
	for (let key in constants) constants[key] = row[constantsIndexes[key]];
	while(mainValue === mainValueOld)
	{
		for (let key in arrays) arrays[key].push(row[arraysIndexes[key]]);
		index++;
		if (index === data.length || !data[index])
		{
			flag = false;
			break;
		}
		row = data[index].split(CSV_DELIM);
		mainValue = row[constantsIndexes[mainKey]];
	}
	let outElement = {};
	for (let key in constants) outElement[key] = constants[key];
	for (let key in arrays) outElement[key] = arrays[key];
	out.push(outElement);
	if (flag)
	{
		mainValueOld = mainValue;
	}
}
console.log('Writing data');
fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, '\t'));
console.log(`Count = ${out.length}`);
