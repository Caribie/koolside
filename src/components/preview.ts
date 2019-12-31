import cache from '../includes/cache'
import { createElement, getParameter } from '../includes/utils'

function onMouseEvent (e: MouseEvent) {
  const target = e.target as HTMLElement

  const gallery = getParameter('id')
  const body = document.body

  const preview = document.querySelector<HTMLElement>('#ks-preview')
  const context = document.querySelector('#ks-contextmenu')

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
    const number = parseInt(post.querySelector('.gall_num').textContent, 10)

    // 현재 미리보기로 선택한 게시글이 아니고 캐시가 있다면 업데이트하기
    if (current !== number && cache.has(gallery, number)) {

      // 미리보기 표시될 위치 구하기
      const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop
      const clientTop = document.body.clientTop || document.documentElement.clientTop || 0
      const rect = post.getBoundingClientRect()
      const top = rect.top + scrollTop - clientTop

      preview.style.top = `${top}px`
      preview.style.left = `${e.pageX + 25}px`
      preview.dataset.no = `${number}`
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

const componentPreview: Component = {
  create () {
    // 게시판 없다면 무시하기
    if (!document.querySelector('.gall_list')) {
      return
    }

    const preview = createElement('<div id="ks-preview"></div>')
    document.body.prepend(preview)
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
