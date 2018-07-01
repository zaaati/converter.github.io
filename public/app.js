var currency_name = 'ng';
function trackInstalling(worker) {
    worker.addEventListener('statechange', function () {
        if (worker.state == 'installed') {
            updateReady(worker);
        }
    });
}

function updateReady(worker) {
   
    worker.postMessage({
        action: 'skipWaiting'
	const answer = prompt("There is an update ready.");
    });
}

var dbPromise = idb.open('currency-converter', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('currency-converters', {
        keyPath: 'time'
    });
    store.createIndex('by-date', 'time');
});

navigator.serviceWorker.register('/sw.js').then(function (reg) {
    console.log('cool zatti;');
    if (!navigator.serviceWorker.controller) {
        return;
    }

    if (reg.waiting) {
        updateReady()
        return;
    }

    if (reg.installing) {
        trackInstalling(reg.installing);
        return;
    }

    reg.addEventListener('updatefound', function () {
        trackInstalling(reg.installing);
    });

    navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
    });
}).catch(function (err) {
    console.log("Boo!");
    console.log(err);
});

function fetchcurrencyconverter(currency) {
    var currencyconverterurl =  `https://www.currencyconverterapi.com/api/v5/countries?apiKey=[YOUR_API_KEY]`;
    fetch(`https://www.currencyconverterapi.com/api/v5/countries?apiKey=[YOUR_API_KEY]`)
        .then(response => response.json())
        .then(function(results) {
            var data = results.articles;
            dbPromise.then(function(db) {
                var tx = db.transaction('currency-converters', 'readwrite');
                var store = tx.objectStore('currency-converters');
                data.forEach(function(currencyconverter) {
                    store.put(currency-converter);
                });
                store.index('by-date').openCursor(null, 'prev').then(function(cursor) {
                    return cursor.advance(30);
                }).then(function deleteRest(cursor) {
                    if (!cursor) return;
                    cursor.delete();
                    return cursor.continue().then(deleteRest);
                });
            });
            loadPosts(data);
        });
}
function fetchcurrencyconverter(currency) {
    var currencyconverterurl =  `https://www.currencyconverterapi.com/api/v5/currencies?apiKey=[YOUR_API_KEY]`;
    fetch(`https://www.currencyconverterapi.com/api/v5/currencies?apiKey=[YOUR_API_KEY]`)
        .then(response => response.json())
        .then(function(results) {
            var data = results.articles;
            dbPromise.then(function(db) {
                var tx = db.transaction('currency-converters', 'readwrite');
                var store = tx.objectStore('currency-converters');
                data.forEach(function(currencyconverter) {
                    store.put(currency-converter);
                });
                store.index('by-date').openCursor(null, 'prev').then(function(cursor) {
                    return cursor.advance(30);
                }).then(function deleteRest(cursor) {
                    if (!cursor) return;
                    cursor.delete();
                    return cursor.continue().then(deleteRest);
                });
            });
            loadPosts(data);
        });
}

function loadPosts(data) {
    var toadd = data.map(currencyconverter => `
            <div class="thumbnail">
                <img src="${currency-converter.urlToImage}" class="img-responsive">
                <div class="caption">
                    <h3>
                        <a href="${currency-converter.url}" target="_blank">${currency-converter.title}</a>
                        <small>${currency-converter.time}</small>
                    </h3>
                    <p>Author: ${currency-converter.author}</p>
                    <p>${currency-converter.description}</p>
                    <p>
                        <a href="${currency-converter.url}" target="_blank" class="btn btn-primary" role="button">View</a>
                    </p>
                </div>
            </div>`).join("");

            $('.col-sm-12').html(toadd);
    
}

function showCachedcurrencyconverter() {
    console.log('zaatti finally cached');
    dbPromise.then(function(db) {
        var index = db.transaction('currency-converters')
            .objectStore('currency-converters').index('by-date');
        
        return index.getAll().then(function(messages) {
            // add the messages to posts messages.reverse()
            loadPosts(messages.reverse());
        });
    });
}

window.addEventListener('load', function() {
    console.log('zatti converted');
    showCachedcurrency-converter();

    fetchcurrency-converter(currency_name);
    getAllSources();
});
$('#CURR_FR').change(function(e) {
    console.log(e.target.value);
    var currency = e.target.value;
    fetchcurrency-converter(currency);
});
$('#CURR_TO').change(function(e) {
    console.log(e.target.value);
    var currency = e.target.value;
    fetchcurrency-converter(currency);
});
$('#sources_filter').change(function(e) {
    console.log("Sources filter seen");
    var source = e.target.value;
    console.log(source);
    fetch(`https://www.currencyconverterapi.com/api/v5/convert?q=USD_PHP,PHP_USD&compact=ultra&date=[yyyy-mm-dd]&apiKey=[YOUR_API_KEY]`)
        .then(response => response.json())
        .then(function(data) {
            loadPosts(data.articles)
        });
});
