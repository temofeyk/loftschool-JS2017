/* ДЗ 2 - работа с исключениями и отладчиком */

/*
 Общие функции проверок
 */

const
    EMPTY_ARRAY = 'empty array',
    IS_NOT_A_FUNCTION = 'fn is not a function';    

/*
 Функция принимает массив и выбрасывает исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 */
function checkArray(array) {
    if ({}.toString.call(array) !== '[object Array]') {
        throw new Error(EMPTY_ARRAY);
    } 
    if (array.length === 0) {
        throw new Error(EMPTY_ARRAY);
    }
}

/*
 Функция принимает функцию и выбрасывает исключение в случае:
-fn не является функцией (с текстом "fn is not a function")
 */

function checkFunction(fn) {
    if ({}.toString.call(fn) !== '[object Function]') {
        throw new Error(IS_NOT_A_FUNCTION);
    }
}

/*
 Задача 1:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true только если fn вернула true для всех элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isAllTrue(array, fn) {   
    checkArray(array);
    checkFunction(fn);  
    
    let result = true;

    for (var i = 0; i < array.length; i ++) {
        result = result && fn(array[i]);
    }

    return result;
}

/*
 Задача 2:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true если fn вернула true хотя бы для одного из элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isSomeTrue(array, fn) {
    checkArray(array);
    checkFunction(fn);  

    for (var i = 0; i < array.length; i ++) {
        if (fn(array[i])) {
            return true;
        }
    }

    return false;

}

/*
 Задача 3:
 Функция принимает заранее неизветсное количество аргументов, первым из которых является функция fn
 Функция должна поочередно запусти fn для каждого переданного аргумента (кроме самой fn)
 Функция должна вернуть массив аргументов, для которых fn выбросила исключение
 Необходимо выбрасывать исключение в случаях:
 - fn не является функцией (с текстом "fn is not a function")
 */
function returnBadArguments(fn) {
    checkFunction(fn);

    let result = [];

    for (let i = 1; i < arguments.length; i++) {
        
        let arg = arguments[i];

        try {
            fn(arg);
        } catch (e) {
            result.push(arg);
        }
    }

    return result;   
}

/*
 Задача 4:
 Используя отладчик и точки остановки, определите в каких случаях if дает true
 Исправьте условие внутри if таким образом, чтобы функция возвращала true
 */
function findError(data1, data2) {
    return (function() {
        for (var i = 0; i < data1.length; i++) {           
            if ( !(isNaN(data1[i])&&isNaN(data2[i])) && !(data1[i] == data2[i]) ) {
                return false;
            }
        }

        return true;
    })();
}

/*
 Задача 5:
 Функция имеет параметр number (по умолчанию - 0)
 Функция должна вернуть объект, у которого должно быть несколько методов:
 - sum - складывает number с переданным аргументами
 - dif - вычитает из number переданные аргументы
 - div - делит number на первый аргумент. Результат делится на следующий аргумент (если передан) и так далее
 - mul - умножает number на первый аргумент. Результат умножается на следующий аргумент (если передан) и так далее

 Количество передаваемых в методы аргументов заранее неизвестно
 Необходимо выбрасывать исключение в случаях:
 - number не является числом (с текстом "number is not a number")
 - какой-либо из аргументов div является нулем (с текстом "division by 0")
 */
function calculator(number = 0) {
    const
        IS_NOT_A_NUMBER = 'number is not a number',
        DIVISION_BY_ZERO = 'division by 0';

    if (! isFinite(number)) {
        throw new Error(IS_NOT_A_NUMBER);
    }

    let result = {
        sum: function () {
            let result = number;

            for (var i = 0; i < arguments.length; i++) {
                result += arguments [i];    
            }

            return result;
        },
        dif: function () {
            let result = number;

            for (var i = 0; i < arguments.length; i++) {
                result -= arguments [i];    
            }

            return result;
        },
        div: function () {
            let result = number;

            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] === 0) {
                    throw new Error(DIVISION_BY_ZERO);
                } 
                result /= arguments [i];    
            }

            return result;
        },
        mul: function () {
            let result = number;

            for (var i = 0; i < arguments.length; i++) {
                result *= arguments [i];    
            }
            
            return result;   
        }
    }

    return result;
} 

export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    findError,
    calculator
};