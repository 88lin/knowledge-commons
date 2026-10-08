/* 知识公社 · 电商创业 · 实战中心 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'
import { ResumeCard } from '../learn-engine'

function Page() {
  return (
    <Layout
active="创业"
      kicker="E-COMMERCE PLAYBOOK · 2026-10"
      title="电商创业 · 实战中心"
      lines={["境内境外 · 平台实价 · 选品 SOP · 合规税务 · 90 天作战地图 —— 所有关键数字联网核实，随政策更新"]}
    >
      <div className="wrap">
        <div className="card"><ResumeCard /></div>
      
        <section>
          <h2 className="sec">总纲 · 这个中心是什么</h2>
          <div className="card">
            <p>面向零经验新手的电商创业全流程手册：<b>选方向 → 开店 → 选品 → 运营 → 数据 → 合规</b>六个环节逐个拆解。与网上教程的区别：所有保证金、扣点、佣金、关税数字均为 <b>2026-10-08 联网核实</b>（来源：各平台官方卖家中心、国务院 810 号令全文、Zonos 关税库、雨果网/亿邦动力等），并明确标注哪些 2024 年的老打法已经失效。</p>
            <p className="small">工具表三张（利润核算 / 选品评分 / 测款记录）与全文七篇在 <a href="docs/ecommerce">docs/ecommerce/</a>；精选外部资源在 <a href="../library.html#g=10">资源总库 · 电商创业实战板块</a>。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">三条起步路径 · 按你有什么选</h2>
          <div className="grid">
            <a className="mod" href="docs/ecommerce/01-%E5%9B%BD%E5%86%85%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">
              <div className="ico">A</div>
              <b>零经验 · 零货源 · 千元内启动</b>
              <div className="desc">拼多多 0 元入驻 / 淘宝 30 元保证金险 + 1688 一件代发。不压货练全流程，第一个月目标是跑通 1 单。</div>
              <div className="meta">启动 ¥500–3,000 · 风险最低</div>
            </a>
            <a className="mod" href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">
              <div className="ico">B</div>
              <b>会拍会剪 · 内容电商</b>
              <div className="desc">抖音小店（个体户 + ¥2,000–5,000 保证金）或 TikTok Shop 东南亚（90 天免保证金）。内容是 2026 最便宜的流量杠杆。</div>
              <div className="meta">内容能力变现 · 上限高</div>
            </a>
            <a className="mod" href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">
              <div className="ico">C</div>
              <b>有货源 / 有 5 万+ 本金</b>
              <div className="desc">境内：拼多多走量 + 抖音利润双开。跨境：Temu 全托管 VMI 或亚马逊 FBA 精品（单 SKU 预算 ¥8–15 万）。</div>
              <div className="meta">用钱和货换确定性</div>
            </a>
          </div>
        </section>
      
        <section>
          <h2 className="sec">境内平台 2026 实价对比</h2>
          <div className="card"><ul className="list">
            <li><span className="t"><a href="docs/ecommerce/01-%E5%9B%BD%E5%86%85%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">拼多多 · 0 元入驻，个人店保金 ¥2,000 / 企业 ¥1,000，0 扣点</a></span><span className="n">出单最快</span></li>
            <li><span className="t"><a href="docs/ecommerce/01-%E5%9B%BD%E5%86%85%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">淘宝 · 0 元认证，保金 ¥1,000 或 ¥30/年险；年成交 &lt;12 万返基础服务费</a></span><span className="n">长期主义</span></li>
            <li><span className="t"><a href="docs/ecommerce/01-%E5%9B%BD%E5%86%85%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">抖音小店 · 个体户可入，2026-04 起精选联盟全品类底佣 5%</a></span><span className="n">毛利≥50%</span></li>
            <li><span className="t"><a href="docs/ecommerce/01-%E5%9B%BD%E5%86%85%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">微信小店 · 新商 0 保证金试运营 + 技术服务费 1%，生态红利期</a></span><span className="n">私域闭环</span></li>
            <li><span className="t"><a href="docs/ecommerce/01-%E5%9B%BD%E5%86%85%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">小红书 · 0 元开店先卖后补（保金 ¥1,000），0 门槛买手合作</a></span><span className="n">图文种草</span></li>
          </ul></div>
        </section>
      
        <section>
          <h2 className="sec">跨境 2026 · 牌桌已换</h2>
          <div className="card">
            <p><b>美国 800 美元免税已死</b>（2025-08 全球取消 → 2026-07 起邮政通道按标准关税，中国货 = MFN + 301 强迫劳动 12.5%）；<b>欧盟 €150 免税 2026-07-01 取消</b>（过渡期 €3/件）。直邮低价小包美欧路线封死，活路：全托管 / 半托管 / 海外仓 / 非美欧市场。</p>
            <ul className="list">
              <li><span className="t"><a href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">Temu 全托管 VMI · 无备货罚款，新手跨境第一站（JIT 需 ¥5,000 保金且罚则严）</a></span><span className="n">新手首选</span></li>
              <li><span className="t"><a href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">TikTok Shop · 美区合资落地（2026-01），东南亚 90 天免保证金，美区佣金 6% + 保金 $1,500</a></span><span className="n">内容出海</span></li>
              <li><span className="t"><a href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">速卖通 · 个体户可入，全托管仅 2.5% 供货服务费，类目保金 ¥1–3 万</a></span><span className="n">阿里系</span></li>
              <li><span className="t"><a href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">亚马逊 FBA · 2026 费用全景与新卖家激励，单 SKU 预算 ¥8–15 万</a></span><span className="n">天花板</span></li>
              <li><span className="t"><a href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">Shopee / Lazada · 东南亚零成本试水（免佣免保金窗口）+ 独立站定位</a></span><span className="n">练手区</span></li>
            </ul>
          </div>
        </section>
      
        <section>
          <h2 className="sec">90 天作战路线（可打卡）</h2>
          <div className="lesson" id="r1">
            <b>第 1 周 · 定方向</b>
            <p>按三条路径自测选定 1 个平台 → 线上办个体户执照（1–3 天）→ 税务登记选小规模纳税人 → 建三张工作表。目标：执照到手 + 店铺申请提交。</p>
          </div>
          <div className="lesson" id="r2">
            <b>第 2 周 · 定品</b>
            <p>免费工具列 20 个候选 → 供需比筛到 8 个 → 十维评分留 3–5 个 → 利润核算淘汰 → 1688 每款 3 家比价并<b>拿样</b>。目标：3–5 个过线的品。</p>
          </div>
          <div className="lesson" id="r3">
            <b>第 3 周 · 开卖</b>
            <p>上架 3–5 款（标题公式 / 主图 5 张逻辑 / 详情 5 屏）→ 设联盟佣金 → 跑通首单全链路：下单 → 供应商发货 → 对账 → 回款。目标：全流程至少 1 单闭环。</p>
          </div>
          <div className="lesson" id="r4">
            <b>第 4 周 · 测款</b>
            <p>每款 2 条素材小额投流（随心推 ¥100–150/条 或 直通车日限 ¥50–100×3 天）→ 数据记入测款表 → 按判断线执行「追 / 改 / 弃」。月度复盘：每单真实利润对账。</p>
          </div>
          <div className="lesson" id="r5">
            <b>第 2 个月 · 放大</b>
            <p>跑通款集中资源：素材翻拍 3–5 版、ROI 过保本线才加预算、精选联盟邀约 50–100 个中腰部达人、上游锁供并备份 2 家。目标：日出 10–30 单稳定两周。</p>
          </div>
          <div className="lesson" id="r6">
            <b>第 3 个月 · 结构化</b>
            <p>周更选品流水线、三档价格结构、报平台活动、季度申报与成本票归档、现金流沙盘。90 天终点：跑通 ≥1 个净利为正的款，否则诚实止损。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">2026 新手死亡陷阱（避坑红线）</h2>
          <div className="card"><ul className="list">
            <li><span className="t">国内直邮小包做欧美低价品 —— 税改后必死，别碰</span><span className="n">危</span></li>
            <li><span className="t">抖音憋单起号 —— 平台明令禁止，2025 年回收直播权限账号 37 万个</span><span className="n">危</span></li>
            <li><span className="t">低毛利铺货 —— 联盟 5% 底佣 + 平台反铺货，模式已死</span><span className="n">危</span></li>
            <li><span className="t">店铺收入不报税 —— 810 号令按季报送，已现自查推送；小规模优惠下真实税负极低，别赌</span><span className="n">危</span></li>
            <li><span className="t">包裹卡引流微信（淘系/拼多多）—— 拼多多抓到缴 ¥5 万保金 + 封店 3 个月</span><span className="n">危</span></li>
            <li><span className="t">买电商培训课 —— 官方免费教程已覆盖 95% 必知项，割韭菜浓度历史最高</span><span className="n">省</span></li>
          </ul></div>
        </section>
      
        <section>
          <h2 className="sec">配套手册 · 全文七篇（持续更新）</h2>
          <div className="card"><ul className="list">
            <li><span className="t"><a href="docs/ecommerce/00-%E6%80%BB%E7%BA%B2-%E7%94%B5%E5%95%86%E5%88%9B%E4%B8%9A90%E5%A4%A9%E4%BD%9C%E6%88%98%E5%9C%B0%E5%9B%BE.md">00 · 总纲：电商创业 90 天作战地图</a></span><span className="n">先读</span></li>
            <li><span className="t"><a href="docs/ecommerce/01-%E5%9B%BD%E5%86%85%E5%B9%B3%E5%8F%B0%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">01 · 境内平台实操手册（拼多多/淘宝/抖音/微信小店/小红书实价）</a></span><span className="n">境内</span></li>
            <li><span className="t"><a href="docs/ecommerce/02-%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E5%AE%9E%E6%93%8D%E6%89%8B%E5%86%8C.md">02 · 跨境电商实操手册（关税巨变 + 平台决策树）</a></span><span className="n">境外</span></li>
            <li><span className="t"><a href="docs/ecommerce/03-%E9%80%89%E5%93%81%E4%B8%8E%E4%BE%9B%E5%BA%94%E9%93%BE%E6%89%8B%E5%86%8C.md">03 · 选品与供应链（1688 代发 / 产业带 / 测款 SOP）</a></span><span className="n">核心</span></li>
            <li><span className="t"><a href="docs/ecommerce/04-%E8%BF%90%E8%90%A5%E4%B8%8E%E6%8E%A8%E5%B9%BF%E6%89%8B%E5%86%8C.md">04 · 运营与推广（各平台打法 / AI 素材合规 / 私域红线）</a></span><span className="n">打法</span></li>
            <li><span className="t"><a href="docs/ecommerce/05-%E6%95%B0%E6%8D%AE%E4%B8%8E%E8%B4%A2%E5%8A%A1%E6%89%8B%E5%86%8C.md">05 · 数据与财务（指标基准 / 定价纪律 / 现金流）</a></span><span className="n">天天用</span></li>
            <li><span className="t"><a href="docs/ecommerce/06-%E5%90%88%E8%A7%84%E4%B8%8E%E7%A8%8E%E5%8A%A1%E6%89%8B%E5%86%8C.md">06 · 合规与税务（办照 / 810 号令 / 出口 / 目的国 / 收款物流）</a></span><span className="n">开店前</span></li>
            <li><span className="t"><a href="docs/ecommerce/07-90%E5%A4%A9%E6%89%A7%E8%A1%8C%E8%AE%A1%E5%88%92.md">07 · 90 天执行计划（按周清单）</a></span><span className="n">贴墙</span></li>
            <li><span className="t"><a href="docs/ecommerce/templates">工具表 · 利润核算 / 选品评分 / 测款记录（CSV）</a></span><span className="n">表格</span></li>
          </ul></div>
        </section>
      
        <section>
          <h2 className="sec">官方免费学习入口（不买课）</h2>
          <div className="card"><ul className="list">
            <li><span className="t"><a href="https://school.jinritemai.com/">抖音电商学习中心 · 新商开店指南</a></span><span className="n">抖音</span></li>
            <li><span className="t"><a href="https://daxue.taobao.com/">淘宝大学 · 开店全套教程</a></span><span className="n">淘系</span></li>
            <li><span className="t"><a href="https://store.weixin.qq.com/chengzhang">微信小店成长中心</a></span><span className="n">微信</span></li>
            <li><span className="t"><a href="https://zhaoshang.xiaohongshu.com/">小红书商家招商与学习</a></span><span className="n">小红书</span></li>
            <li><span className="t"><a href="https://gs.amazon.cn/">亚马逊全球开店官方</a></span><span className="n">跨境</span></li>
          </ul></div>
        </section>
      
        <p className="note">资料核查 2026-10-08 · 政策随时变动，动手前以平台官方后台为准 · 知识公社 · 知识共享</p>
      </div>
      <script src="kc-learn.js"></script>
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
