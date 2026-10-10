const TABS = [
  { label: "\u9996\u9875", href: "/learn/index.html" },
  { label: "\u5B66\u5802", href: "/learn/beginner.html" },
  { label: "\u65E5\u5386", href: "/learn/calendar.html" },
  { label: "\u603B\u76EE", href: "/learn/archive.html" },
  { label: "\u8BFE\u7A0B", href: "/learn/courses.html" },
  { label: "\u7ADE\u8D5B", href: "/learn/contest.html" },
  { label: "\u5347\u5B66", href: "/learn/exams.html" },
  { label: "\u516C\u8003", href: "/learn/gongkao.html" },
  { label: "\u4E16\u8D5B", href: "/learn/skills.html" },
  { label: "\u7EA2\u8272", href: "/learn/red.html" },
  { label: "\u5B9E\u8DF5", href: "/learn/socialism.html" },
  { label: "\u521B\u4E1A", href: "/learn/ecommerce.html" },
  { label: "\u8DEF\u7EBF", href: "/learn/paths.html" },
  { label: "\u8D44\u6E90", href: "/library.html" },
  { label: "\u7B80\u7AE0", href: "/learn/about.html" }
];
const BASE = import.meta.env.BASE_URL;
// SPA(HashRouter): 页面路由去掉 .html,链接走 "/#/..." 形式,避免点击后整页跳到不存在的静态 .html
const ROUTE = (path) => path.replace(/\.html$/, "");
const h = (path) => BASE + "#" + ROUTE(path);
export {
  BASE,
  TABS,
  h
};
