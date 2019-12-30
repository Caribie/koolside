import config, { dataset } from "../includes/config"
import { createElement } from "../includes/utils"
import componentStyle from "./style"

function generateItems (dataset: LooseObject, key?: string) {
  const result = [] as string[]
  
  key = key || ''

  for (let k in dataset) {
    const data = dataset[k]

    if (data.items) {
      // 카테고리라면 헤더와 하위 아이템 추가하기
      const i = 2 + (key.match(/\./g) || []).length
      result.push(`<h${i} class="ks-config-item">${data.name}</h${i}>`)
      result.push(...generateItems(data.items, `${key}${k}.`))
    } else {
      // 아이템 추가하기
      const currentKey = `${key}${k}`

      let html = ''

      switch (typeof data.default) {
        case 'number':
          html = /* html */`
            <label>${data.name}</label>
            <input 
              type="number"
              value="${config.get<number>(currentKey)}"
              data-key="${currentKey}">
          `
          break
        case 'string':
          html = /* html */`
            <label>${data.name}</label>
            <input 
              type="text"
              value="${config.get<string>(currentKey).replace(/"/g, '&quot;')}"
              data-key="${currentKey}">
          `
          break
        case 'boolean':
          html = /* html */`
            <label>
              <input
                type="checkbox" 
                data-key="${currentKey}"
                ${config.get<number>(currentKey) ? 'checked' : ''}>
              <span>${data.name}</span>
            </label>
          `
          break
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
          <h1>설정</h1>
          ${generateItems(dataset).join('\n')}
        </div>
      </div>
    `)

    document.body.prepend(wrapper)

    document.querySelector('#ks-config')?.addEventListener('click', e => {
      const target = e.target as HTMLElement
      if (target.id === 'ks-config') {
        target.classList?.toggle('ks-active')
      }
    })

    function update (this: HTMLInputElement) {
      const key = this.dataset.key
      let value

      switch (typeof config.get(key)) {
        case 'boolean':
          value = this.checked
          break
        default:
          value = this.value
      }

      config.set(key, value)
      config.sync()

      // 스타일 관련 설정이 변경됐다면 스타일시트 컴포턴트 새로 생성하기
      if (key.startsWith('style')) {
        componentStyle.destroy()
        componentStyle.create()
      }
    }

    for (let input of document.querySelectorAll('.ks-config-key input') as NodeListOf<HTMLInputElement>) {
      input.addEventListener('change', update)
    }

  },
  destroy () {
    document.querySelector('#ks-preview')?.remove()
  }
}

export default componentConfig
