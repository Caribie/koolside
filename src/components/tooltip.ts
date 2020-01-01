import { createElement, getElementParents, getElementStyle } from '../includes/utils'

function onMouseEvent (e: MouseEvent) {
  const tooltip = document.querySelector<HTMLElement>('#ks-tooltip')

  let target = e.target as HTMLElement
  const parents = getElementParents(target)

  while (parents.length && (!target.dataset || !target.dataset.tooltip)) {
    target = parents.shift()
  }

  if (target.dataset && target.dataset.tooltip) {
    tooltip.textContent = target.dataset.tooltip
    tooltip.style.top = `${e.clientY - 25}px`
    tooltip.style.left = `${e.clientX + 25}px`
    tooltip.style.zIndex = getElementStyle(target, 'z-index') + 1

    tooltip.classList.add('ks-active')
  } else {
    tooltip.classList.remove('ks-active')
  }
}

const componentTooltip: Component = {
  create () {
    const tooltip = createElement('<div id="ks-tooltip"></div>')
    document.body.prepend(tooltip)
    document.addEventListener('mouseover', onMouseEvent)
    document.addEventListener('mousemove', onMouseEvent)
  },
  destroy () {
    document.querySelector('#ks-tooltip')?.remove()
    document.removeEventListener('mouseover', onMouseEvent)
    document.removeEventListener('mousemove', onMouseEvent)
  }
}

export default componentTooltip
