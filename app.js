/*
The MIT License (MIT)

Copyright (c) Aleksandr Meniailo (Александр Меняйло), Mendeo 2020 (deorathemen@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';
module.exports.csvToObj = function(data, param1, param2)
{
	if (typeof data !== 'string' || 
		(typeof param1 === 'object' && typeof param2 === 'object') ||
		(typeof param1 === 'string' && typeof param2 === 'string') ||
		(param1 && (typeof param1 !== 'object' && typeof param1 !== 'string')) ||
		(param2 && (typeof param2 !== 'object' && typeof param2 !== 'string')))
		throw new Error('Incorrect parameters');

	let description;
	let delimeter;
	if (param1 || param2)
	{
		if (param1)
		{
			if (typeof param1 === 'string')
			{
				delimeter = param1;
			}
			else 
			{
				description = param1;
			}
		
		}
		if (param2)
		{
			if (typeof param2 === 'string')
			{
				delimeter = param2;
			}
			else
			{
				description = param2;
			}
		}
	}

	if (!delimeter) delimeter = ',';

	//Spliting data by rows
	{
		//Checking row delimeter
		let newRow;
		let i = data.indexOf('\n', 0);
		if (i === -1) throw new Error('No row delimeter found');
		newRow = (data[i - 1] === '\r') ? '\r\n' : '\n';
		data = data.split(newRow);
		//Deleting last empty row
		i = data.length - 1;
		while (data[i] === '') 
		{
			data.pop();
			i--;
		}
	}
	let header = data[0].split(delimeter);
	//Making default description
	if (!description)
	{
		description = {};
		for (let key of header)
		{
			description[key] = {type: 'string', group: 1};
		}
	}

	/*
	console.log(delimeter);
	console.log(description);
	*/

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
	
	let constantsIndexes = {};
	let constantOrder = [];
	let arraysIndexes = {};
	let flag = true;

	for (let key in description)
	{
		let index = header.indexOf(key, 0); 
		if (index === -1) throw new Error('Cannnot find selected fileds in the header');
		if (Number(description[key].group) > 0)
		{
			flag = false;
			constantsIndexes[key] = index;
			constantOrder.push({group: description[key].group, key: key});
		}
		else
		{
			arraysIndexes[key] = index;
		}
	}
	if (flag) throw new Error('You have to specify at least one group field!');
	//Sorting data by groups and spliting by all constants
	{
		function compare(a, b)
		{
			if (a > b) return 1;
			if (a === b) return 0;
			return -1;
		}
		function compareObjectArray(key, type)
		{
			return function(a, b)
			{
				a = convertToType(a[key], type);
				b = convertToType(b[key], type);
				return compare(a, b);
			}
		}
		//Sorting constantOrder
		constantOrder = constantOrder.sort(compareObjectArray('group', 'number'));
		data = [data];
		for (let i = 0; i < constantOrder.length; i++)
		{
			let auxArr = [];
			for (let j = 0; j < data.length; j++)
			{
				data[j] = data[j].sort(compareObjectArray(constantsIndexes[constantOrder[i].key], description[constantOrder[i].key].type));
				auxArr.push(split(data[j], constantsIndexes[constantOrder[i].key]));
			}
			data = arrayConcat(auxArr);
		}
		function arrayConcat(data) //Concat arrays of arrays into one array
		{
			let out = [];
			for (let i = 0; i < data.length; i++)
			{
				for (let j = 0; j < data[i].length; j++)
				{
					out.push(data[i][j]);
				}
			}
			return out;
		}
		function split(data, columnIndex) //Splits array to blocks with equal values in specified column
		{
			let out = [];
			let flag = true;
			let index = 0;
			let row = data[0];
			let keyValue = row[columnIndex];
			let keyValueOld = keyValue;
			while (flag)
			{
				let auxArr = [];
				while (keyValue === keyValueOld)
				{
					auxArr.push(row);
					index++;
					if (index === data.length || !data[index])
					{
						flag = false;
						break;
					}
					row = data[index];
					keyValue = row[columnIndex];
				}
				out.push(auxArr);
				if (flag) keyValueOld = keyValue;
			}
			return out;
		}
	}

	let out = [];
	
	if (Object.keys(arraysIndexes).length) //If we have not group columns then we need create arrays in every object. Else we need put equal rows to separate objects.
	{
		for (let i = 0; i < data.length; i++)
		{
			let obj = {};
			for (let key in constantsIndexes) 
			{
				let value = data[i][0][constantsIndexes[key]];
				obj[key] = convertToType(value, description[key].type);
			}
			for (let key in arraysIndexes)
			{
				obj[key] = new Array(data[i].length);
			}
			for (let j = 0; j < data[i].length; j++)
			{
				for (let key in arraysIndexes)
				{
					let value = data[i][j][arraysIndexes[key]];
					obj[key][j] = convertToType(value, description[key].type);
				}
			}
			out.push(obj);
		}
	}
	else
	{
		for (let i = 0; i < data.length; i++)
		{
			for (let j = 0; j < data[i].length; j++)
			{
				let obj = {};
				for (let key in constantsIndexes) 
				{
					let value = data[i][j][constantsIndexes[key]];
					obj[key] = convertToType(value, description[key].type);
				}
				out.push(obj);
			}
		}
	}
	return out;

