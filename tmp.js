'use strict';
const row = '"qw", "a""s"   ,  er  ,  "zx, "" y", "", a,';
//Split by delimeter, taking into account double quotes according to rfc4180
function splitTiaQuotes(row, delimeter)
{
	let out = [];

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
				out.push(row.slice(startIndex, row.length));
				break;
			}
			else if(qPlaceClosed > qPlaceOpen) //last field has more then one qotes
			{
				for (;;)
				{
					if (row.slice(qPlaceClosed + 1, qPlaceClosed + 2) === '"') //qPlaceClosed refer to escape simbol of "
					{
						qPlaceClosed = row.indexOf('"', qPlaceClosed + 2);
					}
					else
					{
						break;
					}
				}
				out.push(row.slice(qPlaceOpen + 1, qPlaceClosed).replace(/""/g, '"'));
				break;
			}
			else //last field has only one qoute
			{
				out.push(row.slice(startIndex, row.length));
				break;
			}
		}
		else if (qPlaceOpen === -1) //no quotes in field;
		{
			out.push(row.slice(startIndex, dPlace));
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
				for (let i = startIndex; i < qPlaceOpen; i++)
				{
					if (row.slice(i, i + 1) !== ' ')
					{
						fieldStartsFromQuote = false;
						break;
					}
				}
				fieldStartsFromQuote = true;
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
				out.push(row.slice(qPlaceOpen + 1, qPlaceClosed).replace(/""/g, '"'));
				startIndex = dPlace + 1;
			}
			else //filed has quote, but not start from quote
			{
				out.push(row.slice(startIndex, dPlace));
				startIndex = dPlace + 1;
			}
		}
		else //filed has not quotes
		{
			out.push(row.slice(startIndex, dPlace));
			startIndex = dPlace + 1;
		}
	}
	return out;
	//return row.split(delimeter);
}
console.log(splitTiaQuotes(row, ','));
console.log(row);