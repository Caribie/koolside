import format from 'string-format'

import config from '../includes/config'
import { createElement } from "../includes/utils"

const template =  /* less */`
  @font-sans: {font_family_sans};
  @font-serif: {font_family_serif};
  @font-monospace: {font_family_monospace};

  @color-primary: #4A56A8;
  @color-primary-dark: #23284f;
  @color-primary-darker: #171a33;

  .ks-clearfix {
    &:after {
      display: table;
      clear: both;
      content: '';
    }
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  body,
  .gall_list,
  button, input, select, table, textarea {
    font-family: @font-sans;
  }

  body {
    /* 광고 */
    &.ks-hide-ad {
      #ad-layer,
      #zzbang_ad,
      .rightbanner,
      .ub-content.dory {
        display: none;
      }
    }

    &.ks-hide-logo .dc_logo {
      visibility: hidden;
    }

    /* 갤러리 */
    &.ks-hide-title {
      .wrap_inner .page_head,
      .left_content header {
        display: none;
      }
    }
    &.ks-hide-titlebar {
      .left_content article:nth-child(2) {
        display: none;
      }
    }
    &.ks-hide-history {
      .visit_history {
        display: none;
      }
    }
    &.ks-hide-notice {
      [data-type=icon_notice] {
        display: none;
      }
    }

    &.ks-hide-right {
      .left_content {
        float: none;
        width: 100%;
      }

      .issuebox {
        width: 100%;
      }
      .minor_intro_box {
        width: calc(100% - 155px);
      }
      .visit_history {
        width: 100%;
        box-sizing: border-box;
      }
      .list_array_option {
        width: 100%;
      }
      .right_content {
        display: none;
      }
    }

    &.ks-hide-right .stickyunit {
      display: none;
    }
    &.ks-hide-right-login .login_box {
      display: none;
    }
    &.ks-hide-right-recommend .r_recommend {
      display: none;
    }
    &.ks-hide-right-issuezoom .r_issuezoom {
      display: none;
    }
    &.ks-hide-right-news .r_news {
      display: none; 
    }
    &.ks-hide-right-realtime .r_realtime_issue {
      display: none;
    }
    &.ks-hide-right-hit .r_hit { 
      display: none; 
    }
    &.ks-hide-right-sec-recommend .r_sec_recommend { 
      display: none; 
    }
    &.ks-hide-right-wiki .r_wiki { 
      display: none; 
    }
  
    &.ks-prevent-scrolling {
      overflow: hidden;
      height: 100%;
    }
  }

  #ks-contextmenu {
    transition: transform .2s;
    transform: scale(0);
    z-index: 1000;
    visibility: hidden;
    overflow: hidden;
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    width: 150px;
    max-height: 300px;
    border-radius: 5px;
    background: @color-primary-dark;
    color: white;

    li {
      padding: 1em;
      cursor: pointer;
    }

    &.ks-active {
      visibility: visible;
      transform: scale(1);
      transform-origin: top left;
    }
  }

  #ks-config {
    transition: opacity .25s;
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    visibility: hidden;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    cursor: pointer;

    > div {
      overflow: hidden;
      overflow-y: auto;
      width: 100%;
      min-width: 400px;
      max-width: 600px;
      height: 100%;
      min-height: 300px;
      max-height: 80%;
      border-radius: 5px;
      background: @color-primary-dark;
      box-shadow: 0 0 100% black;
      color: white;
      cursor: initial;
    }

    .ks-config-item {
      box-sizing: border-box;
      padding: 0.5em 1em;
      
      &:nth-child(even) {
        background: rgba(0, 0, 0, .15);
      }
    }

    .ks-config-key {
      display: block;
      width: 100%;

      label {
        float: left;
        display: inline-block;
        cursor: pointer;
      }

      > input {
        float: right;
        display: inline-block;
        border: 1px solid rgba(0, 0, 0, .15);
        background: @color-primary-dark;
        font-family: @font-monospace;
        color: white;
      }

      .ks-clearfix();
    }
    
    &.ks-active {
      visibility: visible;
      opacity: 1;
    }
  }

  #ks-preview {
    transition: opacity .25s;
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    transition: opacity .25s;
    visibility: hidden;
    padding: 1em;
    max-width: 500px;
    max-height: 250px;
    opacity: 0;
    background: black;
    box-shadow: 0 0 5px black;
    border-radius: 5px;
    font-size: {font_size_preview};
    line-height: {font_size_preview};
    color: white;

    img {
      max-width: 100%;
      max-height: 200px;
      cursor: pointer;

      &.ks-active {
        max-height: 100%;
      }
    }

    &.ks-active {
      visibility: visible;
      opacity: .85;
    }
  }

  .us-post {
    transition: opacity .25s;

    &.ks-new {
      animation-name: ks-new;
      animation-duration: .5s;
    }
    &.ks-deleted {
      background: rgb(240, 100, 100)
    }
    &.ks-loading {
      opacity: .5;
    }
  }

  @keyframes ks-new {
    from {
      transform: scaleY(0);
      max-height: 0;
      background: rgba(240, 100, 100, 1);
    }
    to {
      transform: scaleY(1);
      max-height: 100%;
      background: rgba(240, 100, 100, 0);
    }
  }
`

const componentStyle: Component = {
  create () {
    const style = createElement('<style id="ks-style" type="text/less"></style>')
    style.innerHTML = format(template, config.get('style'))
    document.head.append(style)

    if (config.get('debug.less')) {
      less.options.env = 'development'
    }

    less.refresh()
  },
  destroy () {
    document.querySelector('#ks-style')?.remove()
  }
}

export default componentStyle
