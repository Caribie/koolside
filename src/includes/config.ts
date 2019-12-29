import Storage from './storage'

function generateDefaultValeus (details: LooseObject, map?: (key: string, value: Storable) => void) {
  const result = {} as LooseObject

  for (let key in details) {
    const detail = details[key]
    result[key] = detail.items ? generateDefaultValeus(detail.items, map) : detail.default
  }

  return result
}

export const details = {
  hide: {
    name: '숨길 요소',
    items: {
      logo: {
        name: '웹 사이트 로고',
        default: false
      },
      title: {
        name: '갤러리 제목',
        default: false
      },
      titlebar: {
        name: '갤러리 정보',
        default: false
      },
      right: {
        name: '우측 사이드 바',
        items: {
          all: {
            name: '전체',
            default: false
          },
          login: {
            name: '사용자 정보',
            default: false
          },
          recommend: {
            name: '개념글',
            default: false
          },
          issuezoom: {
            name: '이슈 줌',
            default: false
          },
          news: {
            name: '뉴스',
            default: false
          },
          realtime: {
            name: '실시간 검색어',
            default: false
          },
          hit: {
            name: '힛',
            default: false
          },
          sec_recommend: {
            name: '초개념',
            default: false
          },
          wiki: {
            name: '디시위키',
            default: false
          }
        }
      }
    }
  },
  style: {
    name: '사용자 스타일',
    items: {
      font_family_sans: {
        name: '산세리프 글꼴',
        default: '"맑은 고딕", sans-serif'
      },
      font_family_serif: {
        name: '세리프 글꼴',
        default: 'serif'
      },
      font_family_monospace: {
        name: '고정폭 글꼴',
        default: '"D2Coding", NanumGothicCoding, monospace'
      },
      font_size_preview: {
        name: '프리뷰 글자 크기',
        default: '1.5em'
      }
    }
  },
  debug: {
    name: '디버깅',
    items: {
      less: {
        name :'Less',
        default: true
      }
    }
  }
}

const defaultValue = generateDefaultValeus(details)

const config = new Storage('config', {
  defaultValue,
  onSync () {
    const classes = []

    if (this.get('hide.logo')) classes.push('ks-hide-logo')
    if (this.get('hide.title')) classes.push('ks-hide-title')
    if (this.get('hide.titlebar')) classes.push('ks-hide-titlebar')

    if (this.get('hide.right.all')) {
      classes.push('ks-hide-right')
    } else {
      if (this.get('hide.right.login')) classes.push('ks-hide-right-login')
      if (this.get('hide.right.recommend')) classes.push('ks-hide-right-recommend')
      if (this.get('hide.right.issuezoom')) classes.push('ks-hide-right-issuezoom')
      if (this.get('hide.right.news')) classes.push('ks-hide-right-news')
      if (this.get('hide.right.realtime')) classes.push('ks-hide-right-realtime')
      if (this.get('hide.right.hit')) classes.push('ks-hide-right-hit')
      if (this.get('hide.right.sec_recommend')) classes.push('ks-hide-right-sec-recommend')
      if (this.get('hide.right.wiki')) classes.push('ks-hide-right-wiki')
    }

    document.body.setAttribute('class', classes.join(' '))
  }
})

export default config
