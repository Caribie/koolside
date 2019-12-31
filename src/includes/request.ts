import pLimit from 'p-limit'
import pRetry from 'p-retry'

import cache from './cache'
import config from './config'
import { createElement, hasAdminPermission } from './utils'

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
  // 미리보기 대기 중 클래스 추가하기
  document.querySelector(`tr[data-no="${post}"]`)?.classList.add('ks-loading')

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

  // 미리보기 대기 중 클래스 삭제하기
  document.querySelector('tr.ub-content.ks-loading')?.classList.remove('ks-loading')

  return content
}

/**
 * 여러 게시글을 불러와 캐시에 추가합니다
 * @param gallery 갤러리 아이디
 * @param posts 게시글 번호들
 */
export async function fetchPosts (gallery: string, posts: number[]) {
  const promises = []
  const limit = pLimit(config.get<number>('live.thread'))

  for (let post of posts) {
    const retries = config.get<number>('live.retries')
    const promise = fetchPost(gallery, post)
    promises.push(limit(() => pRetry(() => promise, { retries })))
  }

  // 현재 불러온 게시글 전체 캐싱하기
  await Promise.all(promises)
}

/**
 * 게시글 목록을 불러온 뒤 처리합니다
 * @param gallery 갤러리 아이디
 * @param html 이미 처리된 HTML 코드
 */
export async function fetchList (gallery: string, html?: string) {
  const requireProcess = !html

  if (requireProcess) {
    const res = await request(location.href)
    html = res.responseText
  }

  // body 태그 속만 불러오기
  const matches = html.match(bodyPattern)

  if (!matches) {
    throw new Error('게시글 목록을 파싱하는데 실패했습니다')
  }

  const $ = createElement(matches.groups.body).parentNode
  const posts = $.querySelectorAll('.ub-content') as NodeListOf<HTMLElement>
  const tbody = document.querySelector('.gall_list tbody')

  const numbers = []
  const addedNumbers = []

  for (let post of posts) {
    // 공지 글은 무시하기
    if (post.querySelector('.icon_notice')) {
      continue
    }

    const number = parseInt(post.querySelector('.gall_num').textContent, 10)
    const cached = cache.has(gallery, number)

    const old = tbody.querySelector(`[data-no="${number}"]`)

    // 새 글이고 관리 권한이 있다면 글 앞에 체크박스 넣기
    if (!old && hasAdminPermission()) {
      post.prepend(checkboxTemplate.cloneNode(true))
    }

    if (old) {

      // 수정된 부분만 변경하기
      for (let td of post.querySelectorAll('td')) {
        const selector = td.className.match(/(?<class>gall_\w+)/)?.groups.class
        const oldTd = post.querySelector(`.${selector}`)

        if (oldTd && oldTd.innerHTML !== td.innerHTML) {
          oldTd.innerHTML = td.innerHTML
        }
      }

    } else if (!cached) {
      post.classList.add('ks-new')
      tbody.prepend(post)
    }

    // 캐시되지 않은 글이라면 캐시하기 추가하기
    if (!cached) {
      addedNumbers.push(number)
    }

    numbers.push(number)
  }

  // 삭제된 글이라면 삭제 클래스 붙여주기
  let count = 0

  for (let post of tbody.querySelectorAll('tr') as NodeListOf<HTMLElement>) {
    const no = parseInt(post.querySelector('.gall_num').textContent, 10)

    // 방금 가져온 글 목록의 마지막 글 번호보다 적으면 확인할 수 없으므로 끝내기
    if (count++ >= posts.length) {
      break
    }

    if (!numbers.includes(no)) {
      post.classList.add('ks-deleted')
      post.querySelector('input')?.remove() // 체크박스 지우기
    }
  }

  // 최대 글 수를 넘어서면 마지막 글 부터 제거하기
  const limit = config.get<number>('live.limit_items')
  const postCount = tbody.querySelectorAll('tr:not([data-type="icon_notice"])').length

  for (let i = 1, len = postCount - limit; i <= len; i++) {
    tbody.lastElementChild.remove()
  }

  await fetchPosts(gallery, addedNumbers)
}
