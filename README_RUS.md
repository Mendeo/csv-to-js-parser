## Версия 2.3. Что нового?
В новой версии была добавлена корректная обработка двойных кавычек (") согласно [rfc4180](https://datatracker.ietf.org/doc/html/rfc4180).
* Теперь значения в полях могут обрамляться кавычками, например  
"aaa","bbb"
* Внутри кавычек можно использовать символы разделителя или даже переноса строки:  
"aaa,aa","bbb  
bb"
* Также поле может содержать сам символ ("), но его нужно предварительно экранировать:  
"aaa""aa","bbb""aaa""bb"
* Поля не обрамлённые в двойные кавычки, но содержащие этот символ тоже корректно обработаются:  
aa"aa,bb"aaa"bbb  

# Преобразование данных csv в объекты JavaScript

Модуль csv-to-js-parser позволяет конвертировать входную таблицу данных в массив JavaScript объектов и обратно. Может проводить группировку входных данных.

## Установка
```bash
npm i csv-to-js-parser
```

## Пример

### Функция csvToObj
Пусть у нас есть таблица с покупателями и товарами, которые они заказали в магазине (Таблица 1).

**Таблица 1**
| customer_id | customer_name | customer_status | product_id |   product    | price | closed |
|:-----------:|:-------------:|:---------------:|:----------:|:------------:|:-----:|:------:|
|      1      |       Bob     |        0        |      1     |   computer   |  550  |  true  |
|      1      |       Bob     |        0        |      2     |    monitor   |  400  |  false |
|      1      |       Bob     |        0        |      3     | mobile phone |  970  |  true  |
|      1      |       Bob     |        0        |      4     |     mouse    |   7   |  true  |
|      2      |      Alice    |        1        |      5     |    laptop    |  1200 |  true  |
|      2      |      Alice    |        1        |      4     |     mouse    |   7   |  false |
|      3      |       Eve     |        1        |      6     |  microphone  |   20  |  true  |
|      3      |       Eve     |        1        |      7     |    router    |  105  |  false |
|      3      |       Eve     |        1        |      5     |    laptop    |  1200 |  false |

Здесь каждый покупатель обладает уникальным идентификатором customer_id.

Таблица 1 интересна тем, что в ней есть столбцы, в которых по строкам встречаются повторяющиеся значения. Например, customer_id будет одинаковый в первых четырёх строках, так как эти строки описывают покупки одного и того же покупателя. В таких ситуациях обычно не требуется преобразовывать каждую строку в отдельный объект JavaScript, а нужно, чтобы был один объект на одного покупателя.

Используя данный модуль, можно перевести указанную выше таблицу в массив, где каждый элемент этого массива - это объект JavaScript, описывающий параметры конкретного покупателя и его покупки.

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

Рассмотрим исходный код для получения такого объекта. Пусть нужная таблица хранится в файле "data.csv", где разделителями столбцов выступает символ ";".

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

Функция csvToObj принимает следующие параметры:
* data: csv таблица в виде строки.
* delimeter [опционально]: разделитель столбцов во входной таблице. Если не задан, то по умолчанию используется запятая ",".
* description [опционально]: описание входной таблицы.

В параметре description описывается входная таблица:
* type: описывается тип значений столбца. Поддерживаются три варианта: "number", "string" и "boolean".

* group: порядок группировки. Задаётся только для тех столбцов, которые нужно группировать. Таким должен быть хотя бы один столбец. Значения этого свойства показывают в каком порядке нужно группировать столбцы. Группировка идёт в порядке возрастания значения group. То есть сначала группируются столбцы с group: 1, потом внутри первой группировки группируются столбцы с group: 2 и т. д. Можно воспринимать свойство group аналогично конструкции Group By в языке SQL.

  Если параметр description не задан, то всем столбцам входной таблицы приписывается строковый тип и группировка производится по всем столбцам. Это значит, что каждая строка входной таблицы преобразуется в отдельный объект JavaScript.

Параметры delimeter и description можно задавать в другом порядке: сначала description, затем delimeter .

Рассмотрим другой пример, где можно лучше увидеть как работает группировка. Пусть в качестве входных данных выступает таблица 2.

**Таблица 2**
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

Требуется получить массив объектов JavaScript, в котором данные из таблицы 2 будут сгруппированы сначала по возрасту, а затем по полу. В этом случае description будет таким:

```javascript
const description = 
{
    age:       {type: 'number', group: 1},
    sex:       {type: 'string', group: 2},
    person_id: {type: 'number'}
};
```

Результат работы csvToObj будет таким:

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

### Функция combineArrays

Можно заметить, что в объектах, которые возвращает функция csvToObj, свойства, отвечающие за не сгруппированные столбцы, содержат массивы одинаковой длины. Используя функцию combineArrays, можно преобразовать эти массивы в единственный массив объектов, что в некоторых случаях может быть более естественным представлением данных в JavaScript.

Код работы с этой функцией для примера из таблицы 1:

```javascript
const combineArrays = require('csv-to-js-parser').combineArrays;
obj = combineArrays(obj, 'products', ['product_id', 'product', 'price', 'closed'], ['product_id', 'name', 'price', 'closed']);
```

Функция combineArrays принимает следующие параметры:
* obj: входной объект (обычно полученный из csvToObj).
* newKey: имя свойства, в котором будут объединены массивы.
* arrayKeys: имена свойств во входном объекте, которые являются массивами.
* newArrayKeys [опционально]: если задан, то имена свойств, которые переопределят свойства из arrayKeys, то есть в выходном объекте вместо свойств arrayKeys будут свойства newArrayKeys.

Результат работы функции combineArrays для примера из таблицы 1 представлен ниже:

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

### Функция separateArrays

Для обратного преобразования в объект с отдельными массивами можно воспользоваться функцией separateArrays.

```javascript
const separateArrays = require('csv-to-js-parser').separateArrays;
obj = separateArrays(obj, 'products', ['product_id', 'name', 'price', 'closed'], ['product_id', 'product', 'price', 'closed']);
```

В этой функции параметры, аналогичны тем, что используются в combineArrays:

* obj: входной объект (обычно, полученный из combineArrays).
* objArrayKey: имя свойства, в котором объединены массивы.
* arrayKeys: имена свойств во входном объекте, которые нужно сделать отдельными массивами .
* newArrayKeys [опционально]: если задан, то имена свойств, которые переопределят свойства из arrayKeys, то есть в выходном объекте вместо свойств arrayKeys будут свойства newArrayKeys.

Результатом работы этой функции будет первоначальный объект, полученный из csvToObj.

### Сохранение в формате JSON

Для сохранения объектов, полученных в результате работы функций csvToObj или combineArrays в файл, можно воспользоваться встроенной в node.js функцией JSON.stringify().

```javascript
const json = JSON.stringify(obj, null, ' ');
fs.writeFileSync('data.json', json);
```

### Функция objToCsv

Для обратного преобразования массива объектов из csvToObj в текстовый csv формат можно воспользоваться функцией objToCsv.

```javascript
const objToCsv = require('csv-to-js-parser').objToCsv;
const csv = objToCsv(obj, ';');
fs.writeFileSync('newData.csv', csv);
```

Функция objToCsv принимает следующие параметры:
* obj: входной массив объектов (формат должен соответствовать тому, который возвращает csvToObj).
* delimeter [опционально]: разделитель столбцов в выходной таблице. Если не задан, то по умолчанию используется запятая ",".
* rowDelimeter [опционально]: разделитель строк. Если не задан, то по умолчанию используется "LF" (\n). Для windows разумно указывать в этом параметре разделитель "CRLF" (\r\n).

## Лицензия MIT
https://github.com/Mendeo/csv-to-js-parser/blob/master/LICENSE