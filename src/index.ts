import { tryAndWaitForTheElement } from 'wait-for-the-element'

import componentConfig from './components/config'
import componentNav from './components/nav'
import componentPreview from './components/preview'
import componentStyle from './components/style'
import cache from './includes/cache'
import config from './includes/config'
import { fetchList } from './includes/request'
import { getParameter } from './includes/utils'

async function main () {
  const gallery = getParameter('id')

  // 앱에서 사용할 요소와 스타일 시트 추가하기
  componentStyle.create()
  componentConfig.create()
  componentNav.create()
  componentPreview.create()

  // 마우스 이벤트 추가하기
  const body = document.body
  const preview = document.querySelector<HTMLElement>('#ks-preview')

  document.addEventListener('mousemove', e => {
    let target = e.target as HTMLElement

    // 게시글 목록 요소인지 확인하기
    while (target !== null) {
      // 프리뷰 객체라면 프리뷰 박스 내에서 스크롤 해야하므로 무시하기
      if (target === preview) {
        body.classList.add('ks-prevent-scrolling')
        break
      } else {
        body.classList.remove('ks-prevent-scrolling')
      }

      if (target.classList && target.classList.contains('us-post')) {
        break
      }

      target = target.parentNode as HTMLElement
    }

    if (target) {
      const currentPost = parseInt(preview.dataset.no, 10)
      const post = parseInt(target.dataset.no, 10)

      // 현재 프리뷰가 선택한 게시글이 아니라면 업데이트하기
      if (currentPost !== post && cache.has(gallery, post)) {

        // 프리뷰 표시될 크기와 위치 구하기
        const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
        const clientTop = document.body.clientTop || document.documentElement.clientTop || 0
        const rect = target.getBoundingClientRect()
        const top = rect.top + scrollTop - clientTop

        preview.style.top = `${top}px`
        preview.style.left = `${e.pageX + 25}px`
        preview.dataset.no = target.dataset.no
        preview.innerHTML = cache.get(gallery, post) as string
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
  })

  await fetchList(gallery, document.body.outerHTML)

  // 설정 맞추기
  config.sync()
}

// 최상단 페이지에서만 스크립트 실행하기
if (window.top === window.self) {

  // 갤러리 테이블 요소 대기 후 main() 실행하기
  tryAndWaitForTheElement('.copyright')
    .catch(() => console.error('페이지에서 게시글 테이블 요소를 불러올 수 없습니다'))
    .then(() => main())
    .catch(console.error)
}
