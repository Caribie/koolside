import config from "./config"

interface CacheSet {
  id: string;
  post: number;
  html: string;
}

class Cache extends Array<CacheSet> {
  constructor () {
    super()
    
    // 확장 기능에 저장된 캐시 불러오기
    this.push(...GM_getValue<CacheSet[]>('cache', []))
  }

  /**
   * 확장 기능의 저장 공간에 캐시를 저장합니다
   */
  sync () {
    GM_setValue('cache', this)
  }

  /**
   * 캐시된 게시글의 인덱스 번호를 가져옵니다
   * @param id 갤러리 아이디
   * @param post 게시글 번호
   */
  indexOfElement (id: string, post: number) {
    for (let i = 0; i < this.length; i++) {
      const item = this[i]
      if (item.id === id && item.post === post) {
        return i
      }
    }

    return false
  }

  /**
   * 게시글이 캐시됐는지 확인합니다
   * @param id 갤러리 아이디
   * @param post 게시글 번호
   */
  has (id: string, post: number) {
    return typeof this.indexOfElement(id, post) === 'number'
  }

  /**
   * 캐시된 게시글을 HTMLElement 객체로 가져옵니다
   * @param id 갤러리 아이디
   * @param post 게시글 번호
   */
  get (id: string, post: number) {
    const idx = this.indexOfElement(id, post)

    if (idx) {
      return this[idx].html
    }

    return false
  }

  /**
   * HTMLElement 객체를 캐시한 뒤 인덱스 번호를 반환합니다
   * @param id 갤러리 아이디
   * @param post 게시글 번호
   * @param element HTMLElement 객체
   */
  set (id: string, post: number, element: HTMLElement) {
    const html = element.outerHTML
    let idx = this.indexOfElement(id, post)

    if (idx) {
      this[idx].html = html
      return idx
    } else {
      idx = this.push({ id, post, html })
    
      // 캐시가 최대 수에 도달하면 마지막 아이템 한개씩 제거하기
      if (this.length > config.get<number>('live.limit_cache')) {
        this.shift()
      }
    }

    this.sync()
    return idx
  }
}

const cache = new Cache()

export default cache
