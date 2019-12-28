export const REGEX_BODY = /(?<body><body[^>]*>((.|[\n\r])*)<\/body>)/im

export const STYLESHEET = `
<style>
  /* 기능 */
  body.ks-hide-logo .dc_logo { opacity: 0 }

  body.ks-hide-title .left_content header { display: none }
  body.ks-hide-titlebar .left_content article:nth-child(2) { display: none }
  
  body.ks-hide-right .left_content {
    float: none;
    width: 100%;
  }

  body.ks-hide-right .issuebox { width: 100% }
  body.ks-hide-right .minor_intro_box { width: calc(100% - 155px) }
  body.ks-hide-right .visit_history { width: 100%; box-sizing: border-box }
  body.ks-hide-right .list_array_option { width: 100% }
  body.ks-hide-right .right_content { display: none }

  body.ks-hide-right .stickyunit { display: none }

  body.ks-hide-right-login .login_box { display: none }
  body.ks-hide-right-recommend .r_recommend { display: none }
  body.ks-hide-right-issuezoom .r_issuezoom { display: none }
  body.ks-hide-right-news .r_news { display: none }
  body.ks-hide-right-realtime .r_realtime_issue { display: none }
  body.ks-hide-right-hit .r_hit { display: none }
  body.ks-hide-right-sec-recommend .r_sec_recommend { display: none }
  body.ks-hide-right-wiki .r_wiki { display: none }

  /* 글꼴 */
  body, .gall_list,
  button, input, select, table,
  textarea { font-family: '맑은 고딕', sans-serif }

  /* 앱 */
  body.ks-prevent-scrolling {
    overflow: hidden;
    height: 100%;
  }

  .ks-preview {
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
    color: white;
  }
  .ks-preview.active {
    display: inline-block;
    opacity: .85;
  }

  .ks-preview img {
    max-width: 100%;
    max-height: 200px;
    cursor: pointer;
  }
  .ks-preview img.active {
    max-height: 100%;
  }

  .us-post.ks-new {
    animation-name: ks-new;
    animation-duration: .5s;
  }
  .us-post.ks-deleted {
    background: rgb(240, 100, 100)
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
</style>
`
