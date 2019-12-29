import qs from 'query-string'

export function createElement<T = HTMLElement> (html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild as unknown as T
}

export function getParameter (key: string) {
  const params = qs.parse(location.search)
  return params[key] as string
}

export function range (value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
