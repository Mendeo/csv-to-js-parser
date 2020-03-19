'use strict';
const fs = require('fs');
let data = fs.readFileSync(__dirname + '\\tests\\data_unsort.csv').toString();

module.exports.csvToObj = function(data, delimeter, constantFileds)
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
	let mainKey;
	if (!constantFileds) throw new Error('You must specify constant fields!');
	constantFileds.forEach((key) => 
		{
			constants[key] = '';
			let index = header.indexOf(key, 0);
			if (index === -1) throw new Error('Cannnot found selected constant fileds in the header');
			constantsIndexes[key] = index;
		});
	mainKey = constantFileds[0];
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
	let arrays = {};
	let arraysIndexes = {};
	for (let i = 0; i < header.length; i++)	
	{
		if (!constantFileds.includes(header[i]))
		{
			arrays[header[i]] = [];
			arraysIndexes[header[i]] = i;
		}
	}
	
	let index = 0;
	let mainValueOld;
	let mainValue;
	let flag = true;
	let out = [];
	let row;
	
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
			for (let key in arrays) arrays[key].push(row[arraysIndexes[key]]);
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
		for (let key in constants) outElement[key] = constants[key];
		for (let key in arrays) outElement[key] = arrays[key];
		out.push(outElement);
		if (flag) mainValueOld = mainValue;
	}
}

module.exports.csvToObj(data, ';', ['customer_id', 'name']);
