const path = require('path')
const Wrapper = require('wrapper-webpack-plugin')
const { stripIndent } = require('common-tags')
const package = require('./package.json')

const sans = process.env.WEBPACK_MODE !== 'production' // is sans enabled? if it say WAHHHHH!!

const mode = sans ? 'development' : 'production'
const devtool = sans ? 'inline-source-map' : ''
const filename = sans ? 'debug.user.js' : 'lib.user.js'

const metadata = stripIndent`
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
// ==/UserScript==
/**/
`

module.exports = {
  entry: './src/index.ts',
  devtool,
  mode,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename
  },
  plugins: [
    // BannerPlugin 은 최적화 후에 추가되서 다른 걸로 대체
    new Wrapper({
      header: metadata,
      afterOptimizations: true
    })
  ]
}
