import cache from '../includes/cache'
import Config from '../includes/config'
import { createElement, getParameter } from '../includes/utils'

function onMouseEvent (e: MouseEvent) {
  const target = e.target as HTMLElement

  const gallery = getParameter('id')
  const body = document.body

  const preview = document.querySelector<HTMLElement>('#ks-preview')
  const previewPost = preview.querySelector('.ks-preview-post')
  const previewComment = preview.querySelector('.ks-preview-comment')
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

  if (target.closest('#ks-preview')) {
    // 커서가 미리보기 안에 있음
    body.classList.add('ks-prevent-scrolling')
    return
  } else {
    // 커서가 미리보기 밖에 있음
    body.classList.remove('ks-prevent-scrolling')
  }

  const post = target.closest<HTMLElement>('tr.ub-content')

  if (post) {
    const current = parseInt(preview.dataset.no, 10)
    const number = parseInt(post.dataset.no, 10)

    // 현재 미리보기로 선택한 게시글이 아니고 캐시가 있다면 업데이트하기
    if (current !== number && cache.has(gallery, number)) {
      preview.dataset.no = `${number}`
      preview.classList.add('ks-active')

      previewPost.innerHTML = cache.get(gallery, number) as string

      for (let img of preview.querySelectorAll('img')) {
        img.addEventListener('click', function () {
          this.classList.toggle('ks-active')
        })
      }

      // 미리보기 표시될 위치 구하기
      const scrollTop = document.documentElement.scrollTop
      const previewRect = preview.getBoundingClientRect()
      const postRect = post.getBoundingClientRect()

      const yBase = scrollTop + (postRect.top + postRect.height / 2) - (previewRect.height / 2)
      
      const xOffset = Config.get<number>('preview.offset')
      const yOffset = 
        Math.min(0, yBase - scrollTop) + // Top
        Math.max(0, (yBase + previewRect.height) - (scrollTop + body.clientHeight)) // Bottom

      let left = e.pageX

      if (xOffset > 0) {
        left += xOffset
      } else {
        left += xOffset - previewRect.width
      }

      preview.style.top = `${yBase - yOffset}px`
      preview.style.left = `${left}px`
    }
  } else {
    // 프리뷰 박스 초기화
    previewPost.innerHTML = ''
    previewComment.innerHTML = ''
    preview.classList.remove('ks-active')
    delete preview.dataset.no
  }
}

const componentPreview: Component = {
  create () {
    // 게시판 없다면 무시하기
    if (!document.querySelector('.gall_list')) {
      return
    }

    document.body.prepend(createElement(`
      <div id="ks-preview">
        <div class="ks-preview-post"></div>
        <div class="ks-preview-comment">Hello</div>
      </div>
    `))
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
