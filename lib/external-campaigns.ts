type ExternalCampaignRecord = {
  id: string
  contact_name: string
  objective: string
  business_name: string
  whatsapp: string
  email: string
  campaign_title: string
  vertical: string
  budget_range: string
  brief: string
  must_include: string
  payment_status: string
  stripe_customer_email: string
  full_analysis: Record<string, unknown> | null
  created_at: string
}

export type InternalCampaignRecord = ExternalCampaignRecord

export type InternalWorkflow = {
  creatorMatchingConfirmed: boolean
  scriptPlanningConfirmed: boolean
  storyboardPlanningConfirmed: boolean
  deliveryConfirmationConfirmed: boolean
  selectedCreatorTitle: string
  mustHaveShots: string[]
  expectedDeliveryWindow: string
  expectedShootWindow: string
  productionNotes: string
}

export function getInternalWorkflow(fullAnalysis: Record<string, unknown> | null | undefined): InternalWorkflow {
  const workflow = (fullAnalysis?._workflow || {}) as Record<string, unknown>
  const deliveryDraft = (workflow.deliveryConfirmationDraft || {}) as Record<string, unknown>

  return {
    creatorMatchingConfirmed: Boolean(workflow.creatorMatchingConfirmedAt),
    scriptPlanningConfirmed: Boolean(workflow.scriptPlanningConfirmedAt),
    storyboardPlanningConfirmed: Boolean(workflow.storyboardPlanningConfirmedAt),
    deliveryConfirmationConfirmed: Boolean(workflow.deliveryConfirmationConfirmedAt),
    selectedCreatorTitle: typeof workflow.selectedCreatorTitle === 'string' ? workflow.selectedCreatorTitle : '',
    mustHaveShots: Array.isArray(workflow.mustHaveShots) ? workflow.mustHaveShots.filter((item): item is string => typeof item === 'string') : [],
    expectedDeliveryWindow: typeof deliveryDraft.expectedDeliveryWindow === 'string' ? deliveryDraft.expectedDeliveryWindow : '',
    expectedShootWindow: typeof deliveryDraft.expectedShootWindow === 'string' ? deliveryDraft.expectedShootWindow : '',
    productionNotes: typeof deliveryDraft.productionNotes === 'string' ? deliveryDraft.productionNotes : '',
  }
}

export function getMarketingStage(workflow: InternalWorkflow, paymentStatus: string) {
  if (workflow.storyboardPlanningConfirmed) {
    return {
      label: 'Ready For Production Handoff',
      detail: 'Storyboard 已確認，可以交俾製作主任接手。',
    }
  }

  if (workflow.scriptPlanningConfirmed) {
    return {
      label: 'Storyboard Planning',
      detail: 'Script planning 已確認，等待客戶完成 storyboard must-have shots。',
    }
  }

  if (workflow.creatorMatchingConfirmed) {
    return {
      label: 'Script Planning',
      detail: 'Creator direction 已確認，等待客戶補 Part 2 / Part 4。',
    }
  }

  if (paymentStatus === 'paid') {
    return {
      label: 'Creator Matching',
      detail: '已付費解鎖，等待客戶確認 creator archetype。',
    }
  }

  return {
    label: 'Brief / Analysis',
    detail: '等待客戶完成付費解鎖同分析確認。',
  }
}

export function getProductionStage(workflow: InternalWorkflow) {
  if (workflow.deliveryConfirmationConfirmed) {
    return {
      label: 'Delivery Tracking',
      detail: '已鎖 project，等製作主任跟進拍攝、watermarked cut 同尾數。',
    }
  }

  if (workflow.storyboardPlanningConfirmed) {
    return {
      label: 'Waiting Delivery Confirmation',
      detail: 'Storyboard 已完成，等待客戶確認製作與交付安排。',
    }
  }

  return {
    label: 'Not Ready',
    detail: '客戶仲未去到 production handoff 階段。',
  }
}

export function isReadyForProduction(workflow: InternalWorkflow) {
  return workflow.storyboardPlanningConfirmed
}

export async function fetchExternalCampaigns() {
  const url = process.env.EXTERNAL_SUPABASE_URL
  const serviceRoleKey = process.env.EXTERNAL_SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return {
      campaigns: [] as InternalCampaignRecord[],
      error: 'Missing EXTERNAL_SUPABASE_URL or EXTERNAL_SUPABASE_SERVICE_ROLE_KEY',
    }
  }

  const endpoint = `${url}/rest/v1/campaign_intakes?select=id,contact_name,objective,business_name,whatsapp,email,campaign_title,vertical,budget_range,brief,must_include,payment_status,stripe_customer_email,full_analysis,created_at&order=created_at.desc`

  const response = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const text = await response.text()
    return {
      campaigns: [] as InternalCampaignRecord[],
      error: text || 'Unable to load external campaigns',
    }
  }

  const campaigns = await response.json() as InternalCampaignRecord[]

  return {
    campaigns,
    error: '',
  }
}
