'use strict';
const app = require('../app');

const normal_csv =
`customer_id;customer_name;customer_status;product;product_id;price;closed
1;Bob;0;computer;1;550;true
1;Bob;0;monitor;2;400;false
1;Bob;0;mobile phone;3;970;true
1;Bob;0;mouse;4;7;true
2;Alice;1;laptop;5;1200;true
2;Alice;1;mouse;4;7;false
3;Eve;1;microphone;6;20;true
3;Eve;1;router;7;105;false
3;Eve;1;laptop;5;1200;false
`;

const not_normal_csv =
`customer_id;customer_name;product;price;closed;customer_status;product_id
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
`customer_id;customer_name;product;price;closed;customer_status;product_id
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

const not_unique_csv =
`sex;age;person_id
male;30;1
male;30;3
male;31;6
male;31;4
female;31;11
male;32;7
male;31;4
female;31;12
male;31;5
male;32;7
female;30;9
female;30;10
female;30;10
male;30;2
female;33;13
female;33;14
male;32;8
female;30;9
male;31;5
female;33;14



`;

const not_unique_not_normal_csv =
`sex;age;person_id
male;30;1
male;30;3
male;31;6
male;;4
female;31;11
;32;7
male;31;4
female;31;12
male;31;5
male;32;7
female;30;9
;30;
female;30;10
male;30;2
female;33;13
female;33;14
male;32;8
female;;9
male;31;5
female;33;14

`;

const not_unique_csv_sorted_1_2 =
`sex;age;person_id
female;30;9
female;30;9
female;30;10
female;30;10
male;30;1
male;30;2
male;30;3
female;31;11
female;31;12
male;31;4
male;31;4
male;31;5
male;31;5
male;31;6
male;32;7
male;32;7
male;32;8
female;33;13
female;33;14
female;33;14
`;

const not_unique_csv_sorted_3 =
`person_id;sex;age
1;male;30
2;male;30
3;male;30
4;male;31
4;male;31
5;male;31
5;male;31
6;male;31
7;male;32
7;male;32
8;male;32
9;female;30
9;female;30
10;female;30
10;female;30
11;female;31
12;female;31
13;female;33
14;female;33
14;female;33
`;

const not_unique_not_normal_csv_sorted_1_2 =
`sex;age;person_id
female;;9
male;;4
;30;
female;30;9
female;30;10
male;30;1
male;30;2
male;30;3
female;31;11
female;31;12
male;31;4
male;31;5
male;31;5
male;31;6
male;32;7
male;32;8
;32;7
female;33;13
female;33;14
female;33;14
`;

const not_unique_obj_var1 =
[
	{
		sex: 'female',
		age: 30,
		person_id: 9
	},
	{
		sex: 'female',
		age: 30,
		person_id: 9
	},
	{
		sex: 'female',
		age: 30,
		person_id: 10
	},
	{
		sex: 'female',
		age: 30,
		person_id: 10
	},
	{
		sex: 'male',
		age: 30,
		person_id: 1
	},
	{
		sex: 'male',
		age: 30,
		person_id: 2
	},
	{
		sex: 'male',
		age: 30,
		person_id: 3
	},
	{
		sex: 'female',
		age: 31,
		person_id: 11
	},
	{
		sex: 'female',
		age: 31,
		person_id: 12
	},
	{
		sex: 'male',
		age: 31,
		person_id: 4
	},
	{
		sex: 'male',
		age: 31,
		person_id: 4
	},
	{
		sex: 'male',
		age: 31,
		person_id: 5
	},
	{
		sex: 'male',
		age: 31,
		person_id: 5
	},
	{
		sex: 'male',
		age: 31,
		person_id: 6
	},
	{
		sex: 'male',
		age: 32,
		person_id: 7
	},
	{
		sex: 'male',
		age: 32,
		person_id: 7
	},
	{
		sex: 'male',
		age: 32,
		person_id: 8
	},
	{
		sex: 'female',
		age: 33,
		person_id: 13
	},
	{
		sex: 'female',
		age: 33,
		person_id: 14
	},
	{
		sex: 'female',
		age: 33,
		person_id: 14
	}
];

