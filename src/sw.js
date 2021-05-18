import { registerRoute, setCatchHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { cacheNames } from "workbox-core";
import { precacheAndRoute, getCacheKeyForURL } from "workbox-precaching";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { getFiles } from "preact-cli/sw/";
import { ExpirationPlugin } from "workbox-expiration";

console.log("cacheNames.precache", cacheNames.precache);

const isNav = (event) => event.request.mode === "navigate";
const networkHandler = new NetworkFirst({
  // this cache is plunged with every new service worker deploy so we dont need to care about purging the cache.
  cacheName: cacheNames.precache,
  networkTimeoutSeconds: 5, // if u dont start getting headers within 5 sec fallback to cache.
  plugins: [
    new CacheableResponsePlugin({
      statuses: [200], // only cache valid responses, not opaque responses e.g. wifi portal.
    }),
  ],
});

/**
 * Adding this before `precacheAndRoute` lets us handle all
 * the navigation requests even if they are in precache.
 */
registerRoute(({ event }) => {
  return isNav(event);
}, networkHandler);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

setCatchHandler(({ event }) => {
  console.log("in catch", event);
  if (isNav(event)) {
    return caches.match(getCacheKeyForURL("/200.html"));
  }
  return Response.error();
});

const filesToCache = getFiles();
console.log("filesToCache => ", filesToCache);
precacheAndRoute(filesToCache);
