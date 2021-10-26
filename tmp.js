'use strict';
//const row = '"qw", "a""s"   ,  e""r  ,  "zx, "" y", "", a,';
const csv_for_csvToObj = '"aaa","bb""b",ccc\r\na"aa,"bbb,",",x,"",y\r\nz","yyy"\r\nxx x,yyy"a"y,\r\n"xxx"   ,"yyy""a"", y","zzz,a,z"\r\nxxx,  "yyy""v,v\r\nay","a, """\r\n';
console.log(splitTiaQuotes(csv_for_csvToObj, ','));
console.log(csv_for_csvToObj);

//Split by delimeter, taking into account double quotes according to rfc4180
function splitTiaQuotes(data, delimeter)
{
	const dataArray = [];
	let header = null;
	let rowArray = [];
	let dataIndex = 0;
	let qPlaceOpen = 0;
	let dOrnPlace = 0;
	let dPlace = 0;
	let rnPlace = 0;
	let qPlaceClosed = -1;
	for (;;)
	{
		if (dPlace >= 0 && dPlace <= dOrnPlace) dPlace = data.indexOf(delimeter, dataIndex);
		if (rnPlace >= 0 && rnPlace <= dOrnPlace) rnPlace = data.indexOf('\n', dataIndex);
		set_dOrnPlace();
		if ((dOrnPlace >= 0 && qPlaceOpen <= dOrnPlace) || dOrnPlace === -1)
		{
			qPlaceOpen = data.indexOf('"', dataIndex);
			qPlaceClosed = qPlaceOpen === -1 ? -1 : data.indexOf('"', qPlaceOpen + 1);
		}
		if (dOrnPlace === -1) //last field
		{
			if (qPlaceOpen === -1) //last field without quotes
			{
				rowArray.push(data.slice(dataIndex, data.length));
				addRowToArray();
				break;
			}
			else if(qPlaceClosed > qPlaceOpen) //last field has more then one quotes
			{
				while (data.slice(qPlaceClosed + 1, qPlaceClosed + 2) === '"') //qPlaceClosed refer to escape simbol of "
				{
					qPlaceClosed = data.indexOf('"', qPlaceClosed + 2);
				}
				for (let i = qPlaceClosed + 1; i < data.length; i++) //After closing quotes and before delimeter we have not space simbols
				{
					if (data.slice(i, i + 1) !== ' ') throw new Error('Incorrect using of quotes (1): ' + data.slice(qPlaceOpen, data.length));
				}
				rowArray.push(data.slice(qPlaceOpen + 1, qPlaceClosed).replace(/""/g, '"'));
				addRowToArray();
				break;
			}
			else //last field has only one qoute
			{
				rowArray.push(data.slice(dataIndex, data.length));
				addRowToArray();
				break;
			}
		}
		else if (qPlaceOpen === -1) //no quotes in field;
		{
			addFieldWithNoQuotes();
			dataIndex = dOrnPlace + 1;
			addRowToArray();
		}
		else if (qPlaceOpen < dOrnPlace) //field has quotes
		{
			let fieldStartsFromQuote;
			if (qPlaceOpen === dataIndex)
			{
				fieldStartsFromQuote = true;
			}
			else
			{
				fieldStartsFromQuote = true;
				for (let i = dataIndex; i < qPlaceOpen; i++)
				{
					if (data.slice(i, i + 1) !== ' ')
					{
						fieldStartsFromQuote = false;
						break;
					}
				}
			}
			if (fieldStartsFromQuote) //filed start from quote
			{
				for (;;)
				{
					if (data.slice(qPlaceClosed + 1, qPlaceClosed + 2) === '"') //qPlaceClosed refer to escape simbol of "
					{
						qPlaceClosed = data.indexOf('"', qPlaceClosed + 2);
					}
					else
					{
						if (dOrnPlace < qPlaceClosed) //dOrnPlace refer to delimeter into escaped filed, for example ""aa, aa
						{
							if (dPlace < qPlaceClosed) dPlace = data.indexOf(delimeter, qPlaceClosed + 1);
							if (rnPlace < qPlaceClosed) rnPlace = data.indexOf('\n', qPlaceClosed + 1);
							set_dOrnPlace();
						}
						break;
					}
				}
				for (let i = qPlaceClosed + 1; i < dOrnPlace; i++) //After closing quotes and before delimeter we have not space simbols
				{
					let s = data.slice(i, i + 1);
					if (!(s === ' ' || s === '\r')) throw new Error('Incorrect using of quotes (2): ' + data.slice(qPlaceOpen, qPlaceClosed + 1));
				}
				rowArray.push(data.slice(qPlaceOpen + 1, qPlaceClosed).replace(/""/g, '"'));
				dataIndex = dOrnPlace + 1;
				addRowToArray();
			}
			else //filed has quote, but not start from quote
			{
				addFieldWithNoQuotes();
				dataIndex = dOrnPlace + 1;
				addRowToArray();
			}
		}
		else //filed has not quotes
		{
			addFieldWithNoQuotes();
			dataIndex = dOrnPlace + 1;
			addRowToArray();
		}
	}
	//Deleting last empty rows
	{
		let i = dataArray.length - 1;
		while (dataArray[i].length === 1 && dataArray[i][0] === '')
		{
			dataArray.pop();
			i--;
		}
	}
	return [header, dataArray];

	function addFieldWithNoQuotes()
	{
		if (dOrnPlace === rnPlace && data.slice(dOrnPlace - 1, dOrnPlace) === '\r')
		{
			rowArray.push(data.slice(dataIndex, dOrnPlace - 1));
		}
		else
		{
			rowArray.push(data.slice(dataIndex, dOrnPlace));
		}
	}

	function addRowToArray()
	{
		if (dOrnPlace === rnPlace)
		{
			if (header === null)
			{
				header = rowArray;
			}
			else
			{
				dataArray.push(rowArray);
			}
			rowArray = [];
		}
	}

	function set_dOrnPlace()
	{
		if (dPlace === -1)
		{
			dOrnPlace = rnPlace;
		}
		else if (rnPlace === -1)
		{
			dOrnPlace = dPlace;
		}
		else if (rnPlace < dPlace)
		{
			dOrnPlace = rnPlace;
		}
		else
		{
			dOrnPlace = dPlace;
		}
	}
}