const not_unique_not_normal_obj_var1 =
[
	{
		sex: 'female',
		age: null,
		person_id: 9
	},
	{
		sex: 'male',
		age: null,
		person_id: 4
	},
	{
		sex: null,
		age: 30,
		person_id: null
	},
	{
		sex: 'female',
		age: 30,
		person_id: 9
	},
	{
		sex: 'female',
		age: 30,
		person_id: 10
	},
	{
		sex: 'male',
		age: 30,
		person_id: 1
	},
	{
		sex: 'male',
		age: 30,
		person_id: 2
	},
	{
		sex: 'male',
		age: 30,
		person_id: 3
	},
	{
		sex: 'female',
		age: 31,
		person_id: 11
	},
	{
		sex: 'female',
		age: 31,
		person_id: 12
	},
	{
		sex: 'male',
		age: 31,
		person_id: 4
	},
	{
		sex: 'male',
		age: 31,
		person_id: 5
	},
	{
		sex: 'male',
		age: 31,
		person_id: 5
	},
	{
		sex: 'male',
		age: 31,
		person_id: 6
	},
	{
		sex: 'male',
		age: 32,
		person_id: 7
	},
	{
		sex: 'male',
		age: 32,
		person_id: 8
	},
	{
		sex: null,
		age: 32,
		person_id: 7
	},
	{
		sex: 'female',
		age: 33,
		person_id: 13
	},
	{
		sex: 'female',
		age: 33,
		person_id: 14
	},
	{
		sex: 'female',
		age: 33,
		person_id: 14
	}
];

const not_unique_obj_var2 =
[
	{
		sex: 'female',
		age: 30,
		person_id: [9, 9, 10, 10]
	},
	{
		sex: 'male',
		age: 30,
		person_id: [1, 2, 3]
	},
	{
		sex: 'female',
		age: 31,
		person_id: [11, 12]
	},
	{
		sex: 'male',
		age: 31,
		person_id: [4, 4, 5, 5, 6]
	},
	{
		sex: 'male',
		age: 32,
		person_id: [7, 7, 8]
	},
	{
		sex: 'female',
		age: 33,
		person_id: [13, 14, 14]
	}
];

const not_unique_not_normal_obj_var2 =
[
	{
		sex: 'female',
		age: null,
		person_id: [9]
	},
	{
		sex: 'male',
		age: null,
		person_id: [4]
	},
	{
		sex: null,
		age: 30,
		person_id: [null]
	},
	{
		sex: 'female',
		age: 30,
		person_id: [9, 10]
	},
	{
		sex: 'male',
		age: 30,
		person_id: [1, 2, 3]
	},
	{
		sex: 'female',
		age: 31,
		person_id: [11, 12]
	},
	{
		sex: 'male',
		age: 31,
		person_id: [4, 5, 5, 6]
	},
	{
		sex: 'male',
		age: 32,
		person_id: [7, 8]
	},
	{
		sex: null,
		age: 32,
		person_id: [7]
	},
	{
		sex: 'female',
		age: 33,
		person_id: [13, 14, 14]
	}
];

const not_unique_obj_var3 =
[
	{
		person_id: 1,
		sex: 'male',
		age: [30]
	},
	{
		person_id: 2,
		sex: 'male',
		age: [30]
	},
	{
		person_id: 3,
		sex: 'male',
		age: [30]
	},
	{
		person_id: 4,
		sex: 'male',
		age: [31, 31]
	},
	{
		person_id: 5,
		sex: 'male',
		age: [31, 31]
	},
	{
		person_id: 6,
		sex: 'male',
		age: [31]
	},
	{
		person_id: 7,
		sex: 'male',
		age: [32, 32]
	},
	{
		person_id: 8,
		sex: 'male',
		age: [32]
	},
	{
		person_id: 9,
		sex: 'female',
		age: [30, 30]
	},
	{
		person_id: 10,
		sex: 'female',
		age: [30, 30]
	},
	{
		person_id: 11,
		sex: 'female',
		age: [31]
	},
	{
		person_id: 12,
		sex: 'female',
		age: [31]
	},
	{
		person_id: 13,
		sex: 'female',
		age: [33]
	},
	{
		person_id: 14,
		sex: 'female',
		age: [33, 33]
	}
];

const normal_obj =
[
	{
		customer_id: 1,
		customer_name: 'Bob',
		customer_status: 0,
		product: ['computer', 'monitor', 'mobile phone', 'mouse'],
		product_id: [1, 2, 3, 4],
		price: [550, 400, 970, 7],
		closed: [true, false, true, true]
	},
	{
		customer_id: 2,
		customer_name: 'Alice',
		customer_status: 1,
		product: ['laptop', 'mouse'],
		product_id: [5, 4],
		price: [1200, 7],
		closed: [true, false]
	},
	{
		customer_id: 3,
		customer_name: 'Eve',
		customer_status: 1,
		product: ['microphone', 'router', 'laptop'],
		product_id: [6, 7, 5],
		price: [20, 105, 1200],
		closed: [true, false, false]
	}
];

