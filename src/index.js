/* ДЗ 3 - объекты и массивы */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    let result = [];

    for (let i = 0; i < array.length; i++) {
        result[i] = fn(array[i], i, array);
    }

    return result;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {

    let result = initial;
    let counter = 0;

    if (arguments.length < 3) {
        result = array[0];
        counter++;
    }

    for (let i = counter; i < array.length; i++) {
        result = fn(result, array[i], i, array);
    }

    return result;
}

/*

 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return prop in obj;
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    return Object.keys(obj) ;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    return Object.getOwnPropertyNames(obj).map(String.toUpperCase);
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to) {
    let result = [];

    if (arguments.length < 2) {
        from = 0;
        to = array.length;
    } else if (arguments.length < 3) {
        to = array.length;
    }

    if (from < 0) {
        from = array.length + from;
        if (from < 0) {
            from = 0;
        }
    }
    if (to < 0) {
        to = array.length + to;
    }
    if (from >= array.length) {
        return result;
    }
    if (from > to) {
        return result;
    }

    if (to > array.length) {
        to = array.length;
    }

    for (let i = from; i < to; i++) {
        result.push(array[i]);
    }

    return result;

}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {

    return new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value * value;

            return true;
        }
    })
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
