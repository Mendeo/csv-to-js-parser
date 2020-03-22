# Convert csv to JavaScript object

Конвертирование csv файлов в массив JavaScript объектов и обратно. Работает с входными таблицами в реляционном формате.

## Пример:
Пусть у нас есть таблица, с покупателями.:

| customer_id | name  |   product    | price | closed |
|-------------|-------|--------------|-------|--------|
|      1      |  Bob  |    computer  |  550  |  true  |
|      1      |  Bob  |    monitor   |  400  |  false |
|      1      |  Bob  | mobile phone |  970  |  true  |
|      2      | Alice |    laptop    |  1200 |  true  |
|      2      | Alice |     mouse    |   7   |  false |
|      3      |  Eve  |  microphone  |   20  |  true  |
|      3      |  Eve  |    router    |  105  |  false |
|      3      |  Eve  | mobile phone |  110  |  false |

Каждый покупатель обладает уникальным идентификатором customer_id. Используя данный модуль можно перевести указанную выше таблицу в массив объектов JavaScript, где каждый элемент этого массива - это объект, описывающий параметры конкретного покупателя.

```javascript
[
	{
		customer_id: 1,
		name: 'Bob',
		product: ['computer', 'monitor', 'mobile phone'],
		price: [550, 400, 970],
		closed: [true, false, true],
		status: 0
	},
	{
		customer_id: 2,
		name: 'Alice',
		product: ['laptop', 'mouse'],
		price: [1200, 7],
		closed: [true, false],
		status: 1
	},
	{
		customer_id: 3,
		name: 'Eve',
		product: ['microphone', 'router', 'mobile phone'],
		price: [20, 105, 110],
		closed: [true, false, false],
		status: 1
	}
]
```

