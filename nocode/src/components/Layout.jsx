import { TABS, h } from "../tabs";
function Hero({ kicker = "KNOWLEDGE COMMONS", title, lines = [], motto, badges }) {
  return <header className="kc-hero"><div className="kicker">{kicker}</div><h1>{title}</h1>{lines.map((l, i) => <p key={i}>{l}</p>)}{motto && <div className="motto">{motto}</div>}{badges && <div className="badges">{badges.map((b) => <span key={b}>{b}</span>)}</div>}</header>;
}
function Tabs({ active }) {
  return <nav className="kc-tabs">{TABS.map((t) => <a key={t.href} className={t.label === active ? "on" : ""} href={h(t.href)}>{t.label}</a>)}</nav>;
}
function Footer({ children }) {
  return <footer className="kc-note">{children ?? "\u5185\u5BB9\u6574\u7406\u81EA\u5404\u516C\u5F00\u6E20\u9053\uFF08\u5B98\u65B9\u5E73\u53F0\u3001\u5F00\u6E90\u793E\u533A\u4ED3\u5E93\u7B49\uFF09\uFF0C\u4EC5\u4F9B\u4E2A\u4EBA\u5B66\u4E60\u4EA4\u6D41\u3002"}</footer>;
}
function Layout({ active, children, plain, footer, ...hero }) {
  return <>{!plain && <Hero {...hero} />}<Tabs active={active} /><div className="kc-wrap">{children}</div>{footer !== null && <Footer>{footer}</Footer>}</>;
}
export {
  Footer,
  Hero,
  Layout,
  Tabs
};
