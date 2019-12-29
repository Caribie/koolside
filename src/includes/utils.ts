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

export const BODY_PATTERN = /(?<body><body[^>]*>((.|[\n\r])*)<\/body>)/im
