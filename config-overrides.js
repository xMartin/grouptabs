const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    util: require.resolve("util"),
    process: require.resolve("process/browser"),
    assert: require.resolve("assert"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
