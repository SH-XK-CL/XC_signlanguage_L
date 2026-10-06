/**
 * sw.js — Service Worker：离线缓存
 * 1) 安装时预缓存本地应用外壳（app shell）
 * 2) 运行时缓存 CDN 上的 MediaPipe 资源（首次联网后离线可用）
 * 策略：本地资源 cache-first；CDN 资源 stale-while-revalidate
 */
const VERSION = 'sl-v6-0-0';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/dictionary.js',
  './js/recognizer.js',
  './js/translator.js',
  './js/tts.js',
  './js/camera.js',
  './js/app.js',
  './assets/icons/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // CDN（MediaPipe）运行时缓存
  if (url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('storage.googleapis.com')) {
    e.respondWith(
      caches.open(VERSION).then((cache) =>
        cache.match(e.request).then((cached) => {
          const fetchPromise = fetch(e.request).then((res) => { cache.put(e.request, res.clone()); return res; }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }
  // 本地：cache-first
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
