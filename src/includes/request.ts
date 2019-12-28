import cache from './cache'
import { createElement } from './utils'
import { REGEX_BODY } from './static'

export default function request (opts: GM_RequestInfo) {
  return new Promise<GM_Response>((resolve, reject) => {

    opts.method = opts.method || 'GET'

    const clonedOpts: GM_RequestInfo = {
      ...opts,
      onload: res => {
        if (opts.onload) {
          opts.onload(res)
        }

        if (res.readyState !== 4) {
          return
        }

        resolve(res)
      },
      onerror: res => {
        if (opts.onerror) {
          opts.onerror(res)
        }

        const e = new Error('placeholder request error')
        reject(e)
      }
    }

    GM_xmlhttpRequest(clonedOpts)
  })
}

export async function fetchList (gallery: string) {
  const res = await request({
    url: location.href
  })

  // body 태그 속만 불러오기
  const matches = res.responseText.match(REGEX_BODY)
  const $ = createElement(matches.groups.body).parentNode

  // 필요없는 글은 삭제하기
  const addedPosts = $.querySelectorAll('.us-post') as NodeListOf<HTMLElement>

  const tbody = document.querySelector('.gall_list tbody')
  const numbers = []

  for (let post of addedPosts) {
    switch (true) {
      case post.dataset.type === 'icon_notice':
        continue
    }

    const no = parseInt(post.dataset.no, 10)

    // 기존 글 댓글 수, 조회 수 등 업데이트
    const cached = document.querySelector(`.us-post[data-no="${post.dataset.no}"]`) 
    if (cached) {
      cached.innerHTML = post.innerHTML
    }

    // 캐시되지 않은 글이라면 캐시하기 추가하기
    if (!cache.has(no)) {
      cache.fetchPost(gallery, no)
      post.classList.add('ks-new')
      tbody.prepend(post)
    }

    numbers.push(no)
  }

  const lowest = Math.min(...numbers)

  for (let post of document.querySelectorAll('.us-post') as NodeListOf<HTMLElement>) {
    const no = parseInt(post.dataset.no, 10)

    if (no < lowest) {
      break
    }

    if (!numbers.includes(no)) {
      post.classList.add('ks-deleted')
    }
  }
}
