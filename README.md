## Version 2.3. What's new?
In the new version, the correct handling of double quotes (") has been added in accordance with [rfc4180](https://datatracker.ietf.org/doc/html/rfc4180).
* Values in fields can now be enclosed by double quotes, for example  
"aaa","bbb"
* Now you can use separator character or even line breaks inside double quotes:  
"aaa,aa","bbb  
bb"
* Also, the field can contain the symbol (") itself, but it must be escaped:  
"aaa""aa","bbb""aaa""bb"
* Fields that are not enclosed by double quotes, but containing this characters will also be processed correctly:  
aa"aa,bb"aaa"bbb  

# Convert csv data to an array of JavaScript objects

Converting csv files to an array of JavaScript objects and vice versa. Can group input data.

## Installation
```bash
npm i csv-to-js-parser
```

## Example

### csvToObj function
Suppose we have a table with customers and the goods they ordered in the store (Table 1).

**Table 1**

| customer_id | customer_name | customer_status | product_id |   product    | price | closed |
|:-----------:|:-------------:|:---------------:|:----------:|:------------:|:-----:|:------:|
|      1      |      Bob      |        0        |      1     |   computer   |  550  |  true  |
|      1      |      Bob      |        0        |      2     |    monitor   |  400  |  false |
|      1      |      Bob      |        0        |      3     | mobile phone |  970  |  true  |
|      1      |      Bob      |        0        |      4     |     mouse    |   7   |  true  |
|      2      |      lice     |        1        |      5     |    laptop    |  1200 |  true  |
|      2      |     Alice     |        1        |      4     |     mouse    |   7   |  false |
|      3      |      Eve      |        1        |      6     |  microphone  |   20  |  true  |
|      3      |      Eve      |        1        |      7     |    router    |  105  |  false |
|      3      |      Eve      |        1        |      5     |    laptop    |  1200 |  false |

Here, each customer has a unique identifier: "customer_id".

Table 1 has columns where repeated values occur in rows. For example, customer_id will be the same in the first four lines, as these lines describe the purchases of the same customer. In these situations, you usually don't need to convert each row to a separate JavaScript object, but it is necessary that there is one object per customer.

Using this module, you can convert the above table into an array, where each element of this array is a JavaScript object that describes the parameters of a particular customer and his purchase.

```javascript
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
]
```

Let's look at the source code for getting such result. Let the input table be stored in the "data.csv" file, where the column separators are the ";".

```javascript
const fs = require('fs');
const csvToObj = require('csv-to-js-parser').csvToObj;

const data = fs.readFileSync('data.csv').toString();

const description =
    {
        customer_id:     {type: 'number', group: 1},
        product:         {type: 'string'},
        product_id:      {type: 'number'},
        customer_name:   {type: 'string', group: 2},
        price:           {type: 'number'},
        closed:          {type: 'boolean'},
        customer_status: {type: 'number', group: 2}
    };
let obj = csvToObj(data, ';', description);
```

The csvToObj function accepts the following parameters:
* data: csv table as a string.

* delimeter [optional]: column separator in the input table. If not specified, then the default is comma ",".

* description [optional]: description of the input table.

The description object describes the input table:
* type: describes the type of column values. Three options are supported: "number", "string" and "boolean".
* group: the order of grouping. Have to be set only for the columns that need to be grouped. There must be at least one such column. The values of this property indicate the order in which the columns should be grouped. For example columns with "group: 1" are grouped first, then columns with "group: 2" are grouped inside the first grouping and so on. You can perceive the group property in the same way as a "Group By" construct in SQL.

If the description parameter is not specified, then a string type is assigned to all columns of the input table and grouping is performed by all columns. This means that each row of the input table will be converted to a separate JavaScript object.

The  delimeter and description parameters can be set in a different order: first description, then delimeter.

Consider another example where you can better see how grouping works. Let the input data be table 2.

**Table 2**

|  sex   | age | person_id |
|:------:|:---:|:---------:|
|  male  | 30  |     1     |
|  male  | 30  |     2     |
|  male  | 30  |     3     |
|  male  | 31  |     4     |
|  male  | 31  |     4     |
|  male  | 31  |     5     |
|  male  | 31  |     5     |
|  male  | 31  |     6     |
|  male  | 32  |     7     |
|  male  | 32  |     7     |
|  male  | 32  |     8     |
| female | 30  |     9     |
| female | 30  |     9     |
| female | 30  |     10    |
| female | 30  |     10    |
| female | 31  |     11    |
| female | 31  |     12    |
| female | 33  |     13    |
| female | 33  |     14    |
| female | 33  |     14    |

We need to get an array of JavaScript objects in which the data from table 2 will be grouped first by age and then by sex. In this case, the description object will be as follows:

```javascript
const description = 
{
    age:       {type: 'number', group: 1},
    sex:       {type: 'string', group: 2},
    person_id: {type: 'number'}
};
```

The output from csvToObj founction will be as follows:

```javascript
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
]
```

### combineArrays function

You can notice that in the objects that the csvToObj function returns, the properties that are responsible for non-grouped columns contain arrays of the same length. Using the combineArrays function, you can convert these arrays to a single array of objects, which in some cases may be a more natural representation of data in JavaScript.

The code for working with this function for the example from table 1:

```javascript
const combineArrays = require('csv-to-js-parser').combineArrays;
obj = combineArrays(obj, 'products', ['product_id', 'product', 'price', 'closed'], ['product_id', 'name', 'price', 'closed']);
```

The combineArrays function takes the following parameters:
* obj: input object (usually from csvToObj).
* newKey: the name of the property in which the arrays will be combined.
* arrayKeys: the names of the properties in the input object that are arrays.
* newArrayKeys [optional]: if specified: the names of properties that override properties from arrayKeys, i.e. the output object will have newArrayKeys properties instead of arrayKeys properties.

The result of the combineArrays function for example from table 1 is shown below:

```javascript
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
]
```

### separateArrays function

To reverse conversion to an object with separate arrays, you can use the separateArrays function.

```javascript
const separateArrays = require('csv-to-js-parser').separateArrays;
obj = separateArrays(obj, 'products', ['product_id', 'name', 'price', 'closed'], ['product_id', 'product', 'price', 'closed']);
```

In this function, parameters are similar to those used in combineArrays:

* obj: input object (usually from combineArrays).
* objArrayKey: name of the property where the arrays are combined.
* arrayKeys: names of properties in the input object to convert it to separate arrays .
* newArrayKeys [optional]: if specified, the names of properties that override properties from arrayKeys, i.e. the output object will have newArrayKeys properties instead of arrayKeys properties.

The result of this function will be the initial array of objects obtained from csvToObj.

### Saving in JSON format

To save objects from csvToObj or combineArrays functions to a file, you can use the built-in node.js function JSON.stringify().

```javascript
const json = JSON.stringify(obj, null, ' ');
fs.writeFileSync('data.json', json);
```

### objToCsv function

You can use the objToCsv function to reverse convert an array of objects from csvToObj to CSV text format.

```javascript
const objToCsv = require('csv-to-js-parser').objToCsv;
const csv = objToCsv(obj, ';');
fs.writeFileSync('newData.csv', csv);
```

The objToCsv function accepts the following parameters:
* obj: input array of objectc (the format must match the one returned by csvToObj).
* delimeter [optional]: column delimiter in the output table. If not specified, then the default is comma ",".
* rowDelimeter [optional]: rows separator. If not specified, then the default is "LF" (\n). For windows, it is reasonable to specify the "CRLF" delimiter (\r\n).

## MIT License
https://github.com/Mendeo/csv-to-js-parser/blob/master/LICENSE