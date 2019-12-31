import { createElement, deletePosts, hasAdminPermission } from '../includes/utils'

function onClick (e: MouseEvent) {
  const context = document.querySelector<HTMLElement>('#ks-contextmenu')

  if (e.button === 0) {
    context.classList.remove('ks-active')
  }
}

function onSelectionChange (e: MouseEvent) {
  const selection = window.getSelection()

  // 관리 권한이 있다면 드래그로 게시글 선택하기
  if (hasAdminPermission()) {
    const items = document.querySelectorAll('tr.ub-content td')

    for (let item of items) {
      const checkbox = item.closest('tr')?.querySelector('input')
      const selected = selection.containsNode(item)
  
      if (checkbox) checkbox.checked = selected
    }
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

    // 선택한 객체에 z-index 가 있다면 그보다 한 개 높게 설정하기
    if (target.style.zIndex) {
      context.style.zIndex = target.style.zIndex + 1
    }
  }

  context.innerHTML = ''

  const items = []
  const post = target.closest<HTMLElement>('tr.ub-content')

  // 관리 권한이 있을 때 추가될 메뉴
  if (hasAdminPermission()) {
    if (post && !post.classList.contains('ks-deleted')) {
      items.push({
        name: '이 게시글 삭제',
        onClick () {
          if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            deletePosts([ post.querySelector('.gall_num').textContent ])
          }
        }
      })
    }

    // 선택한 게시글 번호만 불러오기
    const selectedPosts = [] as string[]

    for (let post of document.querySelectorAll<HTMLElement>('tr.ub-content')) {
      if (post.querySelector('[name="chk_article[]"]:checked')) {
        selectedPosts.push(post.querySelector('.gall_num').textContent)
      }
    }

    if (selectedPosts.length > 0) {
      items.push({
        name: '선택한 게시글 삭제',
        onClick () {
          if (confirm(`정말로 게시글 ${selectedPosts.length}개를 삭제하시겠습니까?`)) {
            deletePosts(selectedPosts)
          }
        }
      })
    }

    items.push({})
  }

  // 선택한 텍스트가 존재한다면
  const selected = window.getSelection().toString()
  if (selected) {
    items.push({
      name: '복사',
      onClick () {
        navigator.clipboard.writeText(selected)
      }
    })
  }

  // 붙여 넣을 수 있는 객체 위에서 열었다면
  if (target.matches('input, textarea')) {
    items.push({
      name: '붙여넣기',
      onClick () {
        navigator.clipboard.readText().then(text => {
          (target as HTMLInputElement | HTMLTextAreaElement).value = text
        })
      }
    })
  }

  // 가장 마지막에 설정 메뉴 추가하기
  items.push({
    name: '유저스크립트 설정',
    onClick () {
      document.querySelector('#ks-config').classList.add('ks-active')
    }
  })

  for (let item of items) {
    const e = document.createElement('li')

    if (item.name) {
      e.innerText = item.name
      e.addEventListener('click', item.onClick)
      context.append(e)
    } else {
      e.classList.add('ks-splitter')
    }

    context.append(e)
  }

  e.preventDefault()
}

const componentContext: Component = {
  create () {
    document.body.prepend(createElement('<ul id="ks-contextmenu"></ul>'))
    document.addEventListener('click', onClick)
    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('contextmenu', onContextMenu)
  },
  destroy () {
    document.querySelector('#ks-context')?.remove()
    document.removeEventListener('click', onClick)
    document.removeEventListener('selectionchange', onSelectionChange)
    document.removeEventListener('contextmenu', onContextMenu)
  }
}

export default componentContext
