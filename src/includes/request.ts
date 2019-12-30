import pLimit from 'p-limit'

import cache from './cache'
import config from './config'
import { createElement } from './utils'

const bodyPattern = /(?<body><body[^>]*>((.|[\n\r])*)<\/body>)/im

const checkboxTemplate = createElement(/* html */`
  <td class="gall_chk">
    <span class="checkbox">
      <input type="checkbox" name="chk_article[]" class="list_chkbox article_chkbox">
      <em class="checkmark"></em>
    </span>
  </td>
`)

export default function request (opts: string | GM_RequestInfo) {
  const options = typeof opts === 'string' ? { url: opts } : opts

  options.method = options.method || 'GET'

  return new Promise<GM_Response>((resolve, reject) => {
    GM_xmlhttpRequest({
      ...options,
      onload: res => {
        if (res.readyState !== 4) {
          return
        }

        resolve(res)
      },
      onerror: res => {
        const error = new Error(`${res.status} ${res.statusText} (${res.readyState})`)
        reject(error)
      }
    })
  })
}

/**
 * 게시글 내용을 파싱한 뒤 캐시에 추가합니다
 * @param gallery 갤러리 아이디
 * @param post 게시글 번호
 */
export async function fetchPost (gallery: string, post: number) {
  const res = await request({
    url: `https://m.dcinside.com/board/${gallery}/${post}`,
    headers: {
      'user-agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36'
    }
  })

  if (res.status !== 200) {
    console.log(`${gallery} 갤러리의 ${post}번 게시글을 불러오려 했으나 이미 삭제됐습니다`)
    return
  }

  // body 태그 속만 불러오기
  const matches = res.responseText.match(bodyPattern)
  if (!matches) {
    throw new Error('게시글 파싱에 실패했습니다')
  }

  const $ = createElement(matches.groups.body).parentNode
  const content = $.querySelector<HTMLElement>('.thum-txtin')

  // 불필요한 태그 전부 제거하기
  const query = '*:not(img):not(iframe):not(br):empty'
  for (let e of content.querySelectorAll(query)) {
    e.remove()
  }

  // p > br 전부 br 하나로 변환하기
  for (let e of content.querySelectorAll('p')) {
    if (e.children.length === 1 && e.firstElementChild.tagName === 'BR') {
      e.remove()
    }
  }

  // 모든 이미지 원본 주소로 변환하기
  for (let img of content.querySelectorAll('img')) {
    const src = img.dataset.original || img.src

    while (img.attributes.length) {
      img.removeAttribute(img.attributes[0].name)
    }

    img.src = src
  }

  // 2개 이상 <br> 태그 한개로 변환하기
  content.innerHTML = content.innerHTML.replace(/(<br(\s+\/)?>\s{0,}){2,}/g, '<br>')

  // 캐싱하기
  cache.set(gallery, post, content)

  return content
}

/**
 * 여러 게시글을 불러와 캐시에 추가합니다
 * @param gallery 갤러리 아이디
 * @param posts 게시글 번호들
 */
export async function fetchPosts (gallery: string, posts: number[]) {
  const promises = []
  const limit = pLimit(10)

  for (let post of posts) {
    const promise = limit(() => fetchPost(gallery, post).catch(console.error))
    promises.push(promise)
  }

  // 현재 불러온 게시글 전체 캐싱하기
  await Promise.all(promises)
}

export async function fetchList (gallery: string, html?: string) {
  const custom = !html

  if (custom) {
    const res = await request(location.href)
    html = res.responseText
  }

  // body 태그 속만 불러오기
  const matches = html.match(bodyPattern)

  if (!matches) {
    throw new Error('게시글 목록을 파싱하는데 실패했습니다')
  }

  // 필요없는 글은 삭제하기
  const $ = createElement(matches.groups.body).parentNode

  const newPosts = $.querySelectorAll('.us-post') as NodeListOf<HTMLElement>
  const addedPosts = []

  const tbody = document.querySelector('.gall_list tbody')
  const hasCheckbox = document.querySelector('.chkbox_th') !== null

  for (let newPost of newPosts) {
    switch (true) {
      case newPost.dataset.type === 'icon_notice':
        continue
    }

    const post = parseInt(newPost.dataset.no, 10)

    // 관리용 체크박스가 필요하다면 붙이기
    if (hasCheckbox) {
      newPost.prepend(checkboxTemplate)
    }

    // 기존 글 댓글 수, 조회 수 등 업데이트
    const cachedPost = document.querySelector(`.us-post[data-no="${newPost.dataset.no}"]`) 
    if (cachedPost) {

      if (hasCheckbox) {
        const checked = cachedPost.querySelector<HTMLInputElement>('.gall_chk input').checked
        newPost.querySelector<HTMLInputElement>('.gall_chk input').checked = checked
      }

      cachedPost.innerHTML = newPost.innerHTML
    }

    // 캐시되지 않은 글이라면 캐시하기 추가하기
    if (!document.querySelector(`.us-post[data-no="${post}"]`) && !cache.has(gallery, post)) {

      // 직접 HTML 코드를 전달받지 않았다면 목록에 추가하기
      if (custom) {
        newPost.classList.add('ks-new')
        tbody.prepend(newPost)

        // 최대 글 수를 넘어서면 마지막 글 부터 제거하기
        const overflow = tbody.childElementCount - config.get<number>('live.limit_items')

        console.log(overflow)
        
        for (let i = 0; i < overflow; i++) {
          tbody.lastChild.remove()
        }
      }

      addedPosts.push(post)
    }
  }

  // 삭제된 글이라면 삭제 클래스 붙여주기
  const lowest = Math.min(...addedPosts)

  for (let post of document.querySelectorAll('.us-post') as NodeListOf<HTMLElement>) {
    const no = parseInt(post.dataset.no, 10)

    // 방금 가져온 글 목록의 마지막 글 번호보다 적으면 확인할 수 없으므로 끝내기
    if (no < lowest) {
      break
    }

    if (!addedPosts.includes(no)) {
      post.classList.add('ks-deleted')
    }
  }

  await fetchPosts(gallery, addedPosts)
}
