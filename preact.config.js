// ... imports or other code up here ...
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");
const webpack = require("webpack");



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
    const isDevelopment = process.env.NODE_ENV === "development";
    const swPath = path.join(__dirname, "src", path.sep, "sw.js");

    const commonInjectManifestConfig = {
      // maximumFileSizeToCacheInBytes: 1024 * 1024 * 1024, // 1gb
      swSrc: swPath,
      include: [
        /^\/?index\.html$/,
        /\.esm.js$/,
        /\.css$/,
        /\.(png|jpg|svg|gif|webp)$/,
      ],
    };

    console.log("===== walking through preact.config.js ==============")
    if (isDevelopment && env.esm && env.sw) {
      config.plugins.push(
        new InjectManifest({
          ...commonInjectManifestConfig,
          swDest: "sw-esm.js",
          webpackCompilationPlugins: [
            new webpack.DefinePlugin({
              "process.env.ESM": true,
            }),
          ],
        })
      );
    }

    if (isDevelopment && env.sw) {
      config.plugins.push(
        new InjectManifest({
          ...commonInjectManifestConfig,
          swSrc: swPath,
          exclude: [/\.esm\.js$/],
        })
      );
    }

  },
};
