/* 知识公社 · 公考行测 · 入门六讲 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { useKCEnhancer } from '../course-enhance'
import { SearchBar } from '../components/SearchBar'

function Page() {
  useKCEnhancer('course-gongkao.html')
  return (
    <Layout
active="课程"
      kicker="CIVIL SERVICE · START HERE"
      title="公考行测 · 入门六讲"
      lines={["先搞懂\"考什么、怎么拿分\"，再上强度。内附本站图形推理题库的刷题安排。"]}
    >
      <div className="card lesson" id="g1">
          <h3>第 1 讲 · 行测是什么：五大模块与得分地图</h3>
          <div className="goal">目标：知道每一块值多少钱、该投多少时间。</div>
          <ul>
            <li>行测五大模块：<b>常识判断、言语理解、数量关系、判断推理、资料分析</b>（国考副省级 135 题 / 地市级 130 题，120 分钟）。</li>
            <li>投入产出比排序（新手最重要的一条）：<b>资料分析 &gt; 判断推理 &gt; 言语理解 &gt; 数量关系 &gt; 常识</b>。</li>
            <li>策略：先做自己强的模块，切勿在一道题上死磕超过 90 秒。</li>
          </ul>
          <div className="check">行动：找一套近年国考真题（见<a href="gongkao.html">公务员页</a>的真题大库导航），不限时做一遍，记录各模块正确率。</div>
        </div>
      
        <div className="card lesson" id="g2">
          <h3>第 2 讲 · 资料分析：速算与找数（提分核心）</h3>
          <div className="goal">目标：20 题 25 分钟内做完，正确率 80%+。</div>
          <h4>三件事练到熟</h4>
          <ul>
            <li><b>找数</b>：先看问题再回材料定位，圈出"年份+指标"两个关键词。</li>
            <li><b>公式</b>：增长率 = (今−昔)/昔；比重 = 部分/整体；平均数 = 总量/份数；增长量 = 今 − 今/(1+r)。</li>
            <li><b>估算</b>：答案差距大时大胆截位（保留两位有效数字），不要精算到底。</li>
          </ul>
          <div className="check">行动：每天 2 篇材料（每篇 5 题），限时 8 分钟；连做 14 天。</div>
        </div>
      
        <div className="card lesson" id="g3">
          <h3>第 3 讲 · 判断推理（上）：图形推理的套路</h3>
          <div className="goal">目标：看到图形先想"考点清单"，而不是瞎看。</div>
          <ul>
            <li>考点清单（按出现频率）：<b>数量类</b>（点线面角素）→ <b>位置类</b>（平移旋转翻转）→ <b>样式类</b>（遍历、加减同异）→ <b>属性类</b>（对称、曲直、开闭）→ <b>立体类</b>（截面、拼合）。</li>
            <li>做题顺序：先整体（对称/开闭）→ 再局部（数量）→ 最后位置样式。</li>
          </ul>
          <div className="check">行动：本站已内置<b>图形推理真题库 354 题</b>（<a href="files/tuxing/index.html">点此开始刷</a>）：每天 20 题，错题看解析归类考点，一周后开限时模式。</div>
        </div>
      
        <div className="card lesson" id="g4">
          <h3>第 4 讲 · 判断推理（下）：逻辑判断与定义</h3>
          <ul>
            <li><b>翻译推理</b>：如果 A 则 B → A→B；只有 A 才 B → B→A；"且/或"的否定：¬(A且B)=¬A或¬B。</li>
            <li><b>加强/削弱</b>：先找论点→再找论据→看选项是"补充论据/断开联系"。力度排序：直接否定论点 &gt; 断开论证 &gt; 无关选项。</li>
            <li><b>定义判断</b>：把定义拆成 2–3 个条件，逐一排除；注意"属于/不属于"是反向题。</li>
            <li><b>类比推理</b>：先造句定关系（种属/并列/对应/条件），再看词性细化。</li>
          </ul>
          <div className="check">行动：每天 15 题（逻辑 8 + 定义 4 + 类比 3）。</div>
        </div>
      
        <div className="card lesson" id="g5">
          <h3>第 5 讲 · 言语理解：关键词与结构法</h3>
          <ul>
            <li>中心理解题：找 <b>转折词（但是/然而）之后、结论词（因此/可见）之后</b>——大概率就是主旨句。</li>
            <li>细节题：先看选项划关键词，再回文定位比对；"都、全部、最"必核查。</li>
            <li>逻辑填空：先看搭配与语境（褒贬/轻重），再看词语辨析；两空题先易后难。</li>
          </ul>
          <div className="check">行动：每天 20 题；把高频成语（500 个常考）分批积累进自己的错词本。</div>
        </div>
      
        <div className="card lesson" id="g6">
          <h3>第 6 讲 · 数量关系与常识：捡分策略</h3>
          <ul>
            <li>数量关系别全放弃：优先学<b>工程、行程、利润、排列组合基础</b>4 类，考场上挑 5–6 道简单题先做，其余统一蒙。</li>
            <li>常识：不值得专门刷题，碎片时间看时政（近一年大事）+ 法律基础即可。</li>
            <li>整体节奏：套卷模考时"<b>先做资料+判断，再言语，最后数量常识</b>"，按个人正确率微调。</li>
          </ul>
          <div className="check">结课：完成 3 套完整套卷模考，把每套的错因写进错题本（只写"为什么错+下次怎么识别"）。</div>
        </div>
      
        
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
