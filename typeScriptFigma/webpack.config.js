module.exports = {
    mode: 'development',
    entry: './main.ts', 
    output: {
      filename: 'main.js',
      path: __dirname,
    },
    module: {
      rules: [
        {
            test: /\.html$/,
          type: 'asset/source',
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };