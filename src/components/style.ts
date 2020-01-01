import format from 'string-format'

import Config from '../includes/config'
import { createElement } from '../includes/utils'

const template =  /* less */`
  @animation-speed: {animation_speed}s;

  @font-sans: {font_family_sans};
  @font-serif: {font_family_serif};
  @font-monospace: {font_family_monospace};

  @color-primary: #4A56A8;
  @color-crit: #f06464;


  /* Functions */
  .ks-update {
      animation-name: ks-update;
      animation-duration: @animation-speed;
    }
  .ks-clearfix {
    &:after {
      display: table;
      clear: both;
      content: '';
    }
  }
  .ks-none {
    display: none;
  }

  /* Reset */
  html, body {
    width: 100%;
    height: 100%;
  }

  body,
  .gall_list, .gall_tit, .gall_writer,
  button, input, select, table, textarea {
    line-height: {font_size};
    font-size: {font_size};
    font-family: @font-sans;
  }

  body {
    /* 광고 */
    &.ks-hide-ad {
      #ad-layer,
      #zzbang_ad,
      .rightbanner,
      tr.ub-content.dory {
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
      header + article {
        display: none;
      }
    }
    &.ks-hide-history {
      .visit_history {
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
    transition: transform @animation-speed;
    transform: scale(0);
    z-index: 1000;
    visibility: hidden;
    overflow: hidden;
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    display: inline-block;
    max-width: 500px;
    max-height: 300px;
    border-radius: 5px;
    background: @color-primary;

    li {
      transition: background-color @animation-speed;
      cursor: pointer;

      a {
        display: inline-block;
        padding: .5em 1em;
        text-decoration: none;
        color: white;
      }

      &.ks-splitter {
        border-top: 1px solid darken(@color-primary, 50%);
        padding: 0;
        cursor: initial;
      }

      &:hover {
        background: rgba(0, 0, 0, .5);
      }
    }

    &.ks-active {
      visibility: visible;
      transform: scale(1);
      transform-origin: top left;
    }
  }

  #ks-config {
    transition: opacity @animation-speed;
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
      max-height: 80%;
      padding: 1em 0;
      border-radius: 5px;
      background: darken(@color-primary, 25%);
      box-shadow: 0 0 100% black;
      color: white;
      cursor: initial;
    }

    summary {
      display: block;
      padding: .5em;
      font-weight: bold;
      cursor: pointer;

      &::-webkit-details-marker {
        display: none;
      }
    }

    .ks-config-item {
      box-sizing: border-box;
      padding: .5em;
      padding-left: 1.5em;
      
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
        width: 50%;
        cursor: pointer;
      }

      > input, textarea {
        float: right;
        display: inline-block;
        margin: 0;
        width: 50%;
        border: 0;
        box-sizing: border-box;
        background: lighten(@color-primary, 5%);
        font-family: @font-monospace;
      }
      > textarea {
        resize: vertical;

        &::placeholder {
          color: darken(@color-primary, 5%);
        }
      }

      .ks-clearfix();
    }

    .ks-config-buttons {
      padding: 1em;
      padding-bottom: 0;

      button {
        display: inline-block;
        padding: .5em;
        background: darken(@color-primary, 35%);
        border-radius: 5px;
        color: white;
        cursor: pointer;
      }
    }
    
    &.ks-active {
      visibility: visible;
      opacity: 1;
    }
  }

  #ks-preview {
    transition: opacity @animation-speed;
    transform-origin: top left; 
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    display: inline-block;
    visibility: hidden;
    padding: 1em;
    max-width: 500px;
    max-height: 500px;
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
      opacity: .5;
    }
    &.ks-active:hover {
      opacity: 1;
    }
  }

  tr.ub-content {
    transition: background-color @animation-speed, opacity @animation-speed;

    &.ks-checked {
      background: lighten(@color-primary, 25%);
    }
    &.ks-deleted {
      background: @color-crit;
    }
    &.ks-loading {
      opacity: .5;
    }
  }

  @keyframes ks-update {
    from {
      background-color: fade(@color-primary, 15%);
    }
    to {
      background-color: 0;
    }
  }
`

const componentStyle: Component = {
  create () {
    const style = createElement('<style id="ks-style" type="text/less"></style>')
    style.innerHTML = format(template, Config.get('style'))
    document.head.append(style)

    if (Config.get('debug.less')) {
      less.options.env = 'development'
    }

    less.refresh()
  },
  destroy () {
    document.querySelector('#ks-style')?.remove()
  }
}

export default componentStyle
