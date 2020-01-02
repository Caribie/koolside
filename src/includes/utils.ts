import { parse, stringify } from 'query-string'

/**
 * HTML 코드로 요소를 생성해 반환합니다
 * @param html HTML
 */
export function createElement<T = HTMLElement> (html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild as unknown as T
}

/**
 * 주소에서 인자 값을 반환합니다
 * @param key 키
 */
export function getParameter (key: string) {
  const params = parse(location.search)
  return params[key] as string
}

/**
 * 브라우저 쿠기 값을 반환합니다
 * @param key 키
 */
export function getCookie (key: string) {
  const value = `;${document.cookie}`
  const parts = value.split(`;${key}=`)
  
  return parts.length === 2 ? parts.pop().split(';').shift() : false
}

/**
 * 특정 요소의 모든 부모 요소를 반환합니다
 * @param el 요소
 */
export function getElementParents (el: HTMLElement) {
  let parents = []
  
  while (el.parentNode) {
    const parent = el.parentNode as HTMLElement

    // 노드가 더 이상 요소가 아니라면 루프 끝내기
    if (parent.nodeType !== Node.ELEMENT_NODE) {
      break
    }

    parents.push(parent)
    el = parent
  }

  return parents
}

/**
 * 특정 요소의 스타일 값을 반환합니다
 * @param element 요소
 * @param prop 키
 */
export function getElementStyle (element: HTMLElement, prop: string) {
  const elements = [element, ...getElementParents(element)]
  let value

  while ((!value || ['auto'].includes(value)) && elements.length) {
    value = document.defaultView.getComputedStyle(elements.shift(), null).getPropertyValue(prop)
  }

  return value
}

/**
 * 갤러리 관리 권한이 있는지 확인해 반환합니다
 */
export function hasAdminPermission () {
  return !!document.querySelector('.btn_useradmin_go')
}

/**
 * 특정 값이 최소 또는 최대 값을 벗어나는지 확인하고 벗어나면 최소, 최대 값을 반환합니다
 * @param value 값
 * @param min 최소 값
 * @param max 최대 값
 */
export function range (value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * 정해진 시간만큼 대기합니다
 * @param time 시간
 */
export function wait (time: number) {
  return new Promise<void>(resolve => setTimeout(resolve, time))
}

/**
 * 비동기 작업을 순서대로 실행합니다
 * @param task 비동기 작업
 */
export async function promiseSeries (task: Promise<unknown>[]) {
  while (task.length) {
    await task.shift()
  }
}

/**
 * 특정 게시글 삭제 요청을 서버에 전송합니다
 * @param posts 게시글 번호
 */
export async function deletePosts (posts: number[] | string[]) {
  const data = {
    id: getParameter('id'),
    ci_t: getCookie('ci_c'),
    nos: posts
  }

  const res = await fetch('/ajax/minor_manager_board_ajax/delete_list', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-requested-with': 'XMLHttpRequest'
    },
    body: stringify(data, { arrayFormat: 'bracket' })
  })

  const result = await res.json()

  return result
}
