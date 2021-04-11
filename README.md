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
