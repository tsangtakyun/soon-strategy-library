import { fetchExternalCampaigns, getInternalWorkflow, getProductionStage, isReadyForProduction } from '@/lib/external-campaigns'

export default async function ProductionDashboardPage() {
  const { campaigns, error } = await fetchExternalCampaigns()
  const productionCampaigns = campaigns.filter((campaign) => isReadyForProduction(getInternalWorkflow(campaign.full_analysis)))
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
            <h1 style={{ margin: '0 0 12px', fontSize: '50px', lineHeight: 1.02, fontWeight: 600 }}>製作工作台</h1>
            <p style={{ margin: 0, maxWidth: '760px', fontSize: '18px', lineHeight: 1.7, color: '#c9cdec' }}>
              呢頁俾製作主任接手已完成分鏡規劃嘅廣告。重點係睇邊啲專案已鎖定、等 WhatsApp 跟進拍攝細節、等水印版本、等尾數，最後先交正式版本。
            </p>
          </section>

          <section style={{ ...card, padding: '24px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#8e94ba', marginBottom: '10px' }}>重點總覽</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#8e94ba', marginBottom: '6px' }}>可接手製作</div>
                <div style={{ fontSize: '34px' }}>{productionCampaigns.length}</div>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#8e94ba', marginBottom: '6px' }}>已鎖定專案</div>
                <div style={{ fontSize: '34px' }}>{productionCampaigns.filter((item) => getInternalWorkflow(item.full_analysis).deliveryConfirmationConfirmed).length}</div>
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
          {productionCampaigns.map((campaign) => {
            const workflow = getInternalWorkflow(campaign.full_analysis)
            const stage = getProductionStage(workflow)

            return (
              <section key={campaign.id} style={{ ...card, padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) 330px', gap: '18px', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#8e94ba' }}>{new Date(campaign.created_at).toLocaleDateString('zh-HK')}</div>
                      <div style={{ padding: '6px 10px', borderRadius: '999px', background: workflow.deliveryConfirmationConfirmed ? 'rgba(90,204,150,0.14)' : 'rgba(255,210,120,0.14)', color: workflow.deliveryConfirmationConfirmed ? '#8df0b4' : '#f0d08d', fontSize: '11px', letterSpacing: '0.06em' }}>
                        {workflow.deliveryConfirmationConfirmed ? '已鎖定 project' : '等客確認交付安排'}
                      </div>
                    </div>
                    <div style={{ fontSize: '34px', lineHeight: 1.06, marginBottom: '8px' }}>{campaign.business_name || '未命名品牌'}</div>
                    <div style={{ fontSize: '17px', lineHeight: 1.7, color: '#c9cdec', marginBottom: '14px' }}>{campaign.campaign_title || '廣告企劃'} · {stage.label}</div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '12px', color: '#8e94ba', marginBottom: '6px' }}>目前重點</div>
                        <div style={{ lineHeight: 1.7 }}>{stage.detail}</div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '12px', color: '#8e94ba', marginBottom: '6px' }}>拍攝 / 交付期望</div>
                        <div style={{ lineHeight: 1.7 }}>
                          <div><strong>拍攝：</strong> {workflow.expectedShootWindow || '待確認'}</div>
                          <div><strong>水印版本：</strong> {workflow.expectedDeliveryWindow || '待確認'}</div>
                        </div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.7, color: '#c9cdec' }}>
                        <strong>製作備註：</strong> {workflow.productionNotes || '暫未填寫'}
                      </div>
                    </div>
                  </div>

                  <aside style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { label: '分鏡已完成', done: workflow.storyboardPlanningConfirmed },
                      { label: '交付已確認', done: workflow.deliveryConfirmationConfirmed },
                      { label: 'WhatsApp 交接', done: workflow.deliveryConfirmationConfirmed },
                      { label: '水印版本', done: false },
                      { label: '尾數付款', done: false },
                      { label: '正式交付', done: false },
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
