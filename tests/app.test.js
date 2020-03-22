'use strict';
const app = require('../app');

const normal_csv =
`customer_id;name;product;product_id;price;closed;status
1;Bob;computer;1;550;true;0
1;Bob;monitor;2;400;false;0
1;Bob;mobile phone;3;970;true;0
1;Bob;mouse;4;7;true;0
2;Alice;laptop;5;1200;true;1
2;Alice;mouse;4;7;false;1
3;Eve;microphone;6;20;true;1
3;Eve;router;7;105;false;1
3;Eve;laptop;5;1200;false;1
`;

const not_normal_csv =
`customer_id;name;product;price;closed;status;product_id
3;Eve;router;105;false;1;
1;Bob;monitor;400;false;0;2
2;Alice;mouse;7;false;1;4
1;Bob;;970;true;0;3
2;Alice;laptop;1200;;1;
3;Eve;laptop;1200;false;1;5
1;Bob;computer;;true;0;1
3;Eve;microphone;20;true;1;6
1;Bob;mouse;7;true;0;4



`;


const not_normal_csv_sorted =
`customer_id;name;product;price;closed;status;product_id
1;Bob;computer;;true;0;1
1;Bob;monitor;400;false;0;2
1;Bob;;970;true;0;3
1;Bob;mouse;7;true;0;4
2;Alice;laptop;1200;;1;
2;Alice;mouse;7;false;1;4
3;Eve;microphone;20;true;1;6
3;Eve;router;105;false;1;
3;Eve;laptop;1200;false;1;5
`;

const normal_obj = 
[
	{
		customer_id: 1,
		name: 'Bob',
		product: ['computer', 'monitor', 'mobile phone', 'mouse'],
		product_id: [1, 2, 3, 4],
		price: [550, 400, 970, 7],
		closed: [true, false, true, true],
		status: 0
	},
	{
		customer_id: 2,
		name: 'Alice',
		product: ['laptop', 'mouse'],
		product_id: [5, 4],
		price: [1200, 7],
		closed: [true, false],
		status: 1
	},
	{
		customer_id: 3,
		name: 'Eve',
		product: ['microphone', 'router', 'laptop'],
		product_id: [6, 7, 5],
		price: [20, 105, 1200],
		closed: [true, false, false],
		status: 1
	}
]

const not_normal_obj = 
[
	{
		customer_id: 1,
		name: 'Bob',
		product: ['computer', 'monitor', null, 'mouse'],
		price: [null, 400, 970, 7],
		closed: [true, false, true, true],
		status: 0,
		product_id: [1, 2, 3, 4]
	},
	{
		customer_id: 2,
		name: 'Alice',
		product: ['laptop', 'mouse'],
		price: [1200, 7],
		closed: [null, false],
		status: 1,
		product_id: [null, 4]
	},
	{
		customer_id: 3,
		name: 'Eve',
		product: ['microphone', 'router', 'laptop'],
		price: [20, 105, 1200],
		closed: [true, false, false],
		status: 1,
		product_id: [6, null, 5]
	}
]

const expanded_normal_obj = 
[
	{
		customer_id: 1,
		name: 'Bob',
		products:
		[
			{
				product_id: 1,
				product: 'computer',
				price: 550,
				closed: true
			},
			{
				product_id: 2,
				product: 'monitor',
				price: 400,
				closed: false
			},
			{
				product_id: 3,
				product: 'mobile phone',
				price: 970,
				closed: true
			},
			{
				product_id: 4,
				product: 'mouse',
				price: 7,
				closed: true
			}
		],
		status: 0
	},
	{
		customer_id: 2,
		name: 'Alice',
		products:
		[
			{
				product_id: 5,
				product: 'laptop',
				price: 1200,
				closed: true
			},
			{
				product_id: 4,
				product: 'mouse',
				price: 7,
				closed: false
			},
		],
		status: 1
	},
	{
		customer_id: 3,
		name: 'Eve',
		products:
		[
			{
				product_id: 6,
				product: 'microphone',
				price: 20,
				closed: true
			},
			{
				product_id: 7,
				product: 'router',
				price: 105,
				closed: false
			},
			{
				product_id: 5,
				product: 'laptop',
				price: 1200,
				closed: false
			},

		],
		status: 1
	}
]

const description =
	{
		customer_id: {constant: true, type: 'number', mainKey: true},
		product: {constant: false, type: 'string'},
		product_id:{constant: false, type: 'number'},
		name: {constant: true, type: 'string'},
		price: {constant: false, type: 'number'},
		closed: {constant: false, type: 'boolean'},
		status: {constant: true, type: 'number'}
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
