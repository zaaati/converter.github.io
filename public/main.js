

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('currency-converter', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('currency-converter', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'time');
  });
}

function trackInstalling(worker) {
    worker.addEventListener('statechange', function () {
        if (worker.state == 'installed') {
            updateReady(worker);
        }
    });
}
var dbPromise;
function openDatabase(data) {
    dbPromise = idb.open('currency-converter', 1, function(upgradeDb) {
        var store = upgradeDb.createObjectStore('currency-converters', {
            keyPath: 'time'
        });
        store.createIndex('by-date', 'time');
    });

}

function showCachedMessages() {
    var indexController = this;

  return this._dbPromise.then(function(db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db || indexController._postsView.showingPosts()) return;

    var index = db.transaction('currency-converter')
      .objectStore('currency-converter').index('by-date');

    return index.getAll().then(function(messages) {
      indexController._postsView.addPosts(messages.reverse());
        })
    });
}

function onSocketMessage(data) {
    dbPromise.then(function(db) {
        var tx = db.transaction('currency-converters', 'readwrite');
        var store = tx.objectStore('currency-converters');
        data.forEach(function(message) {
            store.put(message);
        });
        store.index('time').openCursor(null, 'prev').then(function(cursor) {
            return cursor.advance(30)
        }).then(function deleteRest(cursor) {
            if (!cursor) return;
            cursor.delete();
            return cursor.continue().then(deleteRest);
        });
    });
}

setInterval(function() {
    cleanImageCache();
}, 1000*60*5);

function cleanImageCache() {
    dbPromise.then(function(db) {
        if (!db) return;

        var imagesNeeded = [];

        var tx = db.transaction('currency-converters');
        return tx.objectStore('currency-converters').getAll().then(function(messages) {
            messages.forEach(function(message) {
                if (message.urlToImage) {
                    imagesNeeded.push(message.urlToImage);
                }
            });

            return caches.open('currency-converter-app-imgs');
        }).then(function(cache) {
            return cache.keys().then(function(requests) {
                requests.forEach(function(request) {
                    var url = new URL(request.url);
                    if (!imagesNeeded.includes(url.pathname)) {
                        cache.delete(request);
                    }
                });
            }); 
        });
    });
}

function updateReady(worker) {
    var answer = alert("There is an update ready.");
    worker.postMessage({
        action: 'skipWaiting'
    });
}

navigator.serviceWorker.register('/sw.js').then(function (reg) {
    // console.log('Yay! am here');
    console.log('service worker now available');
    if (!navigator.serviceWorker.controller) {
        return;
    }

    if (reg.waiting) {
        updateReady()
        // trackInstalling(reg.waiting);
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
IndexController = function(data) {
  var messages = JSON.parse(data);

  this._dbPromise.then(function(db) {
    if (!db) return;

    var tx = db.transaction('currency-converter', 'readwrite');
    var store = tx.objectStore('currency-converter');
    messages.forEach(function(message) {
      store.put(message);
    });

    // TODO: keep the newest 30 entries in 'wittrs',
    // but delete the rest.
    //
    // Hint: you can use .openCursor(null, 'prev') to
    // open a cursor that goes through an index/store
    // backwards.
  });

  this._postsView.addPosts(messages);
};
