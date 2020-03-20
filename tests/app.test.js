'use strict';
//const fs = require('fs');
const app = require('../app');

const normal_csv =
`customer_id;name;product;price;closed
1;Bob;computer;550;true
1;Bob;monitor;400;false
1;Bob;mobile phone;970;true
2;Alice;laptop;1200;true
2;Alice;mouse;7;false
3;Eve;microphone;20;true
3;Eve;router;105;false
3;Eve;mobile phone;110;false
`;

const not_normal_csv =
`customer_id;name;product;price;closed
3;Eve;router;105;false
1;Bob;monitor;400;false
2;Alice;mouse;7;false
1;Bob;;970;true
2;Alice;laptop;1200;
3;Eve;mobile phone;110;false
1;Bob;computer;;true
3;Eve;microphone;20;true



`;


const not_normal_csv_sorted =
`customer_id;name;product;price;closed
1;Bob;computer;;true
1;Bob;monitor;400;false
1;Bob;;970;true
2;Alice;laptop;1200;
2;Alice;mouse;7;false
3;Eve;microphone;20;true
3;Eve;router;105;false
3;Eve;mobile phone;110;false
`;

const normal_obj = 
[
	{
		customer_id: 1,
		name: 'Bob',
		product: ['computer', 'monitor', 'mobile phone'],
		price: [550, 400, 970],
		closed: [true, false, true]
	},
	{
		customer_id: 2,
		name: 'Alice',
		product: ['laptop', 'mouse'],
		price: [1200, 7],
		closed: [true, false]
	},
	{
		customer_id: 3,
		name: 'Eve',
		product: ['microphone', 'router', 'mobile phone'],
		price: [20, 105, 110],
		closed: [true, false, false]
	}
]

const not_normal_obj = 
[
	{
		customer_id: 1,
		name: 'Bob',
		product: ['computer', 'monitor', null],
		price: [null, 400, 970],
		closed: [true, false, true]
	},
	{
		customer_id: 2,
		name: 'Alice',
		product: ['laptop', 'mouse'],
		price: [1200, 7],
		closed: [null, false]
	},
	{
		customer_id: 3,
		name: 'Eve',
		product: ['microphone', 'router', 'mobile phone'],
		price: [20, 105, 110],
		closed: [true, false, false]
	}
]

const description =
	{
		customer_id: {constant: true, type: 'number', notNull: true},
		product: {constant: false, type: 'string'},
		name: {constant: true, type: 'string'},
		price: {constant: false, type: 'number'},
		closed: {constant: false, type: 'boolean'}
	};

describe('Tests for csvToObj convertion', () =>
{
	function doTest(csv, expected)
	{
		const result = app.csvToObj(csv, ';', description);
		let msg = whereNotEqual(expected, result);
		if (msg) throw new Error(msg);
	}
	it ('should return normal object', () => doTest(normal_csv, normal_obj));
	it ('should return not_normal object', () => doTest(not_normal_csv, not_normal_obj));
});

describe('Tests for objToCsv conversion', () =>
{
	function doTest(obj, expected)
	{
		const result = app.objToCsv(obj, ';');
		//fs.writeFileSync('expected.csv', expected);
		//fs.writeFileSync('result.csv', result);
		if (result !== expected) throw new Error(`Expected:\n${expected}\n\nBut got:\n${result}`);
	}
	it('should return normal_csv', () => doTest(normal_obj, normal_csv));
	it('should return not_normal_csv_sorted', () => doTest(not_normal_obj, not_normal_csv_sorted));
});
//Function shows where difference between expected object and result object
function whereNotEqual(expected, result)
{
	let flag = false;
	for (let i = 0; i < expected.length; i++)
	{
		for (let key in expected[i])
		{
			if (Array.isArray(expected[i][key]))
			{
				let expectedArr = expected[i][key].slice().sort(); //it should not depends from order
				let resultArr = result[i][key].slice().sort();
				for (let j = 0; j < expectedArr.length; j++)
				{
					if (expectedArr[j]!== resultArr[j])
					{
						flag = true;
						break;
					}
				}
			}
			else
			{
				if (expected[i][key] !== result[i][key]) flag = true;
			}
			if (flag) return `Expected:\n${key}: ${JSON.stringify(expected[i][key], null, ' ')}\n\nBut got:\n${key}: ${JSON.stringify(result[i][key], null, ' ')}`;
		}
	}
	return false;
}
