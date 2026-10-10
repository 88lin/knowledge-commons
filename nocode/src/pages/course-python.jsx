import { Layout } from "../components/Layout";
import { BiliVideo, biliLink } from "../components/BiliVideo";
import { nav } from "../nav";
import { useKCEnhancer } from "../course-enhance";
function Page() {
  useKCEnhancer("course-python.html");
  return <Layout
    active="课程"
    kicker="PYTHON · ZERO TO RUNNING"
    title="Python 极速入门 · 8 讲"
    lines={["\u96F6\u57FA\u7840\u3001\u6BCF\u5929\u4E00\u8BB2\uFF0C8 \u5929\u5199\u51FA\u81EA\u5DF1\u7684\u5C0F\u7A0B\u5E8F\uFF1B\u6BCF\u8BB2\u90FD\u53EF\u4EE5\u76F4\u63A5\u590D\u5236\u4EE3\u7801\u8FD0\u884C\u3002"]}
  ><div className="card lesson" id="p1"><h3>第 1 讲 · 安装与第一行代码</h3><div className="goal">目标：装好 Python，运行出你的第一个程序。</div><ul><li>到 python.org 下载安装包（勾选 <b>Add to PATH</b>）；安卓手机可装 Pydroid 3 直接练。</li><li>运行第一句：</li></ul><pre><code>print("你好，世界！")
      print(1 + 2)          # 输出 3</code></pre><div className="check">小测：让它输出你自己的名字和今年的年份。</div></div><div className="card lesson" id="p2"><h3>第 2 讲 · 变量与运算</h3><div className="goal">目标：会用变量保存数据，会做基本计算。</div><pre><code>name = "小明"        # 文字（字符串）
      age = 18             # 整数
      height = 1.75        # 小数
      is_student = True    # 布尔
      print(age + 1)       # 19
      print(age * 2, age / 2, age // 2, age % 2)  # 36 9.0 9 0
      print(f"&#123;name&#125;今年&#123;age&#125;岁")  # f-string 拼接（重点）</code></pre><div className="check">小测：让用户输入两个数（input），输出两数之和与平均值。</div></div><div className="card lesson" id="p3"><h3>第 3 讲 · 输入输出与字符串</h3><pre><code>s = input()              # 读一行文字
      n = int(input())         # 读一个整数
      a, b = map(int, input().split())   # 读两个整数
      print(s.upper())         # 全大写
      print(len(s))            # 长度
      print(s[0], s[-1])       # 第一个 / 最后一个字符
      print(s[1:4])            # 切片：第 1~3 个字符
      print(s.replace("a", "b"))       # 替换
      print(",".join(["甲","乙","丙"])) # 甲,乙,丙</code></pre><div className="check">小测：输入一句话，输出它的长度、全大写形式和反转（s[::-1]）。</div></div><div className="card lesson" id="p4"><h3>第 4 讲 · 列表、字典、集合</h3><div className="goal">目标：三大容器装满你的数据。</div><pre><code>a = [3, 1, 2]            # 列表
      a.append(4)              # 追加 → [3,1,2,4]
      a.sort()                 # 排序 → [1,2,3,4]
      print(sum(a), max(a), min(a))
      
      d = &#123;"语文": 90, "数学": 95&#125;   # 字典（键值对）
      d["英语"] = 88
      print(d["数学"])          # 95
      for k, v in d.items(): print(k, v)
      
      s = &#123;1, 2, 2, 3&#125;          # 集合（自动去重）
      print(len(s))             # 3</code></pre><div className="check">小测：把一段文字中出现的单词统计出现次数（提示：字典计数）。</div></div><div className="card lesson" id="p5"><h3>第 5 讲 · 条件与循环</h3><pre><code># 判断
      score = 85
      if score &gt;= 90:
          print("优秀")
      elif score &gt;= 60:
          print("及格")
      else:
          print("加油")
      
      # 循环
      for i in range(1, 6):     # 1 2 3 4 5
          print(i)
      total = 0
      for x in [1, 2, 3, 4]:
          total += x
      print(total)              # 10
      # while：不知道循环几次时用
      n = 100
      while n &gt; 1:
          n = n // 2
      print("折半次数到 1")</code></pre><div className="check">小测：输出 1–100 里所有 3 的倍数；再用循环求 1+2+...+100。</div></div><div className="card lesson" id="p6"><h3>第 6 讲 · 函数与递归</h3><pre><code>def add(a, b):            # 定义函数
          return a + b
      print(add(2, 3))          # 5
      
      def fib(n):               # 递归：斐波那契
          if n &lt;= 2: return 1
          return fib(n-1) + fib(n-2)
      print(fib(10))            # 55</code></pre><div className="check">小测：写函数判断一个数是不是质数；写递归求 n 的阶乘。</div></div><div className="card lesson" id="p7"><h3>第 7 讲 · 文件、异常与常用库</h3><pre><code># 读写文件
      with open("note.txt", "w", encoding="utf-8") as f:
          f.write("今天学完了第 7 讲！")
      with open("note.txt", encoding="utf-8") as f:
          print(f.read())
      
      # 异常处理
      try:
          x = int(input())
      except ValueError:
          print("输入的不是数字")
      
      # 常用库
      import random
      print(random.randint(1, 6))   # 掷骰子
      import math
      print(math.sqrt(2))           # 1.414...
      import datetime
      print(datetime.date.today())</code></pre><div className="check">小测：做一个"随机出题的口算练习器"，把每次成绩追加写进文件。</div></div><div className="card lesson" id="p8"><h3>第 8 讲 · 用 Python 刷题（衔接竞赛课）</h3><div className="goal">目标：把前面七讲用起来，开始在线判题。</div><ul><li>刷题输入输出常用写法：</li></ul><pre><code>n = int(input())
      a = list(map(int, input().split()))
      print(sum(a), max(a))</code></pre><ul><li>去 <a href="#/learn/contest">本站题库索引</a> 或 Codeforces 找一个 800 分题，用 Python 提交。</li><li>Python 慢一点没关系，先用它把"会做"练出来；以后想更快再换 C++（算法课里有）。</li></ul><div className="check">毕业小测：连续 7 天每天用 Python 做 1 道题并提交通过。</div></div></Layout>;
}
export default Page;
