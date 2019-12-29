import config from "./config"
import { fetchList } from "./request"
import { getParameter, range } from "./utils"

let interval: NodeJS.Timeout

/**
 * 자동 새로고침 타이머를 초기화합니다
 */
export default function timer () {
  const gallery = getParameter('id')

  if (interval) {
    clearInterval(interval)
  }

  interval = setInterval(
    () => fetchList(gallery),
    range(Math.min(0, config.get<number>('live.delay')), 0.5, 30) * 1000
  )
}
