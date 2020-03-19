'use strict';
const fs = require('fs');
let data = fs.readFileSync(__dirname + '\\tests\\data_unsort.csv').toString();

module.exports.csvToObj = function(data, delimeter, description)
{
	//Spliting data by rows
	{
		//Checking row delimeter
		let newRow;
		let i = data.indexOf('\n', 0);
		if (i === -1) throw new Error('No row delimeter found');
		if (data[i - 1] === '\r')
		{
			newRow = '\r\n';
		}
		else
		{
			newRow = '\n';
		}
		//Deleting last empty row
		data = data.split(newRow);
		i = data.length - 1;
		while (data[i] === '') 
		{
			data.pop();
			i--;
		}
	}
	let header = data[0].split(delimeter);
	//Deleting header from data
	data.shift();
	//Spliting data by delimeter
	{
		let newData = [];
		for (let row of data)
		{
			let arr = row.split(delimeter);
			newData.push(arr);
		}
		data = newData;
	}
	
	let constants = {};
	let constantsIndexes = {};
	let mainKey; //One of the constant field
	let arrays = {};
	let arraysIndexes = {};
	let flag = true;

	for (let key in description)
	{
		let index = header.indexOf(key, 0); 
		if (index === -1) throw new Error('Cannnot found selected fileds in the header');
		if (description[key].constant)
		{
			flag = false;
			constants[key] = typeInitialisation(description[key].type);
			constantsIndexes[key] = index;
			mainKey = key;
		}
		else
		{
			arrays[key] = [];
			arraysIndexes[key] = index;
		}
	}
	if (flag) throw new Error('You must specify constant fields!');
	//Sorting data by mainKey
	{
		function compare(index)
		{
			return function(a, b)
			{
				if (a[index] > b[index]) return 1;
				if (a[index] === b[index]) return 0;
				return -1;
			};
		}
		data = data.sort(compare(constantsIndexes[mainKey]));
	}
	
	let index = 0;
	let mainValueOld;
	let mainValue;
	let out = [];
	let row;
	flag = true;
	
	//Converting to obj
	
	while(flag)
	{
		for (let key in arrays) arrays[key] = [];
		if (index === 0)
		{
			row = data[index];
			mainValueOld = row[constantsIndexes[mainKey]];
			mainValue = mainValueOld;
		}
		for (let key in constants) constants[key] = row[constantsIndexes[key]];
		while(mainValue === mainValueOld)
		{
			for (let key in arrays) arrays[key].push(convertToType(row[arraysIndexes[key]], description[key].type));
			index++;
			if (index === data.length || !data[index])
			{
				flag = false;
				break;
			}
			row = data[index];
			mainValue = row[constantsIndexes[mainKey]];
		}
		let outElement = {};
		for (let key in constants) outElement[key] = convertToType(constants[key], description[key].type);
		for (let key in arrays) outElement[key] = arrays[key];
		out.push(outElement);
		if (flag) mainValueOld = mainValue;
	}

	return out;

	function typeInitialisation(type)
	{
		switch(type.toLowerCase())
		{
			case 'string':
				return '';
			case 'number':
				return 0;
			case 'boolean':
				return false;
			default:
				throw new Error('Type is incorrect');
		}
	}

	function convertToType(value, type)
	{
		switch(type.toLowerCase())
		{
			case 'string':
				return String(value);
			case 'number':
				return Number(value);
			case 'boolean':
				return Boolean(value);
			default:
				throw new Error('Type is incorrect');
		}
	}
}

module.exports.objToCsv = function(obj, delimeter, rowDelimeter)
{
	if (!Array.isArray(obj)) throw new Error ('Object is not array');
	if (!obj[0]) throw new Error('Object error');
	if (!rowDelimeter) rowDelimeter = '\n';
	let out = '';
	let keys = []; //Saving keys order
	for (let key in obj[0]) keys.push(key);
	let isConstant = new Array(keys.length);
	for (let i = 0; i < keys.length; i++)
	{
		out += keys[i]
		if (i !== keys.length - 1) out += delimeter;
		isConstant[i] = !Array.isArray(obj[0][keys[i]]);
	}
	out += rowDelimeter;
	//Body
	for (let elem of obj)
	{
		//Get max length of val arrays
		let maxArrayLength = 0;
		for (let i = 0; i < keys.length; i++)
		{
			if (!isConstant[i])
			{
				let ln = elem[keys[i]].length;
			 	if (maxArrayLength < ln) maxArrayLength = ln;
			}
		}
		//Fill rows
		for (let i = 0; i < maxArrayLength; i++)
		{
			for (let j = 0; j < keys.length; j++)
			{
				if (isConstant[j])
				{
					out += elem[keys[j]].toString();
				}
				else
				{
					let val = elem[keys[j]][i];
					if (val) out += val.toString();	
				}
				if (j !== keys.length - 1) out += delimeter;
			}
			out += rowDelimeter;
		}
	}
	return out;
}

let desc =
	{
		customer_id: {constant: true, type: 'string'},
		product: {constant: false, type: 'string'},
		name: {constant: true, type: 'string'},
		price: {constant: false, type: 'number'},
		closed: {constant: false, type: 'boolean'}
	};

let obj = module.exports.csvToObj(data, ';', desc);
let csv = module.exports.objToCsv(obj, ';');
console.log(obj);
console.log();
console.log(csv);
