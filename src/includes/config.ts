import dotProp from 'dot-prop'

import Storage from './storage'
import timer from './timer'

export const set: ConfigSet = {}

// 실시간 새로고침 관련 설정
set.live = {
  name: '자동 새로고침',
  set: {
    interval: {
      name: '새로고침 간격 (초)',
      default: 1,
      onChange() {
        timer()
      }
    },
    thread: {
      name: '스레드',
      default: 3,
      min: 1,
      max: 10
    },
    retries: {
      name: '재시도 횟수',
      default: 3,
      min: 1,
      max: 10
    },
    limit_cache: {
      name: '최대 캐시 수',
      default: 1000,
      min: 1000,
      max: 100000
    },
    limit_items: {
      name: '최대 게시글 수',
      default: 50,
      min: 1,
      max: 1000
    }
  }
}

// 요소 숨기기 설정
set.hide = {
  name: '숨길 요소',
  set: {
    ad: {
      name: '광고',
      default: true
    },
    logo: {
      name: '웹 사이트 로고',
      default: false
    },
    gallery: {
      name: '갤러리',
      set: {
        title: {
          name: '제목',
          default: false
        },
        titlebar: {
          name: '정보',
          default: false
        },
        history: {
          name: '최근 방문 갤러리',
          default: false
        },
        notice: {
          name: '공지 게시글',
          default: true,
          onChange (old) {
            const notices = document.querySelectorAll('.icon_notice')

            for (let notice of notices) {
              const post = notice.closest('tr')

              if (old) {
                post.classList.remove('.ks-none')
              } else {
                post.classList.add('ks-none')
              }
            }
          }
        }
      }
    },
    right: {
      name: '우측 사이드 바',
      set: {
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
}

// 스타일시트 관련 설정
set.style = {
  name: '사용자 스타일',
  set: {
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
}

// 디버그 관련 설정
set.debug = {
  name: '디버깅',
  set: {
    less: {
      name :'Less',
      default: true
    }
  }
}

/**
 * 설정 옵션 값을 가져옵니다 (name, default 등)
 * @param key 설정 키
 * @param option 설정 옵션
 */
export function configOption<T> (key: string, option: string) {
  key = `${key.replace(/\./g, '.set.')}.${option}`
  return dotProp.get<T>(set, key)
}

/**
 * 
 * @param set 설정 데이터
 */
function defaultValue (set: ConfigSet) {
  const result = {} as LooseObject

  for (let k in set) {
    const config = set[k]
    result[k] = 'set' in config ? defaultValue(config.set) : config.default
  }

  return result
}

const config = new Storage('config', {
  defaultValue: defaultValue(set),
  onSync () {
    const classes = []

    if (this.get('hide.ad')) classes.push('ks-hide-ad')
    if (this.get('hide.logo')) classes.push('ks-hide-logo')

    if (location.href.startsWith('https://gall.dcinside.com/')) {
      if (this.get('hide.gallery.title')) classes.push('ks-hide-title')
      if (this.get('hide.gallery.titlebar')) classes.push('ks-hide-titlebar')
      if (this.get('hide.gallery.notice')) classes.push('ks-hide-notice')

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
    }

    document.body.setAttribute('class', classes.join(' '))
  }
})

export default config
