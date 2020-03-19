let app = require('../app');

const path = require('path');
const fs = require('fs');
const csv_normal = fs.readFileSync(path.join(__dirname, 'data_normal.csv')).toString();
const csv_not_normal = fs.readFileSync(path.join(__dirname, 'data_not_normal.csv')).toString();

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

describe('Check csvToObj convertion', () =>
{
	function doTest(csv, expected)
	{
		const result = app.csvToObj(csv, ';', description);
		let msg = whereNotEqual(expected, result);
		if (msg) throw new Error(msg);
	}
	it ('should return correct normal object', () =>
		{
			doTest(csv_normal, normal_obj);
		});
	it ('should return correct not_normal object', () =>
		{
			doTest(csv_not_normal, not_normal_obj);
		});
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
				let expectedArr = expected[i][key].sort(); //it should not depends from order
				let resultArr = result[i][key].sort();
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
