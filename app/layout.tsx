import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SOON Strategy Library',
  description: 'SOON internal campaign strategy planning tool',
}

function NavBar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: '#F5F2EC',
      borderBottom: '1px solid #e0ddd6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: '54px',
      fontFamily: 'Georgia, Times New Roman, serif',
    }}>
      <Link href="/strategy-library" style={{ fontSize: '13px', letterSpacing: '0.16em', color: '#888', textDecoration: 'none' }}>
        SOON INTERNAL
      </Link>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <a href="https://idea-brainstorm.vercel.app" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Idea Collection
        </a>
        <a href="https://script-generator-xi.vercel.app" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Script Generator
        </a>
        <a href="https://soon-storyboard.vercel.app/storyboard" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Shooting Guideline
        </a>
        <Link href="/marketing-dashboard" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Marketing Dashboard
        </Link>
        <Link href="/production-dashboard" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Production Dashboard
        </Link>
        <Link href="/strategy-library" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '6px 14px', borderBottom: '1px solid #1a1a1a', letterSpacing: '0.03em' }}>
          Strategy Library
        </Link>
      </div>
    </nav>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <body style={{ margin: 0, padding: 0, paddingTop: '54px', background: '#f5f0e6' }}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
