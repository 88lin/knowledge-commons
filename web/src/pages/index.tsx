/* 知识公社 · 知识公社 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'
import { ResumeCard } from '../learn-engine'

function Page() {
  return (
    <Layout
active="首页"
      kicker="KNOWLEDGE COMMONS"
      title="知识公社"
      lines={["竞赛真题 · 升学考试 · 公务员 · 红色经典 · 职业技能 · 资源总库", "从零到精通，点开就能学；不设门槛，不论基础。"]}
      motto={<span dangerouslySetInnerHTML={{ __html: "「读书是学习，使用也是学习，<i>而且是更重要的学习</i>。」" }} />}
    >
      <SearchBar />
        <div className="card"><ResumeCard /></div>
        <div className="actionbar">
          <a className="actbtn" href="beginner.html">零基础学堂 · 从第一课开始</a>
          <a className="actbtn" href="courses.html">开始学习 · 课程直通</a>
          <a className="actbtn ghost" href="../study.html">资料中心 · 全内容</a>
        </div>
      
        <section>
          <h2 className="sec">零基础学堂 · 九大板块第一课</h2>
          <div className="grid">
            <a className="mod red" href="beginner.html">
              <div className="ico">学</div>
              <b>零基础学堂 · 每个板块的第一课</b>
              <div className="desc">九节视频课：世赛 / 算法 / 升学 / 公考 / 经典 / 课程 / 编程 / 考证 / 人文——每课回答「这是什么、今天第一步做什么、学完去哪」，附图文讲义与动手作业。</div>
              <div className="meta">9 节视频 · 分镜脚本可一键再生</div>
            </a>
          </div>
        </section>
      
        <section>
          <h2 className="sec">课程 · 点开即学</h2>
          <div className="grid">
            <a className="mod" href="course-algo.html">
              <div className="ico">算</div>
              <b>算法竞赛 · 从零到精通</b>
              <div className="desc">十三讲：复杂度、排序二分、前缀和、搜索、贪心、动态规划、图论……每讲配有代码与例题，学完即可上手刷题。</div>
              <div className="meta">十三讲 · 零基础可入</div>
            </a>
            <a className="mod green" href="course-python.html">
              <div className="ico">程</div>
              <b>Python 极速入门</b>
              <div className="desc">八日之功，从装环境到提交第一道在线判题；变量、容器、循环、函数、常用库，一一讲清。</div>
              <div className="meta">八讲 · 每日三十分钟</div>
            </a>
            <a className="mod gold" href="course-gongkao.html">
              <div className="ico">行</div>
              <b>公考行测 · 入门六讲</b>
              <div className="desc">得分地图、资料分析速算、图形推理套路、逻辑判断、言语理解、捡分策略，一讲一步。</div>
              <div className="meta">六讲 · 配套三百五十四题题库</div>
            </a>
            <a className="mod red" href="red/maoxuan.html">
              <div className="ico">典</div>
              <b>毛选名篇 · 精读</b>
              <div className="desc">《实践论》《矛盾论》《论持久战》等二百二十九篇全文，离线可读，随手开卷。</div>
              <div className="meta">二百二十九篇 · 全文收录</div>
            </a>
          </div>
        </section>
      
        <section>
          <h2 className="sec">六大门类 · 各取所需</h2>
          <div className="grid">
            <a className="mod" href="contest.html">
              <div className="ico">竞</div>
              <b>竞赛真题</b>
              <div className="desc">Codeforces 一万一千四百题、AtCoder 九千六百题，离线可搜；ICPC 世界总决赛题解、蓝桥杯、天梯赛、CCPC、数学建模。</div>
              <div className="meta">题解一百五十八份 · 真题代码一百六十八份</div>
            </a>
            <a className="mod green" href="exams.html">
              <div className="ico">升</div>
              <b>升学考试</b>
              <div className="desc">高考数学真题卷（内置阅读器）；专升本备考助手（考点、题库、单词本）；国家中小学智慧教育平台直达。</div>
              <div className="meta">从小学到大学</div>
            </a>
            <a className="mod gold" href="gongkao.html">
              <div className="ico">公</div>
              <b>公务员考试</b>
              <div className="desc">图形推理真题三百五十四题，逐题解析；近十年国考省考行测真题大库导航；完整备考次第。</div>
              <div className="meta">行测 · 申论 · 面试</div>
            </a>
            <a className="mod red" href="red.html">
              <div className="ico">红</div>
              <b>红色经典</b>
              <div className="desc">《毛泽东选集》一至五卷全文，二百二十九篇；毛泽东诗词九十首。读原著，学原文，悟原理。</div>
              <div className="meta">离线全文 · 随时可读</div>
            </a>
            <a className="mod" href="socialism.html">
              <div className="ico">研</div>
              <b>社会主义实践 · 研究中心</b>
              <div className="desc">研究生级全领域研究地图：经典文献、党史国史、理论前沿、新闻阵地、数据实证、中国实践、国际比较——全网资源逐条核验，选题库、研究路线、方法论一站直达。</div>
              <div className="meta">七大领域 · 169 条资源 · 可打卡路线</div>
            </a>
            <a className="mod" href="ecommerce.html">
              <div className="ico">创</div>
              <b>电商创业 · 实战中心</b>
              <div className="desc">2026 实价手册：境内六平台与跨境五路径入驻门槛、选品 SOP、运营打法、合规税务（810 号令）、90 天作战地图——关键数字联网核实，随政策更新。</div>
              <div className="meta">境内境外 · 38 条资源 · 可打卡路线</div>
            </a>
            <a className="mod blue" href="skills.html">
              <div className="ico">技</div>
              <b>世界技能大赛 · 全技能库</b>
              <div className="desc">六大领域五十个赛项学习包：项目总纲、图解、总纲课视频、模拟训练（十题交互评分）。</div>
              <div className="meta">五十赛项 · 六十二集视频课</div>
            </a>
            <a className="mod green" href="paths.html">
              <div className="ico">路</div>
              <b>学习路线</b>
              <div className="desc">算法竞赛、公务员、专升本、高考——四份从零到精通的分阶段路线图，步步有检查点。</div>
              <div className="meta">分阶段 · 可照做</div>
            </a>
            <a className="mod gold" href="../library.html">
              <div className="ico">库</div>
              <b>资源总库 · 全网精选</b>
              <div className="desc">近四百条（399 条）免费学习资源：世赛官方标准与真题直链、模拟器与靶场、算法 Wiki 与开源书、MOOC 与开放教材、公考题库、马列古籍全文、IT 文档工具、职业考证与语言——分类可搜，直连与离线性逐条标注。</div>
              <div className="meta">八大门类 · 持续补充</div>
            </a>
            <a className="mod" href="../download.html">
              <div className="ico">下</div>
              <b>全平台下载 · 装进你的设备</b>
              <div className="desc">Android APK、iOS IPA（含电脑签名三路线）、Windows EXE、macOS App、Linux 单文件、Web/PWA——六端同一内容源，离线全量。</div>
              <div className="meta">六端同源 · Releases 直达</div>
            </a>
          </div>
        </section>
      
        <section>
          <h2 className="sec">求学之道 · 前人这样说</h2>
          <div className="card">
            <div className="quote">每个人的自由发展，是一切人自由发展的条件。<span className="src">—— 马克思、恩格斯《共产党宣言》</span></div>
            <div className="quote">你要知道梨子的滋味，你就得变革梨子，亲口吃一吃。<span className="src">—— 毛泽东《实践论》</span></div>
            <div className="quote">读书是学习，使用也是学习，而且是更重要的学习。<span className="src">—— 毛泽东《中国革命战争的战略问题》</span></div>
            <div className="quote">世上无难事，只要肯登攀。<span className="src">—— 毛泽东《水调歌头 · 重上井冈山》</span></div>
          </div>
        </section>
      
        <section>
          <h2 className="sec">官方免费平台 · 备览</h2>
            <div className="card">
            <ul className="list">
              <li><span className="t"><a href="../library.html">全网免费学习资源总库（580 条精选）</a><br /><span className="small">官方平台 · 题库真题 · 电子书库 · 免费软件 · 职业考证 · 数字人文，一页直达</span></span><span className="n">总库</span></li>
              <li><span className="t"><a href="https://basic.smartedu.cn/">国家中小学智慧教育平台</a><br /><span className="small">小学到高中全科名师课程</span></span><span className="n">官方</span></li>
              <li><span className="t"><a href="https://www.nlc.cn/">国家数字图书馆</a><br /><span className="small">免费查阅海量图书文献</span></span><span className="n">官方</span></li>
              <li><span className="t"><a href="https://www.icourse163.org/">中国大学MOOC</a> · <a href="https://www.xuetangx.com/">学堂在线</a><br /><span className="small">大学课程免费学</span></span><span className="n">公开课</span></li>
              <li><span className="t"><a href="https://www.gov.cn/">中国政府网</a><br /><span className="small">政策文件原文查询</span></span><span className="n">官方</span></li>
            </ul>
          </div>
        </section>
      
        <section>
          <h2 className="sec">为什么做知识公社</h2>
          <div className="card">
            <p>知识并不稀缺，稀缺的是「知道去哪找、从哪开始」。</p>
            <p>知识公社做的事很简单：把散落各处的公开资源收拢起来、分好类、写上次第、配上课程，
            装进一个谁都能打开的地方——<b>让信息差小一点，再小一点</b>。</p>
            <p style={{ color: "var(--dim)", fontFamily: "var(--serif)" }}>「我为人人，人人为我。」</p>
            <p className="small">名字的来处见 <a href="about.html">平台简章</a>。</p>
          </div>
        </section>
      
        
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
