const CACHE_NAME = "spaced-out-app-v2"; // Increment cache version
const STATIC_ASSETS = ["/", "/index.html", "/icon192-v2.png", "/icon512-v2.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      // Pre-cache the main static assets
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try to get the response from the cache
      const cachedResponse = await cache.match(event.request);
      // Fetch from the network in the background
      const fetchedResponsePromise = fetch(event.request).then(
        (networkResponse) => {
          // If the fetch is successful, update the cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }
      );

      // Return the cached response if it exists, otherwise wait for the network
      return cachedResponse || fetchedResponsePromise;
    })
  );
});
