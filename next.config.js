// const withTypescript = require('@zeit/next-typescript');
// const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
// const { genSerial } = require('phusis');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// module.exports = withTypescript({
  // distDir: '.build',
  // generateEtags: true,
  // onDemandEntries: {
  //   // period (in ms) where the server will keep pages in the buffer
  //   maxInactiveAge: 25 * 1000,
  //   // number of pages that should be kept simultaneously without being disposed
  //   pagesBufferLength: 2
  // },
  // pageExtensions: ['tsx', 'ts'],
  // webpack(config, options) {
  //   if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin());
  //   const { buildId, dev, isServer, defaultLoaders, webpack } = options;
  //   config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
  //   return config;
  // },
  // webpackDevMiddleware(config) {
  //   // Perform customizations to webpack dev middleware config
  //   // Important: return the modified config
  //   return config;
  // },
  // generateBuildId: async () => {
  //   // For example get the latest git commit hash here
  //   return genSerial();
  // }
// });
const withTypescript = require('@zeit/next-typescript');

module.exports = withTypescript(
  {
    webpack(config, options) {
      // Further custom configuration here
      return config;
    }
  }
);