import FileSaver from 'file-saver'

import cache from '../includes/cache'
import Config, { configuration } from '../includes/config'
import { createElement } from '../includes/utils'

function generate (items?: LooseObject<ConfigRecursive|ConfigItem>, prop?: string) {
  const result = [] as string[]
  
  items = items ?? configuration
  prop = prop ?? ''

  for (let [key, item] of Object.entries(items)) {
    key = `${prop}${key}`

    if ('items' in item) {
      // 카테고리라면 헤더와 하위 아이템 추가하기
      result.push(/* html */`
        <details style="padding-left:1em">
          <summary title=${item.description ?? item.name}>${item.name}</summary>
          ${generate(item.items, `${key}.`).join('')}
        </details>
      `)
    } else {
      // 아이템 추가하기
      const value = Config.getRaw(key)
      let html = ''

      // 자료형에 따라 태그 설정하기
      if (typeof value === 'string') {
        const textarea = (item as ConfigString).textarea
        const placeholder = (item as ConfigString).placeholder

        if (textarea) {
          html = /* html */`
            <label>${item.name}</label>
            <textarea 
              placeholder="${placeholder}"
              data-key="${key}">${value.replace(/"/g, '&quot;')}</textarea>
          `
        } else {
          html = /* html */`
            <label>${item.name}</label>
            <input 
              type="text"
              value="${value.replace(/"/g, '&quot;')}"
              placeholder="${placeholder}"
              data-key="${key}">
          `
        }
      } else if (typeof value === 'number') {
        const step = (item as ConfigNumber).step
        const min = (item as ConfigNumber).min
        const max = (item as ConfigNumber).max

        if (step) {
          html = /* html */`
            <label>${item.name}</label>
            <input type="range" value="${value}" min="${min}" max="${max}" step="${step}" data-tooltip="${value}" data-key="${key}">
          `
        } else {
          html = /* html */`
            <label>${item.name}</label>
            <input type="number" value="${value}" min="${min}" max="${max}" step="${step}">
          `
        }
      } else if (typeof value === 'boolean') {
        html = /* html */`
          <label>
            <input type="checkbox" data-key="${key}" ${!value || 'checked'}>
            <span>${item.name}</span>
          </label>
        `
      } else {
        console.error(`'${key}' 설정을 처리할 수 없습니다`)
      }

      result.push(`<div class="ks-config-item ks-config-key" data-tooltip="${item.description ?? item.name}">${html}</div>`)
    }
  }

  return result
}

function update (this: HTMLInputElement) {
  const key = this.dataset.key
  const type = typeof Config.getDefaultValue(key)

  let value

  switch (type) {
    case 'boolean':
      value = this.checked
      break
    case 'number':
      value = parseInt(this.value, 10)

      if (this.getAttribute('type') === 'range') {
        this.dataset.tooltip = this.value
      }

      break
    default:
      value = this.value
  }

  Config.set(key, value)
}

const componentConfig: Component = {
  create () {
    document.body.prepend(createElement(/* html */`
      <div id="ks-config">
        <div>
          <div class="ks-config-items">${generate().join('')}</div>
          <div class="ks-config-buttons">
            <button id="ks-btn-reset">설정 초기화</button>
            <button id="ks-btn-resetcache">캐시 초기화</button>
            <button id="ks-btn-export">설정 내보내기</button>
            <button id="ks-btn-import">설정 가져오기</button>
          </div>
        </div>
      </div>
    `))

    const wrapper = document.querySelector('#ks-config')

    // 설정 화면 닫기 이벤트
    wrapper.addEventListener('click', e => {
      const target = e.target as HTMLElement
      if (target.id === 'ks-config') {
        target.classList?.toggle('ks-active')
      }
    })

    // 설정 값 변경 이벤트
    for (let input of wrapper.querySelectorAll('input, textarea') as NodeListOf<HTMLInputElement>) {
      input.addEventListener('change', update)

      if (input.getAttribute('type') === 'range') {
        input.addEventListener('input', update)
      }
    }

    wrapper.querySelector('#ks-btn-reset').addEventListener('click', () => {
      if (confirm('정말로 설정을 처음으로 되돌리시겠습니까?')) {
        Config.load({})
      }
    })

    wrapper.querySelector('#ks-btn-resetcache').addEventListener('click', () => {
      if (confirm(`정말로 캐시된 게시글 ${cache.length}개를 삭제하시겠습니까?`)) {
        cache.reset()
      }
    })

    wrapper.querySelector('#ks-btn-export').addEventListener('click', () => {
      const filename = `koolside-${+new Date()}.json`
      const file = new File([JSON.stringify(Config.export())], filename, {
        type: 'application/json;charset=utf-8'
      })

      FileSaver.saveAs(file)
    })

    wrapper.querySelector('#ks-btn-import').addEventListener('click', () => {
      const data = prompt('가져올 설정 JSON 데이터를 입력해주세요')

      // 사용자가 취소했다면 끝내기
      if (!data) {
        return
      }

      try {
        Config.import(JSON.parse(data))
      } catch (e) {
        console.error(e)
        alert('JSON 데이터가 잘못됐습니다')
        return
      }
    })
  },
  destroy () {
    document.querySelector('#ks-preview')?.remove()
  }
}

export default componentConfig
