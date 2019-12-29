import pLimit from 'p-limit'
import { tryAndWaitForTheElement } from 'wait-for-the-element'

import componentConfig from './components/config'
import componentNav from './components/nav'
import componentPreview from './components/preview'
import componentStyle from './components/style'
import cache from './includes/cache'
import config from './includes/config'
import { fetchList } from './includes/request'
import { getParameter } from './includes/utils'

const gallery = getParameter('id')

async function main () {
  // 설정 맞추기
  config.sync()

  // 앱에서 사용할 요소와 스타일 시트 추가하기
  componentStyle.create()
  componentConfig.create()
  componentNav.create()
  componentPreview.create()

  const preview = document.querySelector('#ks-preview') as HTMLElement

  function onMouseEvent (e: MouseEvent) {
    let el = e.target as HTMLElement

    // 게시글 목록 요소인지 확인하기
    while (el !== null) {
      // 프리뷰 객체라면 프리뷰 박스 내에서 스크롤 해야하므로 무시하기
      if (el === preview) {
        document.body.classList.add('ks-prevent-scrolling')
        break
      } else {
        document.body.classList.remove('ks-prevent-scrolling')
      }

      if (el.classList && el.classList.contains('us-post')) {
        break
      }

      el = el.parentNode as HTMLElement
    }
  
    if (el) {
      const no = parseInt(el.dataset.no, 10)

      // 현재 프리뷰가 선택한 게시글이 아니라면 업데이트하기
      if (cache.has(no) && preview.dataset.no !== el.dataset.no) {
        const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
        const clientTop = document.body.clientTop || document.documentElement.clientTop || 0

        const rect = el.getBoundingClientRect()
        const top = rect.top + scrollTop - clientTop

        preview.style.top = `${top}px`
        preview.style.left = `${e.pageX + 25}px`
        preview.dataset.no = el.dataset.no
        preview.innerHTML = cache.get(no).innerHTML
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

  document.body.prepend(preview)

  document.addEventListener('mousemove', onMouseEvent)
  // document.addEventListener('mousewheel', onMouseEvent)
  // document.addEventListener('DOMMouseScroll', onMouseEvent) // for our firefox friends :)

  const promises = []
  const limit = pLimit(10)

  for (let el of document.querySelectorAll<HTMLElement>('.us-post')) {
    // 번호 없는 글은 무시하기
    if (!el.dataset.no) {
      console.log(el)
      continue
    }

    // 공지 게시글은 무시하기
    if (el.dataset.type === 'icon_notice') {
      continue
    }

    const no = parseInt(el.dataset.no, 10)

    try {
      const promise = limit(() => cache.fetchPost(gallery, no))
      promises.push(promise)
    } catch (e) {
      console.error(e)
    }
  }

  // 현재 불러온 게시글 전체 캐싱하기
  await Promise.all(promises)

  // 게시글 실시간 업데이트 시작하기
  setInterval(() => fetchList(gallery), 1000)
}

// 최상단 페이지에서만 스크립트 실행하기
if (window.top === window.self) {

  // 갤러리 테이블 요소 대기 후 main() 실행하기
  tryAndWaitForTheElement('.copyright')
    .catch(() => console.error('페이지에서 게시글 테이블 요소를 불러올 수 없습니다'))
    .then(() => main())
    .catch(console.error)
}
