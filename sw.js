const CACHE_NAME = "memory-games-static-v1";
const IMAGE_CACHE_NAME = "memory-games-images-v1";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            cache.addAll([
                "./",
                "./index.html",
                "./manifest.webmanifest",
            ]),
        ),
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter(
                        (key) =>
                            key !== CACHE_NAME &&
                            key !== IMAGE_CACHE_NAME,
                    )
                    .map((key) => caches.delete(key)),
            ),
        ),
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then((response) => {
                    const responseClone = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });

                    return response;
                });
            }),
        );

        return;
    }

    if (
        request.destination === "image" &&
        (url.hostname === "s4.anilist.co" ||
            url.hostname.endsWith(".anilist.co"))
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        const responseClone = response.clone();

                        caches.open(IMAGE_CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });

                        return response;
                    })
                    .catch(() => caches.match(request));
            }),
        );
    }
});
