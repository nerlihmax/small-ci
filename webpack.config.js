const path = require('path');

module.exports = {
  entry: {
    release: './src/release/index.ts',
    build: './src/build/index.ts',
    test: './src/test/index.ts',
  },
  mode: 'production' || process.env.DEV,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'bin'),
  },
};
