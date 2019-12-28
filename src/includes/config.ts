import Storage from './storage'

const config = new Storage('config', {
  defaultValue: {
    hide: {
      logo: true,
      title: true,
      titlebar: true,
      right: {
        all: true,
        login: true,
        recommend: true,
        issuezoom: true,
        news: true,
        realtime: true,
        hit: true,
        sec_recommend: true,
        wiki: true
      }
    }
  },
  onSync () {
    const classes = []
    const config = this.export()

    if (config.hide.logo) classes.push('ks-hide-logo')

    if (config.hide.title) classes.push('ks-hide-title')
    if (config.hide.titlebar) classes.push('ks-hide-titlebar')

    if (config.hide.right.all) {
      classes.push('ks-hide-right')
    } else {
      if (config.hide.right.login) classes.push('ks-hide-right-login')
      if (config.hide.right.recommend) classes.push('ks-hide-right-recommend')
      if (config.hide.right.issuezoom) classes.push('ks-hide-right-issuezoom')
      if (config.hide.right.news) classes.push('ks-hide-right-news')
      if (config.hide.right.realtime) classes.push('ks-hide-right-realtime')
      if (config.hideElhideement.right.hit) classes.push('ks-hide-right-hit')
      if (config.hide.right.sec_recommend) classes.push('ks-hide-right-sec-recommend')
      if (config.hide.right.wiki) classes.push('ks-hide-right-wiki')
    }

    document.body.setAttribute('class', classes.join(' '))
  }
})

export default config
