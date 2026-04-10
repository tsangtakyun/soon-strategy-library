import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SOON 內部系統 · 策略資料庫',
  description: 'SOON 內部策略與營運工作台',
}

function NavBar() {
  const pillStyle = {
    fontSize: '12px',
    color: '#cdd2f3',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    letterSpacing: '0.03em',
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    whiteSpace: 'nowrap' as const,
  }

  const activePillStyle = {
    ...pillStyle,
    color: '#f7f8ff',
    border: '1px solid rgba(130,126,255,0.45)',
    background: 'linear-gradient(135deg, rgba(111,107,255,0.28), rgba(111,107,255,0.12))',
    boxShadow: '0 12px 28px rgba(111,107,255,0.18)',
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(28, 31, 54, 0.94)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(18px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      height: '64px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: '11px', height: '11px', borderRadius: '999px', background: '#ff7b4d', display: 'inline-block' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '999px', background: '#7b61ff', display: 'inline-block' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '999px', background: '#5e8bff', display: 'inline-block' }} />
        </div>
        <Link href="/strategy-library" style={{ color: '#f7f8ff', fontSize: '15px', fontWeight: 700, fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          SOON Internal
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingLeft: '12px' }}>
        <a href="https://idea-brainstorm.vercel.app" style={pillStyle}>題材</a>
        <a href="https://script-generator-xi.vercel.app" style={pillStyle}>劇本</a>
        <a href="https://soon-storyboard.vercel.app/storyboard" style={pillStyle}>分鏡</a>
        <a href="https://soon-strategy-library.vercel.app/strategy-library" style={activePillStyle}>策略</a>
        <Link href="/marketing-dashboard" style={pillStyle}>Marketing</Link>
        <Link href="/production-dashboard" style={pillStyle}>Production</Link>
      </div>
    </nav>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <body style={{ margin: 0, padding: 0, paddingTop: '64px', background: '#171a2f' }}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
