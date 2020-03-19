let app = require('../app');

it ('should make some math', function()
	{
		let expected = 100;
		let result = app.f(-10, -10);
		if (result !== expected)
		{
			throw new Error(`Expected ${expected}, but got ${result}`);
		}
	});
