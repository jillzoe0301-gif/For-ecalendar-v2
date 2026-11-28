/* FOR-e Calendar V2 PWA 1-3fe-ui8
 * Cache static shell/assets only. Never cache Supabase/API/auth or user data.
 */
const VERSION = '1-3fe-ui8';
const PREFIX = 'for-e-pwa-';
const STATIC_CACHE = PREFIX + 'static-' + VERSION;
const SHELL_CACHE = PREFIX + 'shell-' + VERSION;
const OFFLINE_URL = '/offline.html';
const PRECACHE = [
  OFFLINE_URL,
  '/site.webmanifest?v=1-3fc',
  '/pwa.css?v=1-3fc',
  '/pwa-register.js?v=1-3fc',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon-192.png',
  '/maskable-icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(PRECACHE)));
  // Do not skipWaiting automatically: user may be editing a form.
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(PREFIX) && key !== STATIC_CACHE && key !== SHELL_CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'FOR_E_PWA_SKIP_WAITING') self.skipWaiting();
});

function isApiOrSensitivePath(path) {
  return /^\/(rest|auth|functions|storage|realtime|graphql|api)(\/|$)/i.test(path);
}
function isStaticAsset(url) {
  if (url.pathname.startsWith('/assets/')) return true;
  if (/^\/(pwa-register\.js|pwa\.css|site\.webmanifest|favicon(?:-[0-9]+x[0-9]+)?\.(?:ico|svg|png)|icon-(?:192|512)\.png|maskable-icon-(?:192|512)\.png|apple-touch-icon\.png)$/.test(url.pathname)) return true;
  return /\.(?:png|jpe?g|webp|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);
}
async function networkFirstNavigation(request) {
  try {
    const response = await fetch(new Request(request, {cache: 'no-store'}));
    if (response && response.ok) return response;
    throw new Error('Navigation failed');
  } catch (_) {
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;
    return new Response('<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FOR-e 暫時離線</title><body style="font-family:system-ui;padding:32px;color:#263247"><h2>目前無法連線</h2><p>FOR-e 需要連網才能讀取最新行程與資料。請確認網路後重新整理。</p></body></html>', {headers:{'Content-Type':'text/html; charset=utf-8'},status:200});
  }
}
async function cacheFirstStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok && response.type === 'basic') await cache.put(request, response.clone());
  return response;
}
self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const title = String(payload.title || 'FOR-e｜行程通知');
  const options = {
    body: String(payload.body || '您有一筆新的行程通知，請開啟 FOR-e 查看。'),
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: String(payload.tag || 'for-e-notification'),
    renotify: false,
    data: { url: String(payload.url || '/'), scheduleId: payload.data?.scheduleId || '' }
  };

  // Safari on iOS requires visible notifications; always show immediately.
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const rawUrl = String(event.notification.data?.url || '/');
  let targetUrl = self.location.origin + '/';
  try {
    const parsed = new URL(rawUrl, self.location.origin);
    if (parsed.origin === self.location.origin) targetUrl = parsed.href;
  } catch (_) {}

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(client => {
      try { return new URL(client.url).origin === self.location.origin; }
      catch (_) { return false; }
    });
    if (existing) {
      try { await existing.navigate(targetUrl); } catch (_) {}
      await existing.focus();
      return;
    }
    await self.clients.openWindow(targetUrl);
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isApiOrSensitivePath(url.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  if (isStaticAsset(url)) event.respondWith(cacheFirstStatic(request).catch(() => fetch(request)));
});
