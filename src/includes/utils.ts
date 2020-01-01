import { parse, stringify } from 'query-string'

export function createElement<T = HTMLElement> (html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild as unknown as T
}

export function getParameter (key: string) {
  const params = parse(location.search)
  return params[key] as string
}

export function getCookie (key: string) {
  const value = `;${document.cookie}`
  const parts = value.split(`;${key}=`)
  
  return parts.length === 2 ? parts.pop().split(';').shift() : false
}

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

export function getElementStyle (element: HTMLElement, prop: string) {
  const elements = [element, ...getElementParents(element)]
  let value

  while ((!value || ['auto'].includes(value)) && elements.length) {
    value = document.defaultView.getComputedStyle(elements.shift(), null).getPropertyValue(prop)
  }

  return value
}

export function hasAdminPermission () {
  return !!document.querySelector('.btn_useradmin_go')
}

export function formatFont (fonts: string) {
  return fonts.split('\n').map(font => `"${font}"`).join(', ')
}

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

export function range (value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function delay (time: number) {
  return new Promise<void>(resolve => setTimeout(resolve, time))
}
