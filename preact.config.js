// ... imports or other code up here ...
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");
const webpack = require("webpack");

function findPath(a, obj, path = "") {
  if (typeof obj !== "object" || Array.isArray(obj)) return "";
  let ans = "";
  for (const key of Object.keys(obj)) {
    if (key === a) return path;
    ans += findPath(a, obj[key], `${path}/${key}`);
  }

  return ans;
}

// these props are both optional
export default {
  // you can add preact-cli plugins here
  plugins: [
    // either a function
    // (you'd probably import this because you can use the `webpack` function instead of an inline plugin)
    function (...e) {
      console.log(e);
    },
  ],
  /**
   * Function that mutates the original webpack config.
   * Supports asynchronous changes when a promise is returned (or it's an async function).
   *
   * @param {object} config - original webpack config.
   * @param {object} env - options passed to the CLI.
   * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
   * @param {object} options - this is mainly relevant for plugins (will always be empty in the config),
   * default to an empty object
   * */
  webpack(config, env, helpers, options) {
    /** you can change the config here * */
    config.node.process = true;
    console.log("NODE_ENV => ", process.env.NODE_ENV);
    console.log(config.plugins.length);
    const fs = require("fs");
    fs.writeFileSync("config.json", JSON.stringify(env));
    const isDevelopment = process.env.NODE_ENV === "development";
    if (isDevelopment) {
      const swPath = path.join(__dirname, "src", path.sep, "sw.js");

      config.plugins.push(
        new InjectManifest({
          swSrc: swPath,
          include: [
            /200\.html$/,
            /\.js$/,
            /\.css$/,
            /\.(png|jpg|svg|gif|webp)$/,
          ],
          exclude: [/\.esm\.js$/],
        })
      );
    }
  },
};
