import { fetchExternalCampaigns, getInternalWorkflow, getProductionStage, isReadyForProduction } from '@/lib/external-campaigns'

export default async function ProductionDashboardPage() {
  const { campaigns, error } = await fetchExternalCampaigns()
  const productionCampaigns = campaigns.filter((campaign) => isReadyForProduction(getInternalWorkflow(campaign.full_analysis)))

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f1e8 0%, #ece3d6 100%)', padding: '42px 24px 90px', fontFamily: 'Georgia, Times New Roman, serif', color: '#1a1a18' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gap: '18px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px' }}>
          <section style={{ padding: '28px', borderRadius: '28px', background: 'rgba(255,255,255,0.76)', border: '1px solid rgba(26,26,24,0.10)' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.18em', color: '#8b7c69' }}>INTERNAL OPS</p>
            <h1 style={{ margin: '0 0 12px', fontSize: '50px', lineHeight: 1.02, fontWeight: 500 }}>製作主任 Dashboard</h1>
            <p style={{ margin: 0, maxWidth: '760px', fontSize: '18px', lineHeight: 1.7, color: '#5b5348' }}>
              呢頁俾製作主任接手已經完成 storyboard planning 嘅 campaign。重點係睇邊啲 project 已鎖定、等 WhatsApp 跟進拍攝細節、等 watermarked cut、等尾數，最後先交 final version。
            </p>
          </section>

          <section style={{ padding: '24px', borderRadius: '28px', background: 'rgba(29,29,27,0.94)', color: '#f5f0e6' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#b8b0a2', marginBottom: '10px' }}>AT A GLANCE</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#c7bdaf', marginBottom: '6px' }}>READY TO TAKE OVER</div>
                <div style={{ fontSize: '34px' }}>{productionCampaigns.length}</div>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#c7bdaf', marginBottom: '6px' }}>LOCKED PROJECTS</div>
                <div style={{ fontSize: '34px' }}>{productionCampaigns.filter((item) => getInternalWorkflow(item.full_analysis).deliveryConfirmationConfirmed).length}</div>
              </div>
            </div>
          </section>
        </section>

        {error ? (
          <section style={{ padding: '24px', borderRadius: '24px', background: '#fbf2df', border: '1px solid rgba(26,26,24,0.10)', color: '#5a5349' }}>
            未能讀取 external campaign data：{error}
            <div style={{ marginTop: '10px' }}>
              請喺 Vercel / internal project 加：
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
              <section key={campaign.id} style={{ padding: '24px', borderRadius: '26px', background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(26,26,24,0.10)', boxShadow: '0 20px 50px rgba(26,26,24,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) 330px', gap: '18px', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ fontSize: '12px', letterSpacing: '0.14em', color: '#8b7c69' }}>{new Date(campaign.created_at).toLocaleDateString('zh-HK')}</div>
                      <div style={{ padding: '6px 10px', borderRadius: '999px', background: workflow.deliveryConfirmationConfirmed ? '#eef5e8' : '#f7f1e1', color: '#5c5a35', fontSize: '11px', letterSpacing: '0.06em' }}>
                        {workflow.deliveryConfirmationConfirmed ? '已鎖定 project' : '等客確認交付安排'}
                      </div>
                    </div>
                    <div style={{ fontSize: '34px', lineHeight: 1.06, marginBottom: '8px' }}>{campaign.business_name || '未命名品牌'}</div>
                    <div style={{ fontSize: '17px', lineHeight: 1.7, color: '#5b5348', marginBottom: '14px' }}>{campaign.campaign_title || 'Campaign'} · {stage.label}</div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                        <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>目前重點</div>
                        <div style={{ lineHeight: 1.7 }}>{stage.detail}</div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                        <div style={{ fontSize: '12px', color: '#8b7c69', marginBottom: '6px' }}>拍攝 / 交付期望</div>
                        <div style={{ lineHeight: 1.7 }}>
                          <div><strong>拍攝：</strong> {workflow.expectedShootWindow || '待確認'}</div>
                          <div><strong>水印 cut：</strong> {workflow.expectedDeliveryWindow || '待確認'}</div>
                        </div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '16px', background: '#f3ead7', border: '1px solid rgba(26,26,24,0.08)', lineHeight: 1.7, color: '#4f493f' }}>
                        <strong>製作備註：</strong> {workflow.productionNotes || '暫未填寫'}
                      </div>
                    </div>
                  </div>

                  <aside style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { label: 'Storyboard Ready', done: workflow.storyboardPlanningConfirmed },
                      { label: 'Delivery Confirmed', done: workflow.deliveryConfirmationConfirmed },
                      { label: 'WhatsApp Handoff', done: workflow.deliveryConfirmationConfirmed },
                      { label: 'Watermarked Cut', done: false },
                      { label: 'Full Payment', done: false },
                      { label: 'Final Delivery', done: false },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: '16px', borderRadius: '18px', background: item.done ? '#f1f5eb' : '#fbf8f1', border: '1px solid rgba(26,26,24,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <div style={{ fontSize: '15px', lineHeight: 1.55 }}>{item.label}</div>
                          <div style={{ minWidth: '64px', textAlign: 'center', padding: '6px 10px', borderRadius: '999px', background: item.done ? '#dbe7d0' : 'rgba(26,26,24,0.06)', color: '#4f5b41', fontSize: '11px', letterSpacing: '0.06em' }}>
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
