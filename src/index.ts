import componentConfig from './components/config'
import componentContext from './components/context'
import componentPreview from './components/preview'
import componentStyle from './components/style'
import componentTooltip from './components/tooltip'
import cache from './includes/cache'
import Config from './includes/config'
import { fetchList, fetchPosts } from './includes/request'
import { delay,getParameter } from './includes/utils'

async function main () {
  const gallery = getParameter('id')

  // 설정 맞추기
  Config.sync()

  // 앱에서 사용할 요소와 스타일 시트 추가하기
  componentStyle.create()
  componentTooltip.create()
  componentContext.create()
  componentConfig.create()
  componentPreview.create()

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
    await fetchPosts(gallery, fetching).catch(console.error)

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const interval = Config.get<number>('live.interval') * 1000
      await fetchList(gallery).catch(console.error)
      await delay(interval)
    }
  }
}

// 최상단 페이지에서만 스크립트 실행하기
if (window.top === window.self) {
  window.onload = main
}
