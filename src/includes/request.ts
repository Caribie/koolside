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
        reject(new Error(`Request failed (${res.readyState}, ${res.status})`))
      }
    })
  })
}

/**
 * 게시글 내용을 파싱한 뒤 캐시에 추가합니다
 * @param gallery 갤러리 아이디
 * @param post 게시글 번호
 */
export async function fetchPost (gallery: string, post: number | string) {
  const element = document.querySelector(`tr[data-no="${post}"]`)

  // 미리보기 대기 중 클래스 추가하기
  element?.classList.add('ks-loading')

  const res = await request({
    url: `https://m.dcinside.com/board/${gallery}/${post}`,
    timeout: 5000,
    headers: {
      'user-agent': 'Mozilla/5.0 (Android 7.0; Mobile)'
    }
  })

  // 이미 삭제된 게시글이라면 오류 반환하기
  if (res.status === 403) {
    throw new pRetry.AbortError(`#${post} 403`)
  }

  if (res.status < 200 || res.status > 299) {
    throw new Error(`#${post} server returned ${res.status} code`)
  }

  // body 태그만 가져오기
  const matches = res.responseText.match(bodyPattern)
  if (!matches) {
    throw new Error(`#${post} Server returned invalid response`)
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
  element?.classList.remove('ks-loading')
  
  return content
}

/**
 * 여러 게시글을 불러와 캐시에 추가합니다
 * @param gallery 갤러리 아이디
 * @param posts 게시글 번호들
 */
export async function fetchPosts (gallery: string, posts: (number|string)[]) {
  const promises = []
  const limit = pLimit(config.get<number>('live.thread'))

  for (let post of posts) {
    const retries = config.get<number>('live.retries')
    const promise = () => fetchPost(gallery, post)
    const retry = pRetry(promise, {
      retries,
      onFailedAttempt: error => {
        console.error(`#${post} ${error.message} (${error.attemptNumber} tried / ${error.retriesLeft} left)`)
      }
    })

    promises.push(limit(() => retry))
  }

  // 현재 불러온 게시글 전체 캐싱하기
  await Promise.all(promises)
}

/**
 * 게시글 목록을 불러온 뒤 처리합니다
 * @param gallery 갤러리 아이디
 * @param html 이미 처리된 HTML 코드
 */
export async function fetchList (gallery: string) {
  const res = await request({
    url: location.href,
    timeout: 5000
  })

  // body 태그만 가져오기
  const matches = res.responseText.match(bodyPattern)
  if (!matches) {
    throw new Error('server returned invalid response')
  }

  const addedPosts = [] // 실제로 추가된 게시글 요소
  const fetchedPosts = [] // 응답 받은 게시글 요소

  const table = document.querySelector('.gall_list tbody')
  const $ = createElement(matches.groups.body).parentNode

  for (let fetchedPost of $.querySelectorAll('tr.ub-content') as NodeListOf<HTMLElement>) {
    if (fetchedPost.querySelector('.icon_notice')) {
      continue
    }

    // 보기 페이지에서 현재 글은 따로 표시되므로 제외하기
    if (fetchedPost.matches('.crt')) {
      continue
    }

    // 데이터 셋에 글 번호 붙이기
    const fetchedString = fetchedPost.querySelector('.gall_num').textContent
    const fetched = parseInt(fetchedString, 10)
    fetchedPost.dataset.no = fetchedString

    // 기존 게시글 요소 불러오기
    const post = table.querySelector(`[data-no="${fetched}"]`)

    if (post) {
      // 새 글 인식표 지우기
      post.classList.remove('ks-update')

      // 수정된 부분만 변경하기
      for (let fetchedTd of fetchedPost.querySelectorAll('td')) {
        const selector = fetchedTd.className.match(/(gall_\w+)/)[1]
        const td = post.getElementsByClassName(selector)[0]

        if (td?.innerHTML !== fetchedTd.innerHTML) {
          td.innerHTML = fetchedTd.innerHTML
        }
      }
    } else {
      // 관리 권한 있다면 체크박스 추가하기
      if (hasAdminPermission()) {
        fetchedPost.prepend(checkboxTemplate.cloneNode(true))
      }
    }
    
    if (!cache.has(gallery, fetched)) {
      // 아예 존재하지 않는다면 테이블에 추가하기
      fetchedPost.classList.add('ks-update')
      table.prepend(fetchedPost)
      addedPosts.push(fetched)
    }

    fetchedPosts.push(fetched)
  }

  // 최대 글 수를 넘어서면 마지막 글 부터 제거하기
  const limit = config.get<number>('live.limit_items')
  const overflowed = table.querySelectorAll('tr:not([data-notice])').length - limit

  for (let i = 0; i < overflowed; i++) {
    table.lastElementChild.remove()
  }

  // 삭제된 글이라면 삭제 클래스 붙여주기
  let looped = 0

  for (let post of table.querySelectorAll<HTMLElement>('tr:not([data-notice])')) {
    const no = parseInt(post.dataset.no, 10)

    // 가져온 글 수만큼 반복 돌렸다면 나가기
    if (fetchedPosts.length < ++looped) {
      break
    }

    // 방금 추가된 글이거나 이미 삭제된 게시글이면 무시하기
    if (post.matches('.ks-update, .ks-deleted')) {
      continue
    }

    if (!fetchedPosts.includes(no)) {
      post.classList.add('ks-deleted')
      post.querySelector('input')?.remove() // 체크박스 지우기
    }
  }

  // 테이블에 추가 필요한 요소는 내용 불러오기
  if (addedPosts.length > 0) {
    await fetchPosts(gallery, addedPosts)
  }
}
