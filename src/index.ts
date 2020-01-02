import componentConfig from './components/config'
import componentContext from './components/context'
import componentStyle from './components/style'
import componentTooltip from './components/tooltip'
import cache from './includes/cache'
import Config from './includes/config'
import { fetchList, fetchPosts } from './includes/request'
import { getParameter, promiseSeries, wait } from './includes/utils'

// @ts-ignore FUCK YOU VSCODE
await new Promise(resolve => window.onload = resolve)

if (window.top === window.self) {
  const gallery = getParameter('id')
  
  // 설정 맞추기
  Config.sync()
  
  console.log(Config)
  
  // 앱에서 사용할 요소와 스타일 시트 추가하기
  componentStyle.create()
  componentTooltip.create()
  componentContext.create()
  componentConfig.create()
  
  if (document.querySelector('.gall_list')) {
    // 기존 게시글 목록 데이터 셋 초기화하기
    const fetching = []
  
    for (let post of document.querySelectorAll('tr.ub-content') as NodeListOf<HTMLElement>) {
      // 게시글 번호
      if (!post.dataset.no) {
        post.dataset.no = post.querySelector('.gall_num').textContent.trim() || getParameter('no')
      }
  
      // 광고
      if (!post.dataset.notice && post.querySelector('.icon_notice')) {
        post.dataset.notice = ''
      } else if (!cache.has(gallery, post.dataset.no)) {
        // 캐시가 없다면 캐시할 게시글 목록에 추가하기
        fetching.push(post.dataset.no)
      }
    }
  
    // 현재 페이지의 게시글 목록 초기화하기
    // @ts-ignore
    await fetchPosts(gallery, fetching).catch(console.error)
  
    while (true) {
      const interval = Config.get<number>('live.interval') * 1000
      const promises = [ wait(interval) ]
  
      if (Config.get('live.enabled')) {
        promises.push(fetchList(gallery).catch(console.error))
      }
  
      // @ts-ignore
      await promiseSeries(promises)
    }
  }
}
