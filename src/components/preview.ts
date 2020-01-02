import cache from '../includes/cache'
import Config from '../includes/config'
import { createElement, getParameter } from '../includes/utils'

function onMouseEvent (e: MouseEvent) {
  const target = e.target as HTMLElement

  const gallery = getParameter('id')
  const body = document.body

  const preview = document.querySelector<HTMLElement>('#ks-preview')
  const context = document.querySelector('#ks-contextmenu')

  if (!preview || !Config.get('preview.enabled')) {
    return
  }

  // 텍스트 선택 중일 때는 미리보기 업데이트 안하기
  const selecting = e.buttons & 1 && window.getSelection().toString()

  if (selecting || context.matches('.ks-active')) {
    // 미리보기 외부에서 선택했다면 미리보기 닫기
    if (![preview, context].includes(target) && !target.closest('#ks-preview, #ks-contextmenu')) {
      preview.classList.remove('ks-active')
    }
    return
  }

  // 커서가 미리보기 객체 위에 있다면 미리보기 박스 내에서 스크롤 해야하므로 무시하기
  if (target.closest('#ks-preview')) {
    body.classList.add('ks-prevent-scrolling')
    return
  } else {
    body.classList.remove('ks-prevent-scrolling')
  }

  const post = target.closest<HTMLElement>('tr.ub-content')

  if (post) {
    const current = parseInt(preview.dataset.no, 10)
    const number = parseInt(post.dataset.no, 10)

    // 현재 미리보기로 선택한 게시글이 아니고 캐시가 있다면 업데이트하기
    if (current !== number && cache.has(gallery, number)) {
      preview.dataset.no = `${number}`
      preview.innerHTML = cache.get(gallery, number) as string
      preview.classList.add('ks-active')

      for (let img of preview.querySelectorAll('img')) {
        img.addEventListener('click', function () {
          this.classList.toggle('ks-active')
        })
      }

      // 미리보기 표시될 위치 구하기
      const scrollTop = document.documentElement.scrollTop
      const previewRect = preview.getBoundingClientRect()
      const postRect = post.getBoundingClientRect()

      const top = scrollTop + (postRect.top + postRect.height / 2) - (previewRect.height / 2)
      
      const xOffset = Config.get<number>('preview.offset')
      const yOffset = 
        Math.min(0, top - scrollTop) + // Top
        Math.max(0, (top + previewRect.height) - (scrollTop + body.clientHeight)) // Bottom

      preview.style.top = `${top - yOffset}px`
      preview.style.left = `${e.pageX + xOffset}px`
    }
  } else {
    // 프리뷰 박스 초기화
    preview.classList.remove('ks-active')
    preview.innerHTML = ''
    delete preview.dataset.no
  }
}

const componentPreview: Component = {
  create () {
    // 게시판 없다면 무시하기
    if (!document.querySelector('.gall_list')) {
      return
    }

    document.body.prepend(createElement('<div id="ks-preview"></div>'))
    document.addEventListener('mousemove', onMouseEvent)
    document.addEventListener('contextmenu', onMouseEvent)
  },
  destroy () {
    document.querySelector('#ks-preview')?.remove()
    document.removeEventListener('mousemove', onMouseEvent)
    document.removeEventListener('contextmenu', onMouseEvent)
  }
}

export default componentPreview
