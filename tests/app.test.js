let app = require('../app');

const path = require('path');
const fs = require('fs');
console.log('Reading file ' + CSV_PATH);
let data = fs.readFileSync(CSV_PATH).toString().split(NEW_ROW);
let header = data[0].split(CSV_DELIM);

it ('should make some math', function()
	{
		let expected = 100;
		let result = app.f(-10, -10);
		if (result !== expected)
		{
			throw new Error(`Expected ${expected}, but got ${result}`);
		}
	});
