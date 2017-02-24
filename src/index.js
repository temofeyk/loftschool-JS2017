/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 1000 * seconds); 
    })
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        function loadHandler() {
            // Если код ответа сервера не 200, то это ошибка
            if (xhr.status == 200) {
                let arr = xhr.response;

                arr.sort((a, b) => (a.name < b.name && -1) || (a.name > b.name && 1) || 0);
                resolve(arr);
            } else {
                reject();  
            } 
        }

        xhr.addEventListener('load', loadHandler);
        xhr.responseType = 'json';
        xhr.open('GET', url);
        xhr.send();    
    })
}

export {
    delayPromise,
    loadAndSortTowns
};
