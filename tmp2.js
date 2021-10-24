'use strict';
const data = `aaa,b"bb,"xx
xx", yyy
zzz,ccc,vvv,mmm
`;
function getNextRow(data)
{
	let row;
	let dataIndex = 0;

	let rnPlace = data.indexOf('\n', dataIndex);
	if (rnPlace === -1) //last row
	{
		row = data.slice(dataIndex, data.length);
	}
	else
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

	}
	*/
	console.log(row.match(/"/g).length);
}