const not_normal_obj =
[
	{
		customer_id: 1,
		customer_name: 'Bob',
		product: ['computer', 'monitor', null, 'mouse'],
		price: [null, 400, 970, 7],
		closed: [true, false, true, true],
		customer_status: 0,
		product_id: [1, 2, 3, 4]
	},
	{
		customer_id: 2,
		customer_name: 'Alice',
		product: ['laptop', 'mouse'],
		price: [1200, 7],
		closed: [null, false],
		customer_status: 1,
		product_id: [null, 4]
	},
	{
		customer_id: 3,
		customer_name: 'Eve',
		product: ['microphone', 'router', 'laptop'],
		price: [20, 105, 1200],
		closed: [true, false, false],
		customer_status: 1,
		product_id: [6, null, 5]
	}
];

const normal_obj_with_combine_arrays =
[
	{
		customer_id: 1,
		customer_name: 'Bob',
		products:
		[
			{
				product_id: 1,
				name: 'computer',
				price: 550,
				closed: true
			},
			{
				product_id: 2,
				name: 'monitor',
				price: 400,
				closed: false
			},
			{
				product_id: 3,
				name: 'mobile phone',
				price: 970,
				closed: true
			},
			{
				product_id: 4,
				name: 'mouse',
				price: 7,
				closed: true
			}
		],
		customer_status: 0
	},
	{
		customer_id: 2,
		customer_name: 'Alice',
		products:
		[
			{
				product_id: 5,
				name: 'laptop',
				price: 1200,
				closed: true
			},
			{
				product_id: 4,
				name: 'mouse',
				price: 7,
				closed: false
			},
		],
		customer_status: 1
	},
	{
		customer_id: 3,
		customer_name: 'Eve',
		products:
		[
			{
				product_id: 6,
				name: 'microphone',
				price: 20,
				closed: true
			},
			{
				product_id: 7,
				name: 'router',
				price: 105,
				closed: false
			},
			{
				product_id: 5,
				name: 'laptop',
				price: 1200,
				closed: false
			},

		],
		customer_status: 1
	}
];

const normal_description =
{
	customer_id:     { type: 'number', group: 1 },
	product:         { type: 'string' },
	product_id:      { type: 'number' },
	customer_name:   { type: 'string', group: 2 },
	price:           { type: 'number' },
	closed:          { type: 'boolean' },
	customer_status: { type: 'number', group: 2 }
};

const not_unique_description_var1 =
{
	age:       { type: 'number', group: 1 },
	sex:       { type: 'string', group: 2 },
	person_id: { type: 'number', group: 3 }
};

const not_unique_description_var2 =
{
	age:       { type: 'number', group: 1 },
	sex:       { type: 'string', group: 2 },
	person_id: { type: 'number' }
};

const not_unique_description_var3 =
{
	age:       { type: 'number' },
	sex:       { type: 'string', group: 2 },
	person_id: { type: 'number', group: 1 }
};

describe('Tests for csvToObj convertion', () =>
{
	function doTest(csv, expected, description)
	{
		const result1 = app.csvToObj(csv, ';', description);
		const result2 = app.csvToObj(csv, description, ';');
		const result3 = app.csvToObj(csv.replace(/;/g, ','), description);
		let msg;
		msg = whereNotEqual(expected, result1);
		if (msg) throw new Error(msg) + ' explicit params one order';
		msg = whereNotEqual(expected, result2);
		if (msg) throw new Error(msg) + ' explicit params other order';
		msg = whereNotEqual(expected, result3);
		if (msg) throw new Error(msg) + ' implicit  delimeter';
	}
	it('should return normal object', () => doTest(normal_csv, normal_obj, normal_description));
	it('should return not_normal object', () => doTest(not_normal_csv, not_normal_obj, normal_description));
	it('should return not_unique_obj_var1 object', () => doTest(not_unique_csv, not_unique_obj_var1, not_unique_description_var1));
	it('should return not_unique_obj_var2 object', () => doTest(not_unique_csv, not_unique_obj_var2, not_unique_description_var2));
	it('should return not_unique_obj_var3 object', () => doTest(not_unique_csv, not_unique_obj_var3, not_unique_description_var3));
	it('should return not_unique_obj_var1 object (no description)', () =>
	{
		//Convert all properties of not_unique_description_var1 to String
		let obj = new Array(not_unique_description_var1.length);
		for (let i = 0; i < obj.length; i++)
		{
			obj[i] = {};
			for (let key in not_unique_description_var1[i])
			{
				obj[i][key] = String(not_unique_description_var1[i][key]);
			}
		}
		doTest(not_unique_csv, obj);
	});
	it('should return not_unique_not_normal_obj_var1 object', () => doTest(not_unique_not_normal_csv, not_unique_not_normal_obj_var1, not_unique_description_var1));
	it('should return not_unique_not_normal_obj_var2 object', () => doTest(not_unique_not_normal_csv, not_unique_not_normal_obj_var2, not_unique_description_var2));
});

