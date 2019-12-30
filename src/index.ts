import { tryAndWaitForTheElement } from 'wait-for-the-element'

import componentConfig from './components/config'
import componentContext from './components/context'
import componentPreview from './components/preview'
import componentStyle from './components/style'
import cache from './includes/cache'
import config from './includes/config'
import { fetchList } from './includes/request'
import timer from './includes/timer'
import { getParameter } from './includes/utils'

async function main () {
  const gallery = getParameter('id')

  // 설정 맞추기
  config.sync()

  // 앱에서 사용할 요소와 스타일 시트 추가하기
  componentConfig.create()
  componentContext.create()
  componentPreview.create()

  // 마우스 이벤트 추가하기
  const body = document.body
  const preview = document.querySelector<HTMLElement>('#ks-preview')

  function onMouseEvent (e: MouseEvent) {
    const target = e.target as HTMLElement

    // 컨텍스 메뉴 열린 상태라면 미리보기 끄기
    if (document.querySelector('#ks-contextmenu.ks-active')) {
      preview.classList.remove('ks-active')
      return
    }

    // 커서가 미리보기 객체 위에 있다면 미리보기 박스 내에서 스크롤 해야하므로 무시하기
    if (target.closest('#ks-preview')) {
      body.classList.add('ks-prevent-scrolling')
      return
    } else {
      body.classList.remove('ks-prevent-scrolling')
    }
    
    const post = target.closest<HTMLElement>('.us-post')

    if (post) {
      const current = parseInt(preview.dataset.no, 10)
      const number = parseInt(post.dataset.no, 10)

      // 현재 미리보기로 선택한 게시글이 아니고 캐시가 있다면 업데이트하기
      if (current !== number && cache.has(gallery, number)) {

        // 미리보기 표시될 위치 구하기
        const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
        const clientTop = document.body.clientTop || document.documentElement.clientTop || 0
        const rect = post.getBoundingClientRect()
        const top = rect.top + scrollTop - clientTop

        preview.style.top = `${top}px`
        preview.style.left = `${e.pageX + 25}px`
        preview.dataset.no = post.dataset.no
        preview.innerHTML = cache.get(gallery, number) as string
        preview.classList.add('ks-active')

        for (let img of preview.querySelectorAll('img')) {
          img.addEventListener('click', function () {
            this.classList.toggle('ks-active')
          })
        }
      }
    } else {
      // 프리뷰 박스 초기화
      preview.classList.remove('ks-active')
      preview.innerHTML = ''
      delete preview.dataset.no
    }
  }

  document.addEventListener('mousemove', onMouseEvent)
  document.addEventListener('contextmenu', onMouseEvent)

  await fetchList(gallery, document.body.outerHTML)
  
  // 실시간 새로고침 시작하기
  timer()
}

// 최상단 페이지에서만 스크립트 실행하기
if (window.top === window.self) {
  componentStyle.create()

  // 갤러리 테이블 요소 대기 후 main() 실행하기
  tryAndWaitForTheElement('.gall_list')
    .catch(() => console.error('페이지에서 게시글 테이블 요소를 불러올 수 없습니다'))
    .then(() => main())
    .catch(console.error)
}
