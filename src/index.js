require('../src/css/index.css');
require('../src/css/balloonContentLayout.css');

function init() {
    var points = [];

    var map = new ymaps.Map('map', {
        center: [57.5262, 38.3061], // Углич
        zoom: 14
    }, {
        searchControlProvider: 'yandex#search'
    });

    // макет с информацией о выбранном геообъекте.
    var ClusterContentLayout = ymaps.templateLayoutFactory.createClass(
        require('../src/templates/clusterContentLayout.twg'), {
            // Переопределяем функцию build, чтобы при создании макета начинать
            // слушать событие click на кнопке-счетчике.
            build: function() {
                // Сначала вызываем метод build родительского класса.
                ClusterContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
                var element = document.querySelector('#place-link');

                element.addEventListener('click', this.onClick);

            },
            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function() {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                var element = document.querySelector('#place-link');

                element.removeEventListener('click', this.onClick);
                ClusterContentLayout.superclass.clear.call(this);
            },
            onClick: function(e) {
                var element = document.querySelector('#place-link');
                var index = element.dataset.id;
                var point = points[index];

                map.balloon.close();
                openSingleBallon(point.coords);
                e.preventDefault();
            }
        });

    ymaps.layout.storage.add('map#ClusterContentLayout', ClusterContentLayout);
    var clusterer;
    
    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: 'map#ClusterContentLayout',
        // Устанавливаем режим открытия балуна. 
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5,
        // Настройка внешего вида нижней панели.
        // Режим marker рекомендуется использовать с небольшим количеством элементов.
        clusterBalloonPagerType: 'marker',
    });
    map.geoObjects.add(clusterer);

    // Создание макета содержимого балуна.
    // Макет создается с помощью фабрики макетов с помощью текстового шаблона.
    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(

        require('../src/templates/balloonContentLayout.twg'), {
            // Переопределяем функцию build, чтобы при создании макета начинать
            // слушать событие click на кнопке.
            build: function() {
                // Сначала вызываем метод build родительского класса.
                BalloonContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
                var button = document.querySelector('#add-button');

                button.addEventListener('click', this.onAddDescription);

            },
            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function() {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                var button = document.querySelector('#add-button');

                button.removeEventListener('click', this.onAddDescription);
                BalloonContentLayout.superclass.clear.call(this);
            },
            onAddDescription: function(e) {
                var button = document.querySelector('#add-button');
                var place = document.querySelector('#place-input');
                var name = document.querySelector('#name-input');
                var description = document.querySelector('#description-input');
                var x = parseFloat(button.dataset.x);
                var y = parseFloat(button.dataset.y);
                var address = button.dataset.address;

                map.balloon.close();

                var idx = points.length;

                pushPoint([x, y], address, name.value, place.value, description.value);
                var placeMark = new ymaps.Placemark(...getPlacemarkData(points[idx], idx));

                clusterer.add(placeMark);
                localStorage.points = JSON.stringify(points);
                e.preventDefault();
            }
        });

    ymaps.layout.storage.add('map#BalloonContentLayout', BalloonContentLayout);

    function getBallonContent(coords, address) {

        var data = points.filter(function(item) {
            return (item.coords[0] == coords[0]) && (item.coords[1] == coords[1]);
        });

        return {
            // Устаналиваем данные, которые будут отображаться в балуне.
            data: data,
            address: address,
            x: coords[0],
            y: coords[1]
        };
    }

    function getPlacemarkData(item, index) {
        var placeMarkData = getBallonContent(item.coords, item.address);

        Object.assign(placeMarkData, item);
        placeMarkData.index = index;

        return [item.coords, placeMarkData, {
            balloonContentLayout: 'map#BalloonContentLayout',
            balloonPanelMaxMapArea: 0
        }];

    }

    function pushPoint(coords, address, name, place, description) {
        points.push({
            address: address,
            coords: coords,
            name: name || 'Анонимус',
            place: place || address,
            description: description
        })
    }

    function openSingleBallon(coords) {

        ymaps.geocode(coords, {
            results: 1
        }).then(res => {
            var address = res.geoObjects.get(0) ?
                res.geoObjects.get(0).properties.get('name') : 'Не удалось определить адрес.';

            // Открываем балун на карте (без привязки к геообъекту).      
            map.balloon.open(coords, {
                properties: getBallonContent(coords, address)
            }, {
                contentLayout: 'map#BalloonContentLayout',
                balloonPanelMaxMapArea: 0,

            });
        });

    }

    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    // При возникновении такого события добавим метку.
    map.events.add('click', e => {
        var coords = e.get('coords');

        openSingleBallon(coords);
    });
    //
    if (localStorage.points) {
        points = JSON.parse(localStorage.points);
    }
    var geoObjects = [];

    points.forEach((item, i) => {
        geoObjects.push(new ymaps.Placemark(...getPlacemarkData(item, i)));
    });
    clusterer.removeAll();
    clusterer.add(geoObjects);
}
ymaps.ready(init);
