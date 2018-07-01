self.addEventListener('install', function(event) {
  event.waitUntil(
	caches.open('currency-converter-v1').then(function(cache){
	return cache.addAll([
    	'/',
        'index.html',
        'css/index.css',
        'css/foundation.min.css',
	'main.js',
	'JSS/foundation.min.js',
	'JSS/numeral.min.js',
	'vendor/jquery.js',
	'vendor/modernizr.js'
  ]);
	})
);
});
// rubbish
self.addEventListener('fetch', function(event) {
   caches.match(event.request).then(function(response){
	if(response) return response;
	return fetch(event.request);
})
});
