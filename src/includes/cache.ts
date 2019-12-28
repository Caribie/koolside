import { createElement } from './utils'
import { REGEX_BODY } from './static'
import request from './request'

class Cache extends Map<number, Element> {
  async fetchPost (gallery: string, no: number) {
    const url = `https://m.dcinside.com/board/${gallery}/${no}`
    const res = await request({
      url,
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36'
      }
    })
  
    // body 태그 속만 불러오기
    const matches = res.responseText.match(REGEX_BODY)
    const $ = createElement(matches.groups.body).parentNode
  
    // 필요없는 태그 제거하기
    const content = $.querySelector('.thum-txtin')
    const query = '*:not(img):not(iframe):not(br):empty'
  
    for (let e of content.querySelectorAll(query)) {
      e.remove()
    }
  
    // 모든 이미지 원본 주소로 변환하기
    for (let img of content.querySelectorAll('img')) {
      const src = img.dataset.original || img.src
  
      while (img.attributes.length) {
        img.removeAttribute(img.attributes[0].name)
      }
  
      img.src = src
    }
 
    // 캐싱하기
    this.set(no, content)
  
    return content
  }

  fetchPosts (gallery: string, posts: number[]) {
    return posts.map(no => this.fetchPost(gallery, no))
  }
}

const cache = new Cache()

export default cache
