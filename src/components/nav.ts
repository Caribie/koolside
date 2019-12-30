import { stringify } from 'query-string'

import { createElement, getCookie, getParameter,hasAdminPermission } from "../includes/utils"

const items = [
  {
    key: 'setting',
    name: '설정',
    onClick () {
      document.querySelector('#ks-config').classList.toggle('ks-active')
    }
  }
]

const adminItems = [
  {
    key: 'admin-delete',
    name: '선택한 글 삭제',
    onClick () {
      const selectedPosts = []

      for (let post of document.querySelectorAll<HTMLElement>('.us-post')) {
        if (post.querySelector('[name="chk_article[]"]:checked')) {
          selectedPosts.push(post.dataset.no)
        }
      }

      const data = {
        id: getParameter('id'),
        ci_t: getCookie('ci_c'),
        nos: selectedPosts
      }

      fetch('/ajax/minor_manager_board_ajax/delete_list', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-requested-with': 'XMLHttpRequest'
        },
        body: stringify(data, { arrayFormat: 'bracket' })
      }).then(res => {
        return res.json()
      }).then(result => {
        console.log(result)
      }).catch(console.error)
    }
  }
]

function onScroll () {
  const wrapper = document.querySelector<HTMLElement>('.gnb_bar')
  const wrapperRect = wrapper.getBoundingClientRect()

  const nav = document.querySelector('#ks-nav')
  const navRect = nav.getBoundingClientRect()

  if (wrapperRect.top > 0) {
    nav.classList.remove('ks-nav-fixed')
    wrapper.style.height = ''
  } else {
    nav.classList.add('ks-nav-fixed')
    wrapper.style.height = `${navRect.height}px`
  }
}

const componentNav: Component = {
  create () {
    const menu = [ ...items ]

    // 관리 권한이 있다면 관리자 메뉴 추가하기
    if (hasAdminPermission()) {
      menu.push(...adminItems)
    }

    const nav = createElement(/* html */`
      <div id="ks-nav">
        <ul>
          ${ menu.map(i => `<li class="ks-nav-item" data-key="${i.key}">${i.name}</li>`).join('') }
        </ul>
      </div>
    `)

    const replacement = document.querySelector('.gnb_bar')

    replacement.innerHTML = ''
    replacement.append(nav)

    // 메뉴 클릭 이벤트 추가하기
    for (let item of menu) {
      const element = document.querySelector(`.ks-nav-item[data-key="${item.key}"]`)
      element.addEventListener('click', item.onClick)
    }

    // 스크롤해서 넘어가면 fixed 되는 이벤트 붙이기
    document.addEventListener('scroll', onScroll)
  },
  destroy () {
    document.querySelector('#ks-nav')?.remove()
    document.removeEventListener('scroll', onScroll)
  }
}

export default componentNav
