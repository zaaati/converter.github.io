var staticCacheName = 'currency-converter-v1';
self.addEventListener('install', function (event) {
    var urlsToCache = [
        '/',
        'index.html',
        'idb.js',
      	'main.js',
	'app.js',
        'css/index.css',
        'css/foundation.min.css',
        'JSS/foundation.min.js',
        'JSS/numeral.min.js',
        'js/vendor/jquery.js',
        'js/vendor/modernizr.js'
	
        
    ];
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('currency-converter-v1') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
self.addEventListener('fetch', function(event) {

    var requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if(requestUrl.pathname === '/'){
		event.respondWith(caches.match('/'));
	return;
	}
     if (requestUrl.pathname === '/css') {
            event.respondWith(caches.match('/css'));
            return;
        }
      if (requestUrl.pathname === '/js/vendor') {
            event.respondWith(caches.match('/js/vendor'));
            return;
        }
      if (requestUrl.pathname === '/JSS') {
            event.respondWith(caches.match('/JSS'));
            return;
        }
    }

     event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request)
        })
    );
});

function servePhoto(request) {
    // var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');
    var storageUrl = request.url;
    return caches.open(contentImgsCache).then(function(cache) {
        return cache.match(storageUrl).then(function(response) {
            if (response) return response;

            return fetch(request).then(function(networkResponse) {
                cache.put(storageUrl, networkResponse.clone());
                return networkResponse;
            });
        });
    });
}

self.addEventListener('message', function(event) {
    if(event.data.action == 'skipWaiting') {
         self.skipWaiting();
    }
});   
