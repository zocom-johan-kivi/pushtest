const cacheName = 'todo';
const staticAssets = [
    '/index.html',
    '/manifest.json',
    '/css/style.css',
    '/script.js',
    '/img/zocom-logo-black.svg',
    '/icons/icon-180.png'
];

self.addEventListener('install', (e) => {
    console.log('Service workers is installing...');
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => cache.addAll(staticAssets))
    );
})

self.addEventListener('activate', () => {
    console.log('Service worker is now activated.')
})

self.addEventListener('fetch', (e) => {
    console.log(e.request.url)
    e.respondWith(
        caches
        .match(e.request)
        .then(resp => resp || fetch(e.request))
    )
})
self.addEventListener('push', (event) => {
    console.log(event)
    if (event.data) {
        createNotification(event.data.text());
    }
})

//Skapar en notifikation med Web notifications API
const createNotification = (text) => {
    self.registration.showNotification('Shakespeare says', {
        body: text,
        icon: 'images/icons/shakespeare-apple-touch-icon.png'
    })
}