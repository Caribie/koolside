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

export function hasAdminPermission () {
  return !!document.querySelector('.btn_useradmin_go')
}

export function range (value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
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
