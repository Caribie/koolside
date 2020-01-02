import dotProp from 'dot-prop'

import componentConfig from '../components/config'
import componentStyle from '../components/style'
import { createElement,formatFont } from './utils'

let notificationRules: RegExp[]

export const configuration = {} as LooseObject<ConfigRecursive>

// 게시판 관련 설정
configuration.live = {
  name: '실시간 게시판',
  items: {
    enabled: {
      name: '활성화',
      description: '실시간 게시판 기능을 활성화합니다',
      default: true
    },
    interval: {
      name: '새로고침 간격 (초)',
      description: '게시판을 새로 고칠 간격입니다, 간격이 짧으면 차단될 수 있습니다',
      default: 1,
      min: 0.5,
      max: 30
    },
    thread: {
      name: '미리보기 스레드',
      description: '미리보기 내용을 요청하는 스레드입니다, 높게 설정하면 메모리 사용량이 증가할 수 있습니다',
      default: 3,
      min: 1,
      max: 10
    },
    retries: {
      name: '미리보기 재시도 횟수',
      description: '미리보기 내용을 불러올 때 시도 횟수를 선택합니다, 높게 설정하면 메모리 사용량이 증가할 수 있습니다',
      default: 3,
      min: 1,
      max: 10
    },
    limit_cache: {
      name: '미리보기 캐시 수',
      description: '미리보기 내용 몇 개까지 캐시할 지 선택합니다, 높게 설정하면 메모리 사용량이 증가할 수 있습니다',
      default: 1000,
      min: 1000,
      max: 100000
    },
    limit_items: {
      name: '최대 게시글 수',
      description: '한 페이지에 게시글을 몇 개까지 보일지 선택합니다, 높게 설정하면 메모리 사용량이 증가할 수 있습니다',
      default: 50,
      min: 1,
      max: 1000
    },
    notification: {
      name: '푸시 알림 활성화',
      description: '제목, 내용이 규칙과 일치하면 브라우저 알림을 울립니다',
      default: true
    },
    notification_rules: {
      name: '푸시 알림 규칙',
      description: '정규표현식으로 한 줄에 한 규칙 씩 들어갑니다, 많이 추가하면 메모리 사용량이 증가할 수 있습니다',
      default: '',
      textarea: true,
      placeholder: '\\w망호',
      format: () => notificationRules,
      onUpdate (_, value: string) {
        notificationRules = []

        if (!value) {
          return
        }

        for (let rule of value.split(/\n/g)) {
          if (rule.trim()) {
            notificationRules.push(new RegExp(rule))
          } 
        }
      }
    }
  }
}

configuration.preview = {
  name: '미리보기',
  items: {
    enabled: {
      name: '활성화',
      description: '미리보기 기능을 활성화합니다',
      default: true
    },
    offset: {
      name: '마우스 이격 거리',
      default: 100,
      step: 1,
      min: 10,
      max: 500
    }
  }
}

// 우 클릭 메뉴 설정
configuration.context = {
  name: '메뉴',
  description: '오른쪽 클릭 했을 때 출력되는 메뉴 관련 설정',
  items: {
    disable_selectors: {
      name: '비활성화 요소',
      description: '특정 요소에서 메뉴를 비활성화합니다',
      default: 'iframe',
      placeholder: 'img[src]\na[href]\n...',
      textarea: true
    },
    image_search_google: {
      name: '이미지 Google 검색',
      default: true
    },
    image_search_yandex: {
      name: '이미지 Yandex 검색',
      default: true
    },
    image_search_iqdb: {
      name: '이미지 IQDB 검색',
      default: true
    },
    image_search_saucenao: {
      name: '이미지 SauceNao 검색',
      default: true
    }
  }
}

