// 每日汉字打卡 - Service Worker
const CACHE_NAME = 'hanzi-v3';

// 安装时预缓存核心资源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        'index.html',
        'pinyin.html',
        'tetris.html',
        'pinyin-data.js',
        'manifest.json',
        'https://cdn.jsdelivr.net/npm/hanzi-writer@3.0/dist/hanzi-writer.min.js'
      ]);
    })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
          .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求：网络优先，缓存兜底（避免缓存旧版卡死）
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(resp) {
        return resp || (event.request.mode === 'navigate' ? caches.match('index.html') : null);
      });
    })
  );
});
