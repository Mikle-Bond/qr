// vim: ts=4:sts=4:sw=4:et
const cacheVersion = 'v0.1.2';
const cacheTitle = `qr-${cacheVersion}`;
const forceFetch = false; // FOR DEVELOPMENT: Set to true to always update assets instead of using cached versions
const fetchTimeout = 10000;
const urlsToCache = [
    "./",
    "index.html",
    "manifest.json",
    "style.css",
    "sw.js",
    "app.js",
    "fakeQR.gif",

    "apple-touch-icon-114x114.png",
    "apple-touch-icon-120x120.png",
    "apple-touch-icon-144x144.png",
    "apple-touch-icon-152x152.png",
    "apple-touch-icon-57x57.png",
    "apple-touch-icon-72x72.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon.ico",
    "favicon.png",

    "https://unpkg.com/simpledotcss/simple.min.css",
    "https://cdn.jsdelivr.net/gh/ushelp/EasyQRCodeJS@master/dist/easy.qrcode.min.js",
];

self.addEventListener('install', function(event) {
  // Perform install steps
    event.waitUntil(
        caches.open(cacheTitle)
        .then(cache => 
            cache.addAll(urlsToCache)
            .then(_ => {
                console.log('All files cached.');
            })
        )
    );
});

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
    new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then(response => {
            clearTimeout(timeoutId);
            fulfill(response);
            update(request).then(() => console.log("Cache successfully updated for", request.url));
        }, reject);
    });

// fetch the resource from the browser cache
const fromCache = request =>
    caches
        .open(cacheTitle)
        .then(cache =>
            cache.match(request)
        );

// cache the current page to make it available for offline
const update = request =>
    caches
        .open(cacheTitle)
        .then(cache =>
            fetch(request)
                .then(async response => {
                    await cache.put(request, response);
                })
                .catch(() => console.log(`Cache could not be updated. ${request.url}`))
        );

// general strategy when making a request (eg if online try to fetch it
// from cache, if something fails fetch from network. Update cache everytime files are fetched.
// This way files should only be fetched if cacheVersion is changed
const fetch = request => {
    if (forceFetch) {
        return fromNetwork(request, fetchTimeout);
    } else {
        return fromCache(request).then(rsp => {
            // if fromCache resolves to undefined fetch from network instead
            return rsp || fromNetwork(request, fetchTimeout);
        });
    }
}

self.addEventListener('fetch', event => fetch(event.request));

// on activation, we clean up the previously registered service workers
self.addEventListener('activate', evt => {
        return evt.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== cacheTitle) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        )
    }
);