// 요소 숨기기 설정
configuration.hide = {
  name: '요소',
  description: '페이지에서 숨길 요소를 선택합니다',
  items: {
    ad: {
      name: '광고',
      default: true,
      class: 'ks-hide-ad'
    },
    logo: {
      name: '로고',
      default: false,
      class: 'ks-hide-logo'
    },
    gallery: {
      name: '갤러리',
      items: {
        title: {
          name: '제목',
          default: false,
          class: 'ks-hide-title'
        },
        titlebar: {
          name: '정보',
          default: false,
          class: 'ks-hide-titlebar'
        },
        history: {
          name: '최근 방문 갤러리',
          default: false,
          class: 'ks-hide-history'
        },
        notice: {
          name: '공지 게시글',
          default: true,
          class: 'ks-hide-notice'
        }
      }
    },
    right: {
      name: '우측 사이드 바',
      items: {
        all: {
          name: '전체',
          default: false,
          class: 'ks-hide-right'
        },
        login: {
          name: '사용자 정보',
          default: false,
          class: 'ks-hide-right-login'
        },
        recommend: {
          name: '개념글',
          default: false,
          class: 'ks-hide-right-recommend'
        },
        issuezoom: {
          name: '이슈 줌',
          default: false,
          class: 'ks-hide-right-issuezoom'
        },
        news: {
          name: '뉴스',
          default: false,
          class: 'ks-hide-right-news'
        },
        realtime: {
          name: '실시간 검색어',
          default: false,
          class: 'ks-hide-right-realtime'
        },
        hit: {
          name: '힛',
          default: false,
          class: 'ks-hide-right-hit'
        },
        sec_recommend: {
          name: '초개념',
          default: false,
          class: 'ks-hide-right-sec-recommend'
        },
        wiki: {
          name: '디시위키',
          default: false,
          class: 'ks-hide-right-wiki'
        }
      }
    }
  }
}

// 스타일시트 관련 설정
configuration.style = {
  name: '모양',
  items: {
    animation_speed: {
      name: '애니메이션 속도 (밀리 초)',
      description: '애니메이션 속도를 지정합니다, 값이 0 이라면 비활성화합니다',
      default: 250,
      step: 1,
      min: 0,
      max: 1000,
      format: v => v / 1000
    },
    font_family_sans: {
      name: '산세리프 글꼴',
      default: '나눔스퀘어\n나눔바른고딕\n나눔고딕\n맑은 고딕\nsans-serif',
      textarea: true,
      format: formatFont
    },
    font_family_serif: {
      name: '세리프 글꼴',
      default: '나눔명조\nserif',
      textarea: true,
      format: formatFont
    },
    font_family_monospace: {
      name: '고정폭 글꼴',
      default: 'D2Coding ligature\nD2Coding\n나눔고딕코딩\nmonospace',
      textarea: true,
      format: formatFont
    },
    font_size: {
      name: '글자 크기 (px)',
      description: '사이트 전반적인 글자의 크기입니다',
      default: 13,
      step: 1,
      min: 10,
      max: 20,
      format: size => `${size}px`
    },
    font_size_preview: {
      name: '미리보기 글자 크기 (px)',
      description: '미리보기 속 글자 크기입니다',
      default: 15,
      step: 1,
      min: 10,
      max: 30,
      format: size => `${size}px`
    },
    custom_rules: {
      name: '사용자 규칙',
      description: '사용자 스타일 규칙입니다, LESS 문법도 지원합니다',
      default: '',
      textarea: true,
      placeholder: 'body {\n  background: red;\n}',
      onUpdate (_, value) {
        document.querySelector('#ks-style-custom')?.remove()

        if (value.trim()) {
          const component = createElement(`<style id="ks-style-custom" type="text/less">${value}</style>`)
          document.head.append(component)
        }
      }
    }
  }
}

// 디버그 관련 설정
configuration.debug = {
  name: '디버깅',
  items: {
    less: {
      name :'Less',
      default: false
    }
  }
}

