import { fetchExternalCampaigns, getInternalWorkflow, getMarketingStage } from '@/lib/external-campaigns'

function objectiveLabel(objective: string) {
  if (objective === 'sales') return '轉化'
  if (objective === 'reach') return '曝光'
  return '品牌互動'
}

export default async function MarketingDashboardPage() {
  const { campaigns, error } = await fetchExternalCampaigns()
  const paidCampaigns = campaigns.filter((campaign) => campaign.payment_status === 'paid')
  const card = {
    background: 'rgba(34, 38, 68, 0.88)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '26px',
    boxShadow: '0 18px 40px rgba(4, 6, 20, 0.26)',
  } as const

  return (
    <main style={{ minHeight: '100vh', background: '#171a2f', padding: '42px 24px 90px', fontFamily: "'DM Sans', sans-serif", color: '#f5f7ff' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gap: '18px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px' }}>
          <section style={{ ...card, padding: '28px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8e94ba' }}>內部營運</p>
            <h1 style={{ margin: '0 0 12px', fontSize: '50px', lineHeight: 1.02, fontWeight: 600 }}>營運工作台</h1>
            <p style={{ margin: 0, maxWidth: '760px', fontSize: '18px', lineHeight: 1.7, color: '#c9cdec' }}>
              呢頁俾營運主任跟進客戶由需求表到分鏡規劃呢段前半場流程。重點係睇邊啲廣告已付款、卡住喺創作者配對、劇本規劃、分鏡規劃邊一步，仲有邊啲已準備好交接俾製作主任。
            </p>
          </section>

          <section style={{ ...card, padding: '24px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#8e94ba', marginBottom: '10px' }}>重點總覽</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#8e94ba', marginBottom: '6px' }}>已付款廣告</div>
                <div style={{ fontSize: '34px' }}>{paidCampaigns.length}</div>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#8e94ba', marginBottom: '6px' }}>可交接製作</div>
                <div style={{ fontSize: '34px' }}>{paidCampaigns.filter((item) => getInternalWorkflow(item.full_analysis).storyboardPlanningConfirmed).length}</div>
              </div>
            </div>
          </section>
        </section>

        {error ? (
          <section style={{ ...card, padding: '24px', background: 'rgba(88,26,34,0.55)', border: '1px solid rgba(255,120,120,0.22)', color: '#ffc0c0' }}>
            未能讀取外部廣告資料：{error}
            <div style={{ marginTop: '10px' }}>
              請喺 Vercel 內部專案加入：
              <strong> EXTERNAL_SUPABASE_URL </strong>
              同
              <strong> EXTERNAL_SUPABASE_SERVICE_ROLE_KEY</strong>
            </div>
          </section>
        ) : null}

        <section style={{ display: 'grid', gap: '16px' }}>
          {paidCampaigns.map((campaign) => {
            const workflow = getInternalWorkflow(campaign.full_analysis)
            const stage = getMarketingStage(workflow, campaign.payment_status)

            return (
              <section key={campaign.id} style={{ ...card, padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) 320px', gap: '18px', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#8e94ba' }}>{new Date(campaign.created_at).toLocaleDateString('zh-HK')}</div>
                      <div style={{ padding: '6px 10px', borderRadius: '999px', background: 'rgba(90,204,150,0.14)', color: '#8df0b4', fontSize: '11px', letterSpacing: '0.06em' }}>已付費解鎖</div>
                      <div style={{ padding: '6px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: '#c9cdec', fontSize: '11px', letterSpacing: '0.06em' }}>{objectiveLabel(campaign.objective)}</div>
                    </div>
                    <div style={{ fontSize: '34px', lineHeight: 1.06, marginBottom: '8px' }}>{campaign.business_name || '未命名品牌'}</div>
                    <div style={{ fontSize: '17px', lineHeight: 1.7, color: '#c9cdec', marginBottom: '14px' }}>{campaign.campaign_title || '廣告企劃'} · {campaign.vertical} · {stage.label}</div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '12px', color: '#8e94ba', marginBottom: '6px' }}>目前重點</div>
                        <div style={{ lineHeight: 1.7 }}>{stage.detail}</div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '12px', color: '#8e94ba', marginBottom: '6px' }}>客戶資料</div>
                        <div style={{ lineHeight: 1.7 }}>{campaign.contact_name || '-'} · {campaign.email || campaign.stripe_customer_email || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <aside style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { label: '需求表', done: true },
                      { label: 'AI 分析', done: true },
                      { label: '已付款解鎖', done: campaign.payment_status === 'paid' },
                      { label: '創作者配對', done: workflow.creatorMatchingConfirmed },
                      { label: '劇本規劃', done: workflow.scriptPlanningConfirmed },
                      { label: '分鏡規劃', done: workflow.storyboardPlanningConfirmed },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: '16px', borderRadius: '18px', background: item.done ? 'rgba(90,204,150,0.12)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <div style={{ fontSize: '15px', lineHeight: 1.55 }}>{item.label}</div>
                          <div style={{ minWidth: '64px', textAlign: 'center', padding: '6px 10px', borderRadius: '999px', background: item.done ? 'rgba(90,204,150,0.18)' : 'rgba(255,255,255,0.06)', color: item.done ? '#8df0b4' : '#c9cdec', fontSize: '11px', letterSpacing: '0.06em' }}>
                            {item.done ? '完成' : '待跟'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </aside>
                </div>
              </section>
            )
          })}
        </section>
      </div>
    </main>
  )
}
