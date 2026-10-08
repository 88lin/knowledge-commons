import type { ReactNode } from 'react'
import { TABS, h } from '../tabs'

export interface HeroProps {
  kicker?: string
  title?: string
  lines?: string[]
  motto?: ReactNode
  badges?: string[]
}

export function Hero({ kicker = 'KNOWLEDGE COMMONS', title, lines = [], motto, badges }: HeroProps) {
  return (
    <header className="kc-hero">
      <div className="kicker">{kicker}</div>
      <h1>{title}</h1>
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
      {motto && <div className="motto">{motto}</div>}
      {badges && (
        <div className="badges">
          {badges.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      )}
    </header>
  )
}

export function Tabs({ active }: { active?: string }) {
  return (
    <nav className="kc-tabs">
      {TABS.map((t) => (
        <a key={t.href} className={t.label === active ? 'on' : ''} href={h(t.href)}>
          {t.label}
        </a>
      ))}
    </nav>
  )
}

export function Footer({ children }: { children?: ReactNode }) {
  return (
    <footer className="kc-note">
      {children ??
        '内容整理自各公开渠道（官方平台、开源社区仓库等），仅供个人学习交流。'}
    </footer>
  )
}

export interface LayoutProps extends Omit<HeroProps, 'title'> {
  title?: string
  active?: string
  children: ReactNode
  /** 不显示 hero（部分子页只有标题） */
  plain?: boolean
  footer?: ReactNode
}

/** 门户页面统一骨架：顶栏 + 院名区 + 签条导航 + 版心 */
export function Layout({ active, children, plain, footer, ...hero }: LayoutProps) {
  return (
    <>
      {!plain && <Hero {...hero} />}
      <Tabs active={active} />
      <div className="kc-wrap">{children}</div>
      {footer !== null && <Footer>{footer}</Footer>}
    </>
  )
}
