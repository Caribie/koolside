import FileSaver from 'file-saver'

import cache from '../includes/cache'
import Config, { set } from '../includes/config'
import { createElement } from '../includes/utils'

function generateItems (set: ConfigSet, keys?: string) {
  const result = [] as string[]
  
  keys = keys || ''

  for (let k in set) {
    const item = set[k]

    if ('set' in item) {
      // 카테고리라면 헤더와 하위 아이템 추가하기
      const i = 2 + (keys.match(/\./g) || []).length // 헤더 번호 (<h1>, <h2>, <h3>...)

      result.push(/* html */`
        <details style="padding-left:${i/2}em">
          <summary>${item.name}</summary>
          ${generateItems(item.set, `${keys}${k}.`).join('\n')}
        </details>
      `)
    } else {
      // 아이템 추가하기
      const key = `${keys}${k}`
      const value = Config.getRaw(key)

      let html = ''

      // 자료형에 따라 태그 설정하기
      if (typeof value === 'string') {
        const placeholder = Config.getOption(key, 'placeholder') || '' 

        if (Config.getOption(key, 'textarea')) {
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
        const min = Config.getOption<number>(key, 'min') || ''
        const max = Config.getOption<number>(key, 'max') || ''
        const step = Config.getOption<number>(key, 'step') || ''

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
            <input
              type="checkbox" 
              data-key="${key}"
              ${value ? 'checked' : ''}>
            <span>${item.name}</span>
          </label>
        `
      } else {
        console.error(`'${key}' 설정을 처리할 수 없습니다`)
      }

      // 변경 시 실행될 값이 있다면 초기화를 위해 실행하기
      if (item.onChange) {
        item.onChange(null, Config.getRaw(key))
      }

      result.push(`<div class="ks-config-item ks-config-key" data-tooltip="${item.description || item.name}">${html}</div>`)
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
    const component = createElement(/* html */`
      <div id="ks-config">
        <div>
          ${generateItems(set).join('\n')}
          <div class="ks-config-buttons">
            <button id="ks-btn-reset">설정 초기화</button>
            <button id="ks-btn-resetcache">캐시 초기화</button>
            <button id="ks-btn-export">설정 내보내기</button>
            <button id="ks-btn-import">설정 가져오기</button>
          </div>
        </div>
      </div>
    `)

    document.body.prepend(component)

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
        Config.reset()

        if (confirm('새 설정을 적용하기 위해선 페이지를 다시 불러와야합니다, 새로 고치시겠습니까?')) {
          location.reload()
        }
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

      if (confirm('새 설정을 적용하기 위해선 페이지를 다시 불러와야합니다, 새로 고치시겠습니까?')) {
        location.reload()
      }
    })
  },
  destroy () {
    document.querySelector('#ks-preview')?.remove()
  }
}

export default componentConfig
