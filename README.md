# Fastest web app

This is going to be the fastest realistic webapp on the planet. I added the word realistic as I understand vanilla JS is fastest, but that is not scalable to a team of engineers working on aproject.

Here is what I am going to do:

1. Use Preact instead of react
2. Use service worker and employ offline cache
3. Use SSR
4. Use AMP
5. Differential bundling
6. Preload
7. Prerender
8. Code splitting -> All files under /routes and /components/async are code splitted

Also I am going to follow the recommendations of these resources

1. https://youtu.be/5Dn3N3exIns

## CLI Commands

- `npm install`: Installs dependencies

- `npm run dev`: Run a development, HMR server

- `npm run serve`: Run a production-like server

- `npm run build`: Production-ready build

- `npm run lint`: Pass TypeScript files using ESLint

- `npm run test`: Run Jest and Enzyme with
  [`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure) for
  your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).

Best helper for preact: [https://nicedoc.io/preactjs/preact-cli#webpack](https://nicedoc.io/preactjs/preact-cli#webpack)

## Notifications

It is not a web app unless it shows notifications. To check the guide of notifications follow this [codesandbox url](https://codesandbox.io/s/sw-1-n6730?file=/index.html).
This [Notifications](https://github.com/bisho1995/fastest-web-app/blob/main/src/helper/Notification.ts) class in this project is intended to handle notifications.

## Service worker

Extracted the service worker code from preact-cli/sw and using this in my custom sw.js file. The reason of doing is removing the opaque nature of the earlier approach to see clearly what is going on.

1. Preact provides a list of assets which we can provide to workbox to cache them.
2. We use different modules of workbox to define the caching strategies
3. We follow a network first approach, aka first check the network then put in cache.


## Testing
https://preactjs.com/guide/v10/preact-testing-library/
