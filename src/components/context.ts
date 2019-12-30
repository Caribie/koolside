import { createElement, deletePosts, hasAdminPermission } from "../includes/utils"

function onClick (e: MouseEvent) {
  const context = document.querySelector<HTMLElement>('#ks-contextmenu')

  if (e.button === 0) {
    context.classList.remove('ks-active')
  }
}

function onContextMenu (e: MouseEvent) {
  const target = e.target as HTMLElement
  const context = document.querySelector<HTMLElement>('#ks-contextmenu')

  // 설정 화면에선 무시하기
  if (target.closest('#ks-config')) {
    return
  }

  if (target.closest('#ks-contextmenu') === context) {
    // 컨텍스 메뉴 켜진 상태에서 한번 더 열었다면 네이티브 컨텍스 열기
    context.classList.remove('ks-active')
    return
  } else {
    context.classList.add('ks-active')

    // 더블 클릭하기 쉽게 위치 이동하기
    context.style.top = `${e.y - 5}px`
    context.style.left = `${e.x - 5}px`
  }

  context.innerHTML = ''

  const items = []

  // 관리 권한이 있을 때 추가될 메뉴
  if (hasAdminPermission()) {
    const post = target.closest<HTMLElement>('.us-post')

    if (post && !post.classList.contains('ks-deleted')) {
      items.push({
        name: '이 게시글 삭제',
        onClick () {
          if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            deletePosts([ post.dataset.no ])
          }
        }
      })
    }

    // 선택한 게시글 번호만 불러오기
    const selectedPosts = [] as string[]

    for (let post of document.querySelectorAll<HTMLElement>('.us-post')) {
      if (post.querySelector('[name="chk_article[]"]:checked')) {
        selectedPosts.push(post.dataset.no)
      }
    }

    if (selectedPosts.length > 0) {
      items.push({
        name: `선택한 게시글 삭제`,
        onClick () {
          if (confirm(`정말로 게시글 ${selectedPosts.length}개를 삭제하시겠습니까?`)) {
            deletePosts(selectedPosts)
          }
        }
      })
    }
  }

  // 가장 마지막에 설정 메뉴 추가하기
  items.push({
    name: '유저스크립트 설정',
    onClick () {
      document.querySelector('#ks-config').classList.add('ks-active')
    }
  })

  for (let item of items) {
    const li = createElement(`<li>${item.name}</li>`)
    li.addEventListener('click', item.onClick)
    context.appendChild(li)
  }

  e.preventDefault()
}

const componentContext: Component = {
  create () {
    document.body.prepend(createElement('<ul id="ks-contextmenu"></ul>'))
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('click', onClick)
  },
  destroy () {
    document.querySelector('#ks-context')?.remove()
    document.removeEventListener('contextmenu', onContextMenu)
    document.removeEventListener('click', onClick)
  }
}

export default componentContext
