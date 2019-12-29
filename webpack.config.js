const path = require('path')
const { BannerPlugin } = require('webpack')
const { stripIndent } = require('common-tags')
const package = require('./package.json')

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
        // @version       ${package.version}
        // @author        ${package.author}
        // @description   ${package.description}
        // @include       https://*.dcinside.com/*
        // @require       https://cdnjs.cloudflare.com/ajax/libs/less.js/3.10.3/less.min.js
        // @grant         GM_getValue
        // @grant         GM_setValue
        // @grant         GM_xmlhttpRequest
        // @run-at        document-start
        // ==/UserScript==`
    })
  ]
}
