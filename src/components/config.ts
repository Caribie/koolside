import FileSaver from 'file-saver'

import cache from '../includes/cache'
import Config, { configuration } from '../includes/config'
import { createElement } from '../includes/utils'

/**
 * 설정 아이템 요소를 생성합니다
 * @param items 설정 아이템
 * @param prop 현재까지 사용한 프롭 문자열
 */
function generate (items?: LooseObject<ConfigRecursive|ConfigItem>, prop?: string) {
  const result = [] as string[]
  
  items = items ?? configuration
  prop = prop ?? ''

  for (let [key, item] of Object.entries(items)) {
    key = `${prop}${key}`

    if ('items' in item) {
      // 헤더와 하위 아이템 추가하기
      result.push(`
        <details style="padding-left:1em">
          <summary title=${item.description ?? item.name}>${item.name}</summary>
          ${generate(item.items, `${key}.`).join('')}
        </details>
      `)
    } else {
      // 아이템 추가하기
      let input
      let value = Config.getRaw(key)

      // 자료형에 따라 태그 설정하기
      if (typeof value === 'string') {
        const textarea = (item as ConfigString).textarea
        const placeholder = ((item as ConfigString).placeholder ?? '').replace(/"/g, '&quot;')
  
        value = value.replace(/"/g, '&quot;')

        if (textarea) {
          input = `<textarea placeholder="${placeholder}">${value}</textarea>`
        } else {
          input = `<input type="text" value="${value}" placeholder="${placeholder}">`
        }
      } else if (typeof value === 'number') {
        const min = (item as ConfigNumber).min
        const max = (item as ConfigNumber).max
        const step = (item as ConfigNumber).step
        const type = step ? 'range' : 'number'

        input = `<input type="${type}" value="${value}" min="${min}" max="${max}" step="${step}">`
      } else if (typeof value === 'boolean') {
        input = `<input type="checkbox" ${!value || 'checked'}>`
      } else {
        console.error(`'${key}' 설정을 처리할 수 없습니다`)
      }

      result.push(`
        <div class="ks-config-item" data-key="${key}" data-tooltip="${item.description ?? item.name}">
          <div class="ks-config-key">${item.name}</div>
          <div class="ks-config-value">${input}</div>
        </div>
      `)
    }
  }

  return result
}

function update (this: HTMLInputElement) {
  const wrapper = this.closest<HTMLElement>('.ks-config-item')

  const key = wrapper.dataset.key
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
    document.body.prepend(createElement(`
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

    const component = document.querySelector('#ks-config')

    // 설정 화면 닫기 이벤트
    component.addEventListener('click', e => {
      const target = e.target as HTMLElement
  
      if (target.matches('#ks-config')) {
        target.classList?.toggle('ks-active')
      }
    })

    // 작은거 누르기 싫어하는 사람을 위한 체크박스 보조 이벤트
    for (let checkbox of component.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')) {
      const wrapper = checkbox.closest<HTMLElement>('.ks-config-item')

      wrapper.addEventListener('click', e => {
        // 체크박스 클릭하면 이벤트 두 개 들어가서 값 복구되는거 방지하기
        if (e.target !== checkbox) checkbox.checked = !checkbox.checked
      })
    }

    // 설정 값 변경 이벤트
    for (let input of component.querySelectorAll<HTMLInputElement>('input, textarea')) {
      input.addEventListener('change', update)

      if (input.getAttribute('type') === 'range') {
        input.addEventListener('input', update)
      }
    }

    component.querySelector('#ks-btn-reset').addEventListener('click', () => {
      if (confirm('정말로 설정을 처음으로 되돌리시겠습니까?')) {
        Config.load({})
      }
    })

    component.querySelector('#ks-btn-resetcache').addEventListener('click', () => {
      if (confirm(`정말로 캐시된 게시글 ${cache.length}개를 삭제하시겠습니까?`)) {
        cache.reset()
      }
    })

    component.querySelector('#ks-btn-export').addEventListener('click', () => {
      const filename = `koolside-${+new Date()}.json`
      const file = new File([JSON.stringify(Config.export())], filename, {
        type: 'application/json;charset=utf-8'
      })

      FileSaver.saveAs(file)
    })

    component.querySelector('#ks-btn-import').addEventListener('click', () => {
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
