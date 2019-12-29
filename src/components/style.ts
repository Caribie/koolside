import format from 'string-format'

import config from '../includes/config'
import { createElement } from "../includes/utils"

const template =  /* less */`
  @font-sans: {font_family_sans};
  @font-serif: {font_family_serif};
  @font-monospace: {font_family_monospace};

  body,
  .gall_list,
  button, input, select, table, textarea {
    font-family: @font-sans;
  }

  /* 앱 */
  body {
    &.ks-hide-logo .dc_logo { opacity: 0 }

    &.ks-hide-title .left_content header {
      display: none
    }
    &.ks-hide-titlebar .left_content article:nth-child(2) {
      display: none 
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

  #ks-preview {
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    transition: opacity .25s;
    display: none;
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
      display: inline-block;
      opacity: .85;
    }
  }

  .us-post {
    &.ks-new {
      animation-name: ks-new;
      animation-duration: .5s;
    }

    &.ks-deleted {
      background: rgb(240, 100, 100)
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
  onCreate () {
    const style = createElement('<style id="ks-style" type="text/less"></style>')
    style.innerHTML = format(template, config.get('style'))
    document.head.append(style)

    if (config.get('debug.less')) {
      less.options.env = 'development'
    }

    less.refresh()
  },
  onDestroy () {
    document.querySelector('#ks-style')?.remove()
  }
}

export default componentStyle
