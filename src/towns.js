/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {

    return require('./index').loadAndSortTowns();
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    let result = true;

    if (full.toLowerCase().indexOf(chunk.toLowerCase()) === -1) {
        result = false;
    }

    return result;
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');

/**
 * Функция должна перебрать и удалить все дочерние узлы элемента where
 * @param {Element} where - где искать
 *
 */
function deleteSubNodes(where) {
    let counter = where.childNodes.length - 1;

    for (let i = counter; i >= 0; i--) {
        let el = where.childNodes[i];

        where.removeChild(el);     
    }
}

let townList = [];

filterInput.addEventListener('keyup', function() {    
    let value = this.value.trim();

    deleteSubNodes(filterResult);

    if (value.length == 0) {
        return;
    }

    for (let item of townList) {
        if (isMatching(item.name, value)) {
            let div = document.createElement('div');

            div.innerText = item.name;
            filterResult.appendChild(div);
        }    
    }
});

let reloadButton = document.createElement('button');

reloadButton.innerText = 'Повторить загрузку';

/**
 * Обработчик успешной загрузки городов
 *
 */
function onLoadTownsHandler(arr) {
    townList = arr;
    loadingBlock.hidden = true;
    reloadButton.hidden = true;
    filterBlock.hidden = false;
}

/**
 * Обработчик неудачной загрузки городов
 *
 */
function onFailHandler() {
    reloadButton.hidden = false;
}

/**
 * Обработчик кнопки повторной загрузки городов
 *
 */
function reloadButtonClick () {
    loadTowns().then(onLoadTownsHandler, onFailHandler);
}  
// добавление скрытой кнопки загрузки городов
reloadButton.hidden = true;
filterBlock.hidden = true;
homeworkContainer.appendChild(reloadButton);
reloadButton.addEventListener('click', reloadButtonClick);
// программное нажатие кнопки для первой попытки загрузки городов
reloadButton.dispatchEvent(new Event('click'));

export {
    loadTowns,
    isMatching
};
