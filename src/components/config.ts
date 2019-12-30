import cache from "../includes/cache"
import config, { configOption, set } from "../includes/config"
import { createElement } from "../includes/utils"
import componentStyle from "./style"

function generateItems (set: ConfigSet, keys?: string) {
  const result = [] as string[]
  
  keys = keys || ''

  for (let k in set) {
    const item = set[k]

    if ('set' in item) {
      // 카테고리라면 헤더와 하위 아이템 추가하기
      const i = 2 + (keys.match(/\./g) || []).length // 헤더 번호 (<h1>, <h2>, <h3>...)
      result.push(`<h${i} class="ks-config-item">${item.name}</h${i}>`)
      result.push(...generateItems(item.set, `${keys}${k}.`))
    } else {
      // 아이템 추가하기
      const key = `${keys}${k}`
      const def = item.default

      let html = ''

      if (typeof def === 'string') {
        const value = config.get<string>(key).replace(/"/g, '&quot;')

        html = /* html */`
          <label>${item.name}</label>
          <input 
            type="text"
            value="${value}"
            data-key="${key}">
        `
      } else if (typeof def === 'number') {
        const value = config.get<number>(key)
        const min = configOption<number>(key, 'min')
        const max = configOption<number>(key, 'max')

        html = /* html */`
          <label>${item.name}</label>
          <input 
            type="number"
            value="${value}"
            ${ typeof min === 'number' ? `min="${min}"` : '' }
            ${ typeof max === 'number' ? `min="${max}"` : '' }
            data-key="${key}">
          `
      } else if (typeof def === 'boolean') {
        html = /* html */`
          <label>
            <input
              type="checkbox" 
              data-key="${key}"
              ${config.get<number>(key) ? 'checked' : ''}>
            <span>${item.name}</span>
          </label>
        `
      } else {
        console.error(`'${key}' 설정을 처리할 수 없습니다`)
      }

      result.push(/* html */`
        <div class="ks-config-item ks-config-key">
          ${html}
        </div>
      `)
    }
  }

  return result
}

const componentConfig: Component = {
  create () {
    const wrapper = createElement(/* html */`
      <div id="ks-config">
        <div>
          ${generateItems(set).join('\n')}
          <button id="ks-btn-deletecache">캐시 삭제</button>
        </div>
      </div>
    `)

    document.body.prepend(wrapper)

    function update (this: HTMLInputElement) {
      const key = this.dataset.key
      const oldValue = config.get(key)

      let newValue

      if (typeof oldValue === 'boolean') {
        newValue = this.checked
      } else {
        newValue = this.value
      }

      if (oldValue !== newValue) {
        // 변경시 실행할 함수가 있다면 실행하기
        const onChange = configOption<Function>(key, 'onChange')
        if (onChange) {
          onChange(oldValue, newValue)
        }

        config.set(key, newValue)
        config.sync()
      }

      // 스타일 관련 설정이 변경됐다면 스타일시트 컴포턴트 새로 생성하기
      if (key.startsWith('style')) {
        componentStyle.destroy()
        componentStyle.create()
      }
    }

    // 설정 화면 닫기 이벤트
    document.querySelector('#ks-config').addEventListener('click', e => {
      const target = e.target as HTMLElement
      if (target.id === 'ks-config') {
        target.classList?.toggle('ks-active')
      }
    })

    // 캐시 삭제 버튼 이벤트
    document.querySelector('#ks-btn-deletecache')?.addEventListener('click', () => {
      cache.reset()
    })

    for (let input of document.querySelectorAll('.ks-config-key input') as NodeListOf<HTMLInputElement>) {
      input.addEventListener('change', update)
    }

  },
  destroy () {
    document.querySelector('#ks-preview')?.remove()
  }
}

export default componentConfig
