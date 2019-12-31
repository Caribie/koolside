import { createElement } from '../includes/utils'

const componentPreview: Component = {
  create () {
    const preview = createElement('<div id="ks-preview"></div>')
    document.body.prepend(preview)
  },
  destroy () {
    document.querySelector('#ks-preview')?.remove()
  }
}

export default componentPreview
