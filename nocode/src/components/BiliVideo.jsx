import { BEGINNER_BVID, BEGINNER_BVIDS, originVideoUrl } from '../videos'

/* 未上传视频的课（epb10~12 缺集），组件显示占位提示 */
const NO_VIDEO = ['10', '11', '12']

/* 取某集的 B 站 BV 号；未配置返回 null */
export function biliBv(n) {
  if (BEGINNER_BVID) return BEGINNER_BVID
  if (BEGINNER_BVIDS[n]) return BEGINNER_BVIDS[n]
  return null
}

/* 分 P 序号：epb00~09 依次为 P1~P10；epb10~12 不存在；epb13~15 为 P11~P13 */
export function biliP(n) {
  const k = Number(n)
  return k >= 13 ? k - 2 : k + 1
}

/* 跳转链接：多 P 模式按上表取分 P */
export function biliLink(n) {
  const bv = biliBv(n)
  if (!bv) return originVideoUrl(n)
  const p = BEGINNER_BVIDS[n] ? 1 : biliP(n)
  return `https://www.bilibili.com/video/${bv}?p=${p}`
}

/* 视频卡片：站内不内嵌播放（画质模糊、不引流量），统一新窗口跳转 B 站 */
export function BiliVideo({ n }) {
  if (NO_VIDEO.includes(n)) {
    return (
      <div className="bili-jump novideo">
        <p className="bili-note">本课无视频，以下方图文讲义为主。</p>
      </div>
    )
  }
  const bv = biliBv(n)
  if (!bv) {
    return (
      <div className="bili-jump novideo">
        <p className="bili-note">视频整理中，可先阅读下方图文讲义。</p>
      </div>
    )
  }
  return (
    <a className="bili-jump" href={biliLink(n)} target="_blank" rel="noreferrer">
      <span className="play">▶</span>
      <b>在 B 站高清播放本集</b>
      <span className="bili-note">视频已托管至哔哩哔哩 · 新窗口打开，高清不卡顿</span>
    </a>
  )
}
