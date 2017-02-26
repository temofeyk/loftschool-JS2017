/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

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

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */
function createCookieTr(name, value) {
    let tr=document.createElement('tr');

    listTable.appendChild(tr);

    let td=document.createElement('td');
    
    td.innerText=name;
    tr.appendChild(td);

    td=document.createElement('td');
        
    tr.appendChild(td);
    td.innerText=value;
    td.style['word-break'] = 'break-all';
    td.style['word-wrap'] = 'break-word';
  
    td=document.createElement('td');
    tr.appendChild(td);

    let button = document.createElement('button');

    button.innerText = 'X';
    td.appendChild(button);

    button.addEventListener('click', (e) => {
        let date = new Date(0);

        document.cookie = `${e.target.parentElement.parentElement.firstChild.innerText}=;` +
                          `expires=${date.toUTCString()}`;        
        listTable.removeChild(e.target.parentElement.parentElement);
    });

}

/**
 * Функция должна вернуть все cookie документа
 *
* @return {cookie: String}
 *
 */
function getCookies() {
    return document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
}

/**
 * Функция должна перебрать и удалить все дочерние узлы элемента where
 *
 * @param {Element} where - где искать
 *
 */
function deleteSubElements(where) {
    
    while (where.firstElementChild) {
        where.removeChild(where.firstElementChild);
    }
}

/**
 * Функция обновляет таблицу со значениями cookie
 *
 */
function updateList() {
    let cookies = getCookies();

    deleteSubElements(listTable);
    for (let cookie in cookies) {
        if (filterNameInput.value =='' ||
            isMatching(cookie, filterNameInput.value) ||
            isMatching(cookies[cookie], filterNameInput.value)) {
            createCookieTr(cookie, cookies[cookie]);
        }
    }
}

filterNameInput.addEventListener('keyup', function() {
    updateList();
});

addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    updateList();  
});

updateList();