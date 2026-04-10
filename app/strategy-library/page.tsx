'use client'

import { useEffect, useState } from 'react'

import { defaultStrategyLibrary, type StrategyItem, type StrategyLibraryState } from '@/lib/strategy-library'

const STORAGE_KEY = 'soon-strategy-library-v1'

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}`
}

function sectionTitle(title: string, subtitle: string) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '12px', letterSpacing: '0.15em', color: '#8e94ba', marginBottom: '6px' }}>{subtitle}</div>
      <h2 style={{ margin: 0, fontSize: '30px', fontWeight: 600, color: '#f5f7ff' }}>{title}</h2>
    </div>
  )
}

function emptyItem(prefix: string): StrategyItem {
  return { id: makeId(prefix), name: '', summary: '', fitFor: '' }
}

export default function StrategyLibraryPage() {
  const [library, setLibrary] = useState<StrategyLibraryState>(defaultStrategyLibrary)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setLibrary(JSON.parse(raw) as StrategyLibraryState)
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
  }, [library, loaded])

  function updateItem(section: keyof StrategyLibraryState, id: string, patch: Partial<StrategyItem>) {
    setLibrary((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => item.id === id ? { ...item, ...patch } : item),
    }))
  }

  function addItem(section: keyof StrategyLibraryState, prefix: string) {
    setLibrary((prev) => ({
      ...prev,
      [section]: [...prev[section], emptyItem(prefix)],
    }))
  }

  function removeItem(section: keyof StrategyLibraryState, id: string) {
    setLibrary((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }))
  }

  function resetLibrary() {
    setLibrary(defaultStrategyLibrary)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  function renderSection(section: keyof StrategyLibraryState, title: string, subtitle: string, addLabel: string, prefix: string) {
    return (
      <section style={{
        background: 'rgba(34, 38, 68, 0.88)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '22px',
        boxShadow: '0 18px 40px rgba(4, 6, 20, 0.26)',
      }}>
        {sectionTitle(title, subtitle)}
        <div style={{ display: 'grid', gap: '14px' }}>
          {library[section].map((item) => (
            <div key={item.id} style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'start', marginBottom: '10px' }}>
                <input
                  value={item.name}
                  onChange={(e) => updateItem(section, item.id, { name: e.target.value })}
                  placeholder="名稱"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#f5f7ff', fontSize: '15px', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => removeItem(section, item.id)}
                  style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'transparent', color: '#c9cdec', borderRadius: '999px', padding: '10px 14px', cursor: 'pointer' }}
                >
                  刪除
                </button>
              </div>
              <textarea
                value={item.summary}
                onChange={(e) => updateItem(section, item.id, { summary: e.target.value })}
                placeholder="一句講清楚呢個策略形態、內容角度或交付組合係咩。"
                style={{ width: '100%', minHeight: '82px', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#f5f7ff', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', marginBottom: '10px' }}
              />
              <textarea
                value={item.fitFor}
                onChange={(e) => updateItem(section, item.id, { fitFor: e.target.value })}
                placeholder="適合邊啲廣告目標、預算規模與合作情境。"
                style={{ width: '100%', minHeight: '72px', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: '#f5f7ff', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => addItem(section, prefix)}
          style={{ marginTop: '14px', border: '1px solid rgba(130,126,255,0.48)', borderRadius: '999px', padding: '12px 18px', background: 'linear-gradient(135deg,#7b61ff,#5e8bff)', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
        >
          {addLabel}
        </button>
      </section>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#171a2f',
      padding: '42px 24px 90px',
      fontFamily: "'DM Sans', sans-serif",
      color: '#f5f7ff',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '18px', marginBottom: '22px' }}>
          <div style={{ padding: '28px', borderRadius: '28px', background: 'rgba(34, 38, 68, 0.88)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8e94ba' }}>內部系統</p>
            <h1 style={{ margin: '0 0 12px', fontSize: '50px', lineHeight: 1.02, fontWeight: 600 }}>
              策略資料庫
            </h1>
            <p style={{ margin: 0, maxWidth: '760px', fontSize: '18px', lineHeight: 1.7, color: '#c9cdec' }}>
              呢頁俾 SOON 內部團隊定義同調整預算形態、內容角度同交付組合，之後 AI 分析就可以由同一套內部資料庫生出嚟。
            </p>
          </div>

          <div style={{ padding: '24px', borderRadius: '28px', background: 'rgba(34, 38, 68, 0.96)', color: '#f5f0e6', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#8e94ba', marginBottom: '10px' }}>使用方式</div>
            <div style={{ display: 'grid', gap: '10px', fontSize: '15px', lineHeight: 1.7 }}>
              <div>1. 先整理你想保留嘅預算策略類型</div>
              <div>2. 再定義常用內容角度類別</div>
              <div>3. 最後設定交付組合</div>
              <div>4. 之後再接回 AI 提示詞與資料持久化</div>
            </div>
            <button
              type="button"
              onClick={resetLibrary}
              style={{ marginTop: '18px', border: '1px solid rgba(255,255,255,0.20)', borderRadius: '999px', padding: '12px 16px', background: 'transparent', color: '#f5f0e6', cursor: 'pointer' }}
            >
              重設為預設資料庫
            </button>
          </div>
        </section>

        <div style={{ display: 'grid', gap: '18px' }}>
          {renderSection('budgetShapes', '預算形態', '預算策略', '新增預算形態', 'budget')}
          {renderSection('angleTypes', '內容角度', '內容策略', '新增內容角度', 'angle')}
          {renderSection('deliverableShapes', '交付組合', '交付配置', '新增交付組合', 'deliverable')}
        </div>
      </div>
    </main>
  )
}
