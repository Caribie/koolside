import { tryAndWaitForTheElement } from 'wait-for-the-element'

import componentConfig from './components/config'
import componentContext from './components/context'
import componentPreview from './components/preview'
import componentStyle from './components/style'
import config from './includes/config'
import { fetchList } from './includes/request'
import timer from './includes/timer'
import { getParameter } from './includes/utils'

async function main () {
  const gallery = getParameter('id')

  // 설정 맞추기
  config.sync()

  // 앱에서 사용할 요소와 스타일 시트 추가하기
  componentStyle.create()
  componentConfig.create()
  componentContext.create()
  componentPreview.create()

  if (document.querySelector('.gall_list')) {
    // 현재 페이지의 게시글 목록 초기화하기
    await fetchList(gallery, document.body.outerHTML)
  
    // 실시간 새로고침 시작하기
    timer()
  }
}

// 최상단 페이지에서만 스크립트 실행하기
if (window.top === window.self) {
  window.onload = main
}