function mapping (callback?: (k: string, v: ConfigTypes) => void, items?: LooseObject<ConfigRecursive|ConfigItem>, prop?: string) {
  let props = {} as LooseObject<ConfigTypes>
  
  items = items ?? configuration
  prop = prop ?? ''

  for (let [key, item] of Object.entries(items)) {
    key = `${prop}${key}`

    if ('items' in item) {
      props = { ...props, ...mapping(callback, item.items, `${key}.`) }
    } else {
      props[key] = item as ConfigTypes
    }
  }

  return props
}

export default class Config {
  private static storage: LooseObject = {}
  private static data = mapping()

  /** 저장소에서 설정을 불러옵니다 */
  static load (storage?: LooseObject) {
    const entries = Object.entries(this.data)

    storage = storage ?? GM_getValue('config')

    for (let [key, item] of entries) {
      const value = dotProp.get<ConfigStorable>(storage, key, item.default)
      this.set(key, value)
    }

    for (let [key, item] of entries) {
      if (item.onUpdate) {
        item.onUpdate(null, this.getRaw(key))
      }
    }

    componentConfig.destroy()
    componentConfig.create()

    componentStyle.destroy()
    componentStyle.create()
  }

  /**
   * 설정의 옵션을 가져옵니다
   * @param key 키
   * @param opt 옵션명
   */
  static getOption<T> (key: string, opt: string) {
    return dotProp.get<T>(this.data[key], opt)
  }

  /**
   * 설정 기본 값을 가져옵니다
   * @param key 키
   */
  static getDefaultValue<T extends ConfigStorable> (key: string) {
    return this.data[key].default as T
  }

  /**
   * 포맷 함수를 실행하지 않는 설정 값을 가져옵니다
   * @param key 키
   * @param defaultValue 기본 값
   */
  static getRaw<T extends ConfigStorable> (key: string, defaultValue?: T) {
    const value = dotProp.get<T>(this.storage, key)

    // 함수 기본 값이 선언되지 않았을 때만 전역 기본 값 사용하기
    if (typeof defaultValue === 'undefined') {
      defaultValue = this.getDefaultValue<T>(key)
    }

    // 값이 설정되지 않았다면 기본 값 반환하기
    if ([undefined, null].includes(value)) {
      return defaultValue
    }

    // 기본 값과 자료형이 일치하지 않는다면 기본 값으로 설정하고 반환하기
    if (defaultValue && typeof value !== typeof defaultValue) {
      console.warn(`Storage ${key} mismatched, set to default (${value} !== ${defaultValue})`)
      this.set(key, defaultValue)
      return defaultValue
    }

    return value
  }

  /**
   * 설정 값을 가져옵니다
   * @param key 키
   * @param defaultValue 기본 값
   */
  static get<T extends ConfigStorable> (key: string, defaultValue?: T) {
    const format = this.getOption<Function>(key, 'format')
    const value = this.getRaw<T>(key, defaultValue)
    return format ? format(value) as T : value
  }

  /**
   * 설정을 정의합니다
   * @param key 키
   * @param value 값
   */
  static set (key: string, value: ConfigStorable) {
    const old = this.getRaw(key)

    const onUpdate = this.getOption<Function>(key, 'onUpdate')
    const className = this.getOption<string>(key, 'class')

    if (onUpdate) {
      onUpdate(old, value)
    }

    if (className) {
      if (value) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
      }
    }

    // 값이 그대로라면 실행하지 않기
    if (old === value) {
      return
    }

    dotProp.set(this.storage, key, value)
    GM_setValue('config', this.storage)

    if (key.startsWith('style.')) {
      componentStyle.destroy()
      componentStyle.create()
    }
  }

  /**
   * 런타임으로 돌아가는 설정을 반환합니다
   */
  static export () {
    return this.storage
  }

  /**
   * 설정을 불러옵니다
   * @param storage 새 설정 값
   */
  static import (storage: LooseObject) {
    GM_setValue('config', storage)
    this.storage = storage
    this.load(storage)
  }
}
