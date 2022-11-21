const { moduleResolveMapBuilder } = require('@atlassian/multi-entry-tools');
const { PORT } = require('./utils');

const createBaseEditorMobileBridgeWebpackConfig = async (args, config) => {
  const mode = typeof args.mode === 'undefined' ? 'development' : args.mode;
  const emptyExportPath = require.resolve('../empty');
  const devtool =
    mode === 'development' && typeof args.devtool !== 'string'
      ? 'source-map'
      : args.devtool;

  return {
    mode,
    stats: {
      warnings: false,
    },
    devtool,
    resolve: {
      mainFields: ['atlaskit:src', 'module', 'browser', 'main'],
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        ...(await moduleResolveMapBuilder()),
        '@atlaskit/media-viewer': emptyExportPath, // ~335kb gzip
        '@atlaskit/profilecard': emptyExportPath, // ~7kb gzip
        '@atlaskit/select': emptyExportPath,
        'react-select': emptyExportPath, // ~20kb gzip
        'components/picker/EmojiPicker': emptyExportPath,
        'react-virtualized/dist/commonjs/AutoSizer': emptyExportPath, // Official way of importing these components
        'react-virtualized/dist/commonjs/Collection': emptyExportPath, // from react-virtualized to avoid treeshaking issues
        'react-virtualized/dist/commonjs/List': emptyExportPath, // ~10kb gzip
        'react-virtualized/dist/commonjs/CellMeasurer': emptyExportPath,
        'react-virtualized': emptyExportPath, // ~10kb gzip
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                babelrc: true,
                rootMode: 'upward',
                envName: 'website',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      nodeEnv: mode,
      splitChunks: false,
    },
    ...config,
    devServer: {
      host: '0.0.0.0',
      allowedHosts: [
        // Variations of Localhost
        'localhost',
        '127.0.0.0',
        // Used on BrowserStack
        'bs-local.com',
        // Used for Android
        '10.0.2.2',
        '.ngrok.io',
      ],
      port: PORT,
      static: {
        directory: config.devServer?.static?.directory,
        serveIndex: true,
      },
    },
  };
};

module.exports = {
  createBaseEditorMobileBridgeWebpackConfig,
};