/*
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
*/

	function convertToType(value, type)
	{
		if (value === '') return null;
		switch(type.toLowerCase())
		{
			case 'string':
				return String(value);
			case 'number':
				return Number(value);
			case 'boolean':
				let val = value.toLowerCase();
				if (val === "true")
				{
					return true;
				}
				else if(val === "false")
				{
					return false;
				}
				else
				{
					throw new Error('Cannont convert boolean value');
				};
			default:
				throw new Error('Type is incorrect');
		}
	}
}

module.exports.objToCsv = function(obj, delimeter, rowDelimeter)
{
	if (!Array.isArray(obj)) throw new Error ('Object is not array');
	if (!obj[0]) throw new Error('Object error');
	if (!delimeter) delimeter = ',';
	if (!rowDelimeter)
	{
		rowDelimeter = '\n';
	}
	else if (rowDelimeter.toLowerCase() === 'lf')
	{
		rowDelimeter = '\n';
	}
	else if (rowDelimeter.toLowerCase() === 'crlf')
	{
		rowDelimeter = '\r\n';
	}
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
		if (maxArrayLength) //have array properties
		{
			for (let i = 0; i < maxArrayLength; i++)
			{
				for (let j = 0; j < keys.length; j++)
				{
					if (isConstant[j])
					{
						let val = elem[keys[j]];
						if (val !== null) out += val.toString();
					}
					else
					{
						let val = elem[keys[j]][i];
						if (val !== null) out += val.toString();
					}
					if (j !== keys.length - 1) out += delimeter;
				}
				out += rowDelimeter;
			}
		}
		else
		{
			for (let i = 0; i < keys.length; i++)
			{
				let val = elem[keys[i]];
				if (val !== null) out += val.toString();
				if (i !== keys.length - 1) out += delimeter;
			}
			out += rowDelimeter;
		}
	}
	return out;
}

module.exports.combineArrays = function(obj, newKey, arrayKeys, newArrayKeys)
{
	if (!newArrayKeys) newArrayKeys = arrayKeys;
	if (newArrayKeys.length !== arrayKeys.length) throw new Error('Parameters arrayKeys and newArrayKeys should have same length');
	if (!Array.isArray(obj)) throw new Error ('Object is not array');
	if (!obj[0]) throw new Error('Object error');
	const out = new Array(obj.length);
	for (let index = 0; index < out.length; index++)
	{
		out[index] = {};
		const elem = obj[index];
		if (!Array.isArray(elem[arrayKeys[0]])) throw new Error ('Object array property is not array');
		let newKeyObj = new Array(elem[arrayKeys[0]].length);
		for (let i = 0; i < newKeyObj.length; i++) newKeyObj[i] = {};
		for (let keyIndex = 0; keyIndex < arrayKeys.length; keyIndex++)
		{
			let key = arrayKeys[keyIndex];
			let newKey = newArrayKeys[keyIndex];
			let arr = elem[key];
			if (keyIndex > 0)
			{
				if (!Array.isArray(arr)) throw new Error ('Object array property is not array');
				if (arr.length !== newKeyObj.length) throw new Error('Arrays have different lengths');
			}
			for(let i = 0; i < arr.length; i++)	newKeyObj[i][newKey] = arr[i];
		}
		out[index][newKey] = newKeyObj;
		for (let key in elem)
		{
			if (!arrayKeys.includes(key)) out[index][key] = elem[key];
		}
	}
	return out;
}

module.exports.separateArrays = function(obj, objArrayKey, arrayKeys, newArrayKeys)
{
	if (!newArrayKeys) newArrayKeys = arrayKeys;
	if (newArrayKeys.length !== arrayKeys.length) throw new Error('Parameters arrayKeys and newArrayKeys should have same length');
	if (!Array.isArray(obj)) throw new Error ('Object is not array');
	if (!obj[0]) throw new Error('Object error');
	const out = new Array(obj.length);
	for (let index = 0; index < out.length; index++)
	{
		out[index] = {};
		const elem = obj[index];
		const objArray = elem[objArrayKey];
		if (!Array.isArray(objArray)) throw new Error ('Object array property is not array');
		for (let keyIndex = 0; keyIndex < arrayKeys.length; keyIndex++)
		{
			let newObjArray = new Array(objArray.length);
			out[index][newArrayKeys[keyIndex]] = newObjArray;
			for (let i = 0; i < objArray.length; i++)
			{
				newObjArray[i] = objArray[i][arrayKeys[keyIndex]];
			}
		}
		for (let key in elem)
		{
			if (key !== objArrayKey) out[index][key] = elem[key];
		}
	}
	return out;
}
