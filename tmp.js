'use strict';
const row = '"qw", "a""s"   ,  e""r  ,  "zx, "" y", "", a,';

//Split by delimeter, taking into account double quotes according to rfc4180
function splitTiaQuotes(row, delimeter)
{
	let rowArray = [];
	let startIndex = 0;
	for (;;)
	{
		let qPlaceOpen = row.indexOf('"', startIndex);
		let qPlaceClosed = qPlaceOpen === -1 ? -1 : row.indexOf('"', qPlaceOpen + 1);
		let dPlace = row.indexOf(delimeter, startIndex);
		if (dPlace === -1) //last field
		{
			if (qPlaceOpen === -1) //last field without quotes
			{
				rowArray.push(row.slice(startIndex, row.length));
				break;
			}
			else if(qPlaceClosed > qPlaceOpen) //last field has more then one qotes
			{
				while (row.slice(qPlaceClosed + 1, qPlaceClosed + 2) === '"') //qPlaceClosed refer to escape simbol of "
				{
					qPlaceClosed = row.indexOf('"', qPlaceClosed + 2);
				}
				for (let i = qPlaceClosed + 1; i < row.length; i++) //After closing quotes and before delimeter we have not space simbols
				{
					if (row.slice(i, i + 1) !== ' ') throw new Error('Incorrect using of quotes in last row: ' + row);
				}
				rowArray.push(row.slice(qPlaceOpen + 1, qPlaceClosed).replace(/""/g, '"'));
				break;
			}
			else //last field has only one qoute
			{
				rowArray.push(row.slice(startIndex, row.length));
				break;
			}
		}
		else if (qPlaceOpen === -1) //no quotes in field;
		{
			rowArray.push(row.slice(startIndex, dPlace));
			startIndex = dPlace + 1;
		}
		else if (qPlaceOpen < dPlace) //field has quotes
		{
			let fieldStartsFromQuote;
			if (qPlaceOpen === startIndex)
			{
				fieldStartsFromQuote = true;
			}
			else
			{
				fieldStartsFromQuote = true;
				for (let i = startIndex; i < qPlaceOpen; i++)
				{
					if (row.slice(i, i + 1) !== ' ')
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
					if (row.slice(qPlaceClosed + 1, qPlaceClosed + 2) === '"') //qPlaceClosed refer to escape simbol of "
					{
						qPlaceClosed = row.indexOf('"', qPlaceClosed + 2);
					}
					else
					{
						if (dPlace < qPlaceClosed) dPlace = row.indexOf(delimeter, qPlaceClosed + 1); //dPlace refer to delimeter into escaped filed, for example ""aa, aa
						break;
					}
				}
				for (let i = qPlaceClosed + 1; i < dPlace; i++) //After closing quotes and before delimeter we have not space simbols
				{
					if (row.slice(i, i + 1) !== ' ') throw new Error('Incorrect using of quotes in row: ' + row);
				}
				rowArray.push(row.slice(qPlaceOpen + 1, qPlaceClosed).replace(/""/g, '"'));
				startIndex = dPlace + 1;
			}
			else //filed has quote, but not start from quote
			{
				rowArray.push(row.slice(startIndex, dPlace));
				startIndex = dPlace + 1;
			}
		}
		else //filed has not quotes
		{
			rowArray.push(row.slice(startIndex, dPlace));
			startIndex = dPlace + 1;
		}
	}
	return rowArray;
}
console.log(splitTiaQuotes(row, ','));
console.log(row);