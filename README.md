# Преобразование данных csv в объекты JavaScript

Конвертирование csv файлов в массив JavaScript объектов и обратно. Работает с входными таблицами в реляционном формате.

## Установка
```bash
npm i csv-to-js-parser
```

## Пример
Пусть у нас есть таблица с покупателями и товарами, которые они заказали в магазине:

| customer_id | customer_name | customer_status | product_id |   product    | price | closed |
|-------------|---------------|-----------------|------------|--------------|-------|--------|
|      1      |       Bob     |        0        |      1     |    computer  |  550  |  true  |
|      1      |       Bob     |        0        |      2     |    monitor   |  400  |  false |
|      1      |       Bob     |        0        |      3     | mobile phone |  970  |  true  |
|      1      |       Bob     |        0        |      4     |     mouse    |   7   |  true  |
|      2      |      Alice    |        1        |      5     |    laptop    |  1200 |  true  |
|      2      |      Alice    |        1        |      4     |     mouse    |   7   |  false |
|      3      |       Eve     |        1        |      6     |  microphone  |   20  |  true  |
|      3      |       Eve     |        1        |      7     |    router    |  105  |  false |
|      3      |       Eve     |        1        |      5     |    laptop    |  1200 |  false |

В этой таблице каждый покупатель обладает уникальным идентификатором customer_id.

Эта таблица интересна тем, что здесь есть поля, где встречаются повторяющиеся значения. Например, customer_id будет одинаковый в первых четырёх строках, так как эти строки описывают покупки одного и того же покупателя. В таких ситуациях обычно не требуется преобразовывать каждую строку в отдельный объект JavaScript, а нужно, чтобы был один объект на одного покупателя.

Используя данный модуль, можно перевести указанную выше таблицу в массив объектов JavaScript, где каждый элемент этого массива - это объект, описывающий параметры конкретного покупателя и его покупки.

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
        customer_id: {constant: true, type: 'number', mainKey: true},
        product: {constant: false, type: 'string'},
        product_id:{constant: false, type: 'number'},
        customer_name: {constant: true, type: 'string'},
        price: {constant: false, type: 'number'},
        closed: {constant: false, type: 'boolean'},
        customer_status: {constant: true, type: 'number'}
    };
let obj = csvToObj(data, ';', description);
```
Функция csvToObj принимает следующие параметры:
* data: csv таблица в виде строки.
* delimeter: разделитель столбцов во входной таблице.
* description: описание входной таблицы.
* isSorted [optional]: указывает имеет ли входная таблица отсортированные данные. Если данные во входной таблице уже отсортированы по столбцу, для которого проставлено mainKey: true в description, то в качестве параметра isSorted можно указать  true и программа не будет проводить сортировку данных, что сэкономит время работы. Но если isSorted задан, а данные на самом деле не отсортированы, то это приведёт к неверному результату преобразования.

В параметре description описывается входная таблица:
* constant: указывается является ли определённый столбец постоянным значением или массивом. В нашем примере постоянными значениями являются те столбцы, которые описывают параметры покупателей. В тоже время, столбцы, которые описывают товары - не являются константными. В результирующем объекте они будут сохранены в виде массивов.
* type: описывается тип значений столбца. Поддерживаются три варианта: "number", "string" и "boolean".
* mainKey: одно из свойств description с constant: true,  должно иметь свойство mainKey: true. Это укажет программе столбец, по которому будет проводится группировка объектов. По нему же будет проводится сортировка входной таблицы.



Можно заметить, что в объекте, который возвращает функция csvToObj, свойства, относящиеся к товарам, содержат массивы одинаковой длины. Используя функцию combineArrays, можно преобразовать эти массивы в единственный массив объектов, что в некоторых случаях может быть более естественным представлением данных в JavaScript.

```javascript
const combineArrays = require('csv-to-js-parser').combineArrays;
obj = combineArrays(obj, 'products', ['product_id', 'product', 'price', 'closed'], ['product_id', 'name', 'price', 'closed']);
```
Функция combineArrays принимает следующие параметры:
* obj: входной объект (обычно полученный из csvToObj).
* newKey: имя свойства, в котором будут объединены массивы.
* arrayKeys: имена свойств во входном объекте, которые являются массивами.
* newArrayKeys [optional]: если задан, то имена свойств, которые переопределят свойства из arrayKeys, то есть в выходном объекте вместо свойств arrayKeys будут свойства newArrayKeys.

Результат работы функции combineArrays для нашего примера представлен ниже:
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

Для обратного преобразования в объект с отдельными массивами можно воспользоваться функцией separateArrays.

```javascript
const separateArrays = require('csv-to-js-parser').separateArrays;
obj = separateArrays(obj, 'products', ['product_id', 'name', 'price', 'closed'], ['product_id', 'product', 'price', 'closed']);
```

В этой функции параметры, аналогичны тем, что используются в combineArrays:

* obj: входной объект (обычно, полученный из combineArrays).
* objArrayKey: имя свойства, в котором объединены массивы.
* arrayKeys: имена свойств во входном объекте, которые нужно сделать отдельными массивами .
* newArrayKeys [optional]: если задан, то имена свойств, которые переопределят свойства из arrayKeys, то есть в выходном объекте вместо свойств arrayKeys будут свойства newArrayKeys.

Результатом работы этой функции будет первоначальный объект, полученный из csvToObj.



Для сохранения объектов, полученных в результате работы функций csvToObj или combineArrays в файл, можно воспользоваться встроенной в node.js функцией JSON.stringify();

```javascript
const json = JSON.stringify(obj, null, ' ');
fs.writeFileSync('data.json', json);
```



Для обратного преобразования объекта в текстовый csv формат можно воспользоваться функцией objToCsv.

```javascript
const objToCsv = require('csv-to-js-parser').objToCsv;
const csv = objToCsv(obj, ';');
fs.writeFileSync('newData.csv', csv);
```
Функция objToCsv принимает следующие параметры:
* obj: входной объект (формат должен соответствовать тому, который возвращает csvToObj).
* delimeter: разделитель столбцов в выходной таблице.
* rowDelimeter [optional]: разделитель строк. Если не задан, то по умолчанию используется "LF" (\n). Для windows разумно указывать в этом параметре разделитель "CRLF" (\r\n).

## Лицензия MIT
https://github.com/Mendeo/csv-to-js-parser/blob/master/LICENSE