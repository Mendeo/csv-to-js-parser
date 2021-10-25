'use strict';
const data = `"xxx, """
rr", a"aa,"bbb,",",x,"",y
z","yyy"
zzz,ccc,vvv,mmm
`;

const result = 1;//splitByRowsTiaQuotes(data, ',');
console.log(result);

const qw = new RegExp(`((^\\s*)|(\\s*,\\s*))"([^"]*(""))*[^"]*$`, 'g');
console.log('"xxx, """'.match(qw));

//Splitting data, with checking each row to find line breaks inside quotes
function splitByRowsTiaQuotes(data, delimeter)
{
	let row;
	let dataIndex = 0;
	const testRowRegExp = new RegExp(`((^\\s*)|(\\s*${delimeter}\\s*))"([^"]*(""))*[^"]*$`, 'g');
	const out = [];

	let rnPlace;
	do
	{
		rnPlace = data.indexOf('\n', dataIndex);
		if (rnPlace === -1) //last row
		{
			row = data.slice(dataIndex, data.length);
		}
		else
		{
			for (;;)
			{
				if (data.slice(rnPlace - 1, rnPlace) === '\r')
				{
					row = data.slice(dataIndex, rnPlace - 1);
				}
				else
				{
					row = data.slice(dataIndex, rnPlace);
				}
				//Check row delimeter if it in quotes
				if (row.match(testRowRegExp) === null || rnPlace === -1)
				{
					break;
				}
				else
				{
					rnPlace = data.indexOf('\n', rnPlace + 1);
				}
			}
		}
		out.push(row);
		dataIndex = rnPlace + 1;
	} while(rnPlace !== -1)
	return out;
}