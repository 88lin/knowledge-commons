/* ---- 视频源配置（NoCode 版唯一需要人工维护的文件之一） ----
 *
 * 视频已上传 B 站，站内不再内嵌播放（画质模糊、不引流量），
 * 统一改为新窗口跳转 B 站观看。分 P 已按文件名顺序排好。 */

/* 零基础学堂：BV1Aypb6LEC4（13P）
 * 映射：epb00=P1 … epb09=P10、epb13=P11、epb14=P12、epb15=P13
 * （epb10~12 无视频，BiliVideo 组件已做兜底提示） */
export const BEGINNER_BVID = 'BV1Aypb6LEC4'
export const BEGINNER_BVIDS = {}      // 独立方式备用：{ 集数: BV号 }

/* 其余三组备用（当前页面无调用点，后续需要时接入） */
export const COURSE_BVID = 'BV17spv6pE1a'   // 云计算系统课 18P
export const SERIES_BVID = 'BV1JJpv6dERP'   // 系列课精选合集 15P
export const EXT_BVID = 'BV1kQpg6oEBg'      // 扩展课程合集 29P

/* 原站直链（仅在 B 站未回填时作为兜底链接，正常不再使用） */
export const originVideoUrl = (n) =>
  `https://88lin.github.io/knowledge-commons/videos/beginner/epb${n}.mp4`
