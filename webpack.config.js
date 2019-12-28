const path = require('path')
const { BannerPlugin } = require('webpack')
const { stripIndent } = require('common-tags')

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.user.js'
  },
  plugins: [
    new BannerPlugin({
      raw: true,
      banner: stripIndent`
        // ==UserScript==
        // @name          koolside
        // @namespace     https://github.com/toriato/koolside
        // @version       1.0.0
        // @author        Sangha Lee
        // @description   디시인사이드 도우미
        // @include       https://*.dcinside.com/*
        // @grant         GM_getValue
        // @grant         GM_setValue
        // @grant         GM_xmlhttpRequest
        // @run-at        document-start
        // ==/UserScript==`
    })
  ]
}