describe('Tests for objToCsv conversion', () =>
{
	function doTest(obj, expected)
	{
		const result = app.objToCsv(obj, ';');

		const result1 = app.objToCsv(obj, ';');
		const result2 = app.objToCsv(obj);
		if (result1 !== expected) throw new Error(`Expected (explicit delimeter):\n${expected}\n\nBut got:\n${result}`);
		let commaExpected = expected.replace(/;/g, ',');
		if (result2 !== commaExpected) throw new Error(`Expected (implicit delimeter):\n${commaExpected}\n\nBut got:\n${result}`);
	}
	it('should return normal_csv', () => doTest(normal_obj, normal_csv));
	it('should return not_normal_csv_sorted', () => doTest(not_normal_obj, not_normal_csv_sorted));
	it('should return not_unique_csv_sorted_1_2 (var 1)', () => doTest(not_unique_obj_var1, not_unique_csv_sorted_1_2));
	it('should return not_unique_csv_sorted_1_2 (var 2)', () => doTest(not_unique_obj_var2, not_unique_csv_sorted_1_2));
	it('should return not_unique_csv_sorted_3 (var 3)', () => doTest(not_unique_obj_var3, not_unique_csv_sorted_3));
	it('should return not_unique_not_normal_csv_sorted_1_2 (var 1)', () => doTest(not_unique_not_normal_obj_var1, not_unique_not_normal_csv_sorted_1_2));
	it('should return not_unique_not_normal_csv_sorted_2 (var 3)', () => doTest(not_unique_not_normal_obj_var2, not_unique_not_normal_csv_sorted_1_2));
});

describe('Tests for combine arrays in objects', () =>
{
	it('should return normal_obj_with_combine_arrays', () =>
	{
		const result = app.combineArrays(normal_obj, 'products', ['product_id', 'product', 'price', 'closed'], ['product_id', 'name', 'price', 'closed']);
		let msg = whereNotEqual(normal_obj_with_combine_arrays, result);
		if (msg) throw new Error(msg);
	});
	it('should return normal_obj', () =>
	{
		const result = app.separateArrays(normal_obj_with_combine_arrays, 'products', ['product_id', 'name', 'price', 'closed'], ['product_id', 'product', 'price', 'closed']);
		let msg = whereNotEqual(normal_obj, result);
		if (msg) throw new Error(msg);
	});
});

describe('Double quotes specification test (rfc4180)', () =>
{
	const csv_for_csvToObj = '"aaa","bb""b",ccc\r\na"aa,"bbb,",",x,"",y\r\nz","yyy"\r\nxx x,yyy"a"y,\r\n"xxx"   ,"yyy""a"", y","zzz,a,z"\r\nxxx,  "yyy""v,v\r\nay","a, """\r\nzzz,"zz""aaa"z,"zzz"\r\n';
	const csv_for_objToCsv = 'aaa,"bb""b",ccc\r\n"a""aa","bbb,",",x,"",y\r\nz"\r\nxx x,"yyy""a""y",\r\nxxx,"yyy""a"", y","zzz,a,z"\r\nxxx,"yyy""v,v\r\nay","a, """\r\nzzz,"""zz""""aaa""z",zzz\r\n';
	const obj =
	[
		{
			aaa: 'a"aa',
			'bb"b': 'bbb,',
			ccc: ',x,",y\r\nz'
		},
		{
			aaa: 'xx x',
			'bb"b': 'yyy"a"y',
			ccc: null
		},
		{
			aaa: 'xxx',
			'bb"b': 'yyy"a", y',
			ccc: 'zzz,a,z'
		},
		{
			aaa: 'xxx',
			'bb"b': 'yyy"v,v\r\nay',
			ccc: 'a, "'
		},
		{
			aaa: 'zzz',
			'bb"b': '"zz""aaa"z',
			ccc: 'zzz'
		},
	];
	it('csvToObj should handle double quotes correctly according to rfc 4180', () =>
	{
		const result = app.csvToObj(csv_for_csvToObj);
		const msg = whereNotEqual(obj, result);
		if (msg) throw new Error(msg);
	});
	it('objToCsv should handle double quotes correctly according to rfc 4180', () =>
	{
		const result = app.objToCsv(obj, ',', 'crlf');
		if (result !== csv_for_objToCsv) throw new Error('Returned csv is incorrect.');
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
				let expectedArr = expected[i][key].slice().sort(); //it should not depends from order
				let resultArr = result[i][key].slice().sort();
				for (let j = 0; j < expectedArr.length; j++)
				{
					if (typeof (expectedArr[j]) === 'object')
					{
						for (let key in expectedArr[j])
						{
							if (expectedArr[j][key] !== resultArr[j][key])
							{
								flag = true;
								break;
							}
							if (flag) break;
						}
					}
					else
					{
						if (expectedArr[j] !== resultArr[j])
						{
							flag = true;
							break;
						}
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
