import { createElement } from "../includes/utils"

const componentPreview: Component = {
  onCreate () {
    const preview = createElement('<div id="ks-preview"></div>')
    document.body.prepend(preview)
  },
  onDestroy () {
    document.querySelector('#ks-preview')?.remove()
  }
}

export default componentPreview
