import { createElement } from "../includes/utils"

const componentNav: Component = {
  create () {
    const nav = createElement(/* html */`
      <ul id="ks-nav">
        <li class="ks-nav-item ks-nav-item-setting">설정</li>
      </ul>
    `)

    const replacement = document.querySelector('.gnb_bar')

    if (replacement) {
      replacement.innerHTML = ''
      replacement.append(nav)
    
      document.querySelector('.ks-nav-item-setting').addEventListener('click', () => {
        document.querySelector('#ks-config').classList.toggle('ks-active')
      })
    }
  },
  destroy () {
    document.querySelector('#ks-nav')?.remove()
  }
}

export default componentNav
