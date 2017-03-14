require('./index.css');
let selectedItems = [];
let items = [];
let itemsListTemplateFn = require('../items-list.hbs');
let itemsFilter = '';
let selectedFilter = '';

let mainContainer = document.querySelector('#main-container');
let catalogElement = document.querySelector('#catalog');
let selectedItemsElement = document.querySelector('#selected');
let itemsFilterInput = document.querySelector('#items-filter');
let selectedFilterInput = document.querySelector('#selected-filter');

const TO_SELECTED_ROLE = 'toSelected';
const FROM_SELECTED_ROLE = 'fromSelected';

const STORAGE_SELECTED_ITEMS = 'selectedItems';

/**
 * Функция должна выполнить авторизацию в VK и вернуть Promise
 *
  * @return {Promise}
 */
function login() {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 5900739
        });
        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

/**
 * Функция должна  вызвать метод method VK OpenAPI c с параметрами params и вернуть Promise
 *
 * @return {Promise}
 */
function callAPI(method, params) {
    return new Promise(function(resolve, reject) {
        VK.api(method, params, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
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

/**
 * Функция должна добавить id в глобальный массив selectedItems

 */
function addItemId(id) {
    if (selectedItems.indexOf(id) == -1) {
        selectedItems.push(id);
    }    
}

/**
 * Функция должна удалить id из глобального массива selectedItems

 */
function removeItemId(id) {
    let idx = selectedItems.indexOf(id);

    if (idx > -1) {
        selectedItems.splice(idx, 1);
    } 
}

/**
 * Функция должна для элемента elem найти родительский элемент с классом 'item' и 
    вернуть его data-атрибут 'id'

 */
function getElemId(elem) {
    let e = elem.closest('.item');
    
    return (!e) ? null : e.dataset.id;
}

/**
 * Функция должна добавить обработчики для обработки перемещения элементов

 */
function addListeners() {
    mainContainer.addEventListener('click', e => {
        if (!e.target.dataset.role) {
            return;
        }
        let id = getElemId(e.target);

        if (e.target.dataset.role == TO_SELECTED_ROLE) {
            addItemId(id);
        } else if (e.target.dataset.role == FROM_SELECTED_ROLE) {
            removeItemId(id);            
        }

        render();

    });

    itemsFilterInput.addEventListener('keyup', () => {
        itemsFilter = itemsFilterInput.value;
        render();
    });

    selectedFilterInput.addEventListener('keyup', () => {
        selectedFilter = selectedFilterInput.value;
        render();
    });

    mainContainer.addEventListener('dragstart', e => {
        let id = getElemId(e.target);

        if (!id) {
            return;
        }

        e.dataTransfer.setData('Text', id);  
        e.dataTransfer.effectAllowed='move';
    });

    mainContainer.addEventListener('dragenter', e => {
        e.preventDefault();
    });   

    mainContainer.addEventListener('dragover', e => {
        e.preventDefault();
    });   
     
    selectedItemsElement.addEventListener('drop', e => {
        e.preventDefault();

        let id = e.dataTransfer.getData('Text');

        addItemId(id);
        render();     
        e.stopPropagation();
    });

    catalogElement.addEventListener('drop', e => {
        let id = e.dataTransfer.getData('Text');

        removeItemId(id);
        render();
        e.stopPropagation();
    });   
}

/**
 * Функция должна перерисовать два списки элементов на странице

 */
function render() {

    let options = {
        // только невыбранные элементы, подходящие под значение фильтра
        items: items.filter(item => (selectedItems.indexOf(String(item.id)) == -1) && 
                (itemsFilter == '' || isMatching(item.first_name + item.last_name, itemsFilter))),
        buttonCaption: '+',
        buttonRole: TO_SELECTED_ROLE
    };

    catalogElement.innerHTML = itemsListTemplateFn(options);

    options = {
        // только выбранные элементы, подходящие под значение фильтра
        items: items.filter(item => (selectedItems.indexOf(String(item.id))> -1) && 
                (selectedFilter == '' || isMatching(item.first_name + item.last_name, selectedFilter))),
        buttonCaption: 'x',
        buttonRole: FROM_SELECTED_ROLE
    };
 
    selectedItemsElement.innerHTML = itemsListTemplateFn(options);    
}

/**
 * Функция должна инициализировать страницу данными data полученными из VK, и данными из localStorage

 */
function init(data) {

    addListeners();
    items = data.items;

    if (localStorage[STORAGE_SELECTED_ITEMS]) {
        selectedItems = JSON.parse(localStorage[STORAGE_SELECTED_ITEMS]); 
    }
    render();
}

let saveFriends = document.querySelector('#saveFriends');

saveFriends.addEventListener('click', () => {
    localStorage[STORAGE_SELECTED_ITEMS] = JSON.stringify(selectedItems);
});

login()
    .then(() => callAPI('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] }))
    .then(result => init(result))        
    .catch(() => alert('не удалось получить данные из VK'));
