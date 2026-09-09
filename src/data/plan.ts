import type { PlanDay } from './types'

/** 2026-09-09 → Day1 … 2026-10-08 → Day30 (Australia/Sydney calendar dates) */
function dateForDay(day: number): string {
  const start = new Date(Date.UTC(2026, 8, 9)) // Sep 9
  start.setUTCDate(start.getUTCDate() + (day - 1))
  const y = start.getUTCFullYear()
  const m = String(start.getUTCMonth() + 1).padStart(2, '0')
  const d = String(start.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const RESTORE = new Set([7, 14, 21, 28])

type Raw = { title: string; items: { id: string; rx: string; note?: string }[] }

const RAW: Raw[] = [
  // —— 第 1 周：打基础 ——
  {
    title: '启动日 · 颈肩唤醒',
    items: [
      { id: 'chin-tuck', rx: '2×8，每次保持 3 秒' },
      { id: 'reformer-row', rx: '5×10（弹力带/器械）' },
      { id: 'wall-slide-plus', rx: '2×8' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
      { id: 'plank', rx: '1 分钟（可分段）' },
    ],
  },
  {
    title: '稳定深化',
    items: [
      { id: 'chin-tuck', rx: '2×10，保持 3 秒' },
      { id: 'open-book', rx: '每侧 2×8' },
      { id: 'serratus-punch', rx: '每侧 2×10' },
      { id: 'wall-slide-plus', rx: '2×8' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
      { id: 'plank', rx: '1 分钟' },
    ],
  },
  {
    title: '胸椎打开',
    items: [
      { id: 'chin-tuck', rx: '2×8，保持 3 秒' },
      { id: 'thoracic-extension', rx: '2×8（泡沫轴，避开颈椎）' },
      { id: 'open-book', rx: '每侧 2×10' },
      { id: 'reformer-row', rx: '4×10' },
      { id: 'dead-bug', rx: '每侧 2×8' },
      { id: 'stretch', rx: '米米拉伸 25–30 分钟' },
    ],
  },
  {
    title: '肩胛启动',
    items: [
      { id: 'gentle-neck-rom', rx: '各方向 5 次，极慢' },
      { id: 'neck-isometric', rx: '四向各 1×5，20–30% 力，保持 5–8 秒' },
      { id: 'wall-pushup-plus', rx: '2×8' },
      { id: 'serratus-punch', rx: '每侧 2×10' },
      { id: 'band-er', rx: '每侧 2×10' },
      { id: 'plank', rx: '1 分钟' },
    ],
  },
  {
    title: '拉力 + 核心',
    items: [
      { id: 'chin-tuck', rx: '3×8，保持 3 秒' },
      { id: 'reformer-row', rx: '5×10' },
      { id: 'wall-slide-plus', rx: '3×8' },
      { id: 'dead-bug', rx: '每侧 2×10' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
      { id: 'plank', rx: '60–75 秒' },
    ],
  },
  {
    title: '综合巩固',
    items: [
      { id: 'open-book', rx: '每侧 2×10' },
      { id: 'thoracic-extension', rx: '2×8' },
      { id: 'scapular-pushup', rx: '2×8' },
      { id: 'band-er', rx: '每侧 2×12' },
      { id: 'serratus-punch', rx: '每侧 2×12' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '恢复日',
    items: [
      { id: 'gentle-neck-rom', rx: '轻柔活动 5 分钟' },
      { id: 'stretch', rx: '轻松拉伸 20–30 分钟（不做高强度）' },
      { id: 'chin-tuck', rx: '可选 1×8，保持 3 秒' },
    ],
  },
  // —— 第 2 周 ——
  {
    title: '进阶启动',
    items: [
      { id: 'chin-tuck', rx: '3×10，保持 3 秒' },
      { id: 'wall-pushup-plus', rx: '3×8' },
      { id: 'reformer-row', rx: '5×12' },
      { id: 'wall-slide-plus', rx: '3×8' },
      { id: 'dead-bug', rx: '每侧 3×8' },
      { id: 'plank', rx: '75 秒' },
    ],
  },
  {
    title: '肩袖关注',
    items: [
      { id: 'neck-isometric', rx: '四向各 2×5，20–30% 力' },
      { id: 'band-er', rx: '每侧 3×10' },
      { id: 'serratus-punch', rx: '每侧 3×10' },
      { id: 'open-book', rx: '每侧 2×10' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
      { id: 'plank', rx: '75 秒' },
    ],
  },
  {
    title: '胸椎 + Plus',
    items: [
      { id: 'chin-tuck', rx: '3×8' },
      { id: 'thoracic-extension', rx: '3×8' },
      { id: 'elevated-pushup-plus', rx: '2×8（桌面垫高）' },
      { id: 'scapular-pushup', rx: '2×10' },
      { id: 'reformer-row', rx: '4×12' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '控制日',
    items: [
      { id: 'gentle-neck-rom', rx: '各方向 6 次' },
      { id: 'wall-slide-plus', rx: '3×10' },
      { id: 'band-er', rx: '每侧 3×12' },
      { id: 'dead-bug', rx: '每侧 3×10' },
      { id: 'plank', rx: '90 秒（可分段）' },
      { id: 'stretch', rx: '拉伸 25 分钟' },
    ],
  },
  {
    title: '力量微进',
    items: [
      { id: 'chin-tuck', rx: '3×10' },
      { id: 'elevated-pushup-plus', rx: '3×8' },
      { id: 'reformer-row', rx: '5×12' },
      { id: 'serratus-punch', rx: '每侧 3×12' },
      { id: 'open-book', rx: '每侧 2×12' },
      { id: 'plank', rx: '90 秒' },
    ],
  },
  {
    title: '周中综合',
    items: [
      { id: 'neck-isometric', rx: '四向各 2×5' },
      { id: 'thoracic-extension', rx: '2×10' },
      { id: 'wall-pushup-plus', rx: '3×10' },
      { id: 'scapular-pushup', rx: '3×8' },
      { id: 'dead-bug', rx: '每侧 3×10' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '恢复日',
    items: [
      { id: 'gentle-neck-rom', rx: '轻柔活动 5–8 分钟' },
      { id: 'stretch', rx: '轻松拉伸 20–30 分钟' },
      { id: 'chin-tuck', rx: '可选 1×10' },
      { id: 'open-book', rx: '可选每侧 1×8' },
    ],
  },
  // —— 第 3 周 ——
  {
    title: '负荷提升',
    items: [
      { id: 'chin-tuck', rx: '3×10，保持 3–5 秒' },
      { id: 'elevated-pushup-plus', rx: '3×10' },
      { id: 'reformer-row', rx: '5×12–15' },
      { id: 'wall-slide-plus', rx: '3×10' },
      { id: 'band-er', rx: '每侧 3×12' },
      { id: 'plank', rx: '90–100 秒' },
    ],
  },
  {
    title: '前锯强化',
    items: [
      { id: 'serratus-punch', rx: '每侧 3×12（三帧清晰）' },
      { id: 'scapular-pushup', rx: '3×10' },
      { id: 'wall-pushup-plus', rx: '3×10' },
      { id: 'thoracic-extension', rx: '3×8' },
      { id: 'dead-bug', rx: '每侧 3×12' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '颈稳 + 拉力',
    items: [
      { id: 'chin-tuck', rx: '3×12' },
      { id: 'neck-isometric', rx: '四向各 2×6，20–30% 力' },
      { id: 'reformer-row', rx: '5×15' },
      { id: 'open-book', rx: '每侧 3×10' },
      { id: 'plank', rx: '100 秒' },
      { id: 'stretch', rx: '拉伸 25–30 分钟' },
    ],
  },
  {
    title: '肩胛耐力',
    items: [
      { id: 'wall-slide-plus', rx: '3×12' },
      { id: 'elevated-pushup-plus', rx: '3×10' },
      { id: 'band-er', rx: '每侧 3×15' },
      { id: 'serratus-punch', rx: '每侧 3×12' },
      { id: 'dead-bug', rx: '每侧 3×12' },
      { id: 'plank', rx: '2×60 秒' },
    ],
  },
  {
    title: '活动度日',
    items: [
      { id: 'gentle-neck-rom', rx: '完整轻柔序列 2 轮' },
      { id: 'thoracic-extension', rx: '3×10' },
      { id: 'open-book', rx: '每侧 3×10' },
      { id: 'chin-tuck', rx: '3×10' },
      { id: 'stretch', rx: '米米拉伸 30 分钟（多给胸椎）' },
      { id: 'plank', rx: '90 秒' },
    ],
  },
  {
    title: '综合力量',
    items: [
      { id: 'elevated-pushup-plus', rx: '3×12' },
      { id: 'reformer-row', rx: '5×15' },
      { id: 'scapular-pushup', rx: '3×12' },
      { id: 'wall-slide-plus', rx: '3×10' },
      { id: 'band-er', rx: '每侧 3×12' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '恢复日',
    items: [
      { id: 'gentle-neck-rom', rx: '轻柔活动 8 分钟' },
      { id: 'stretch', rx: '轻松拉伸 25–30 分钟' },
      { id: 'chin-tuck', rx: '可选 2×8' },
      { id: 'open-book', rx: '可选每侧 1×10' },
    ],
  },
  // —— 第 4 周 ——
  {
    title: '冲刺准备',
    items: [
      { id: 'chin-tuck', rx: '3×12，保持 5 秒' },
      { id: 'elevated-pushup-plus', rx: '4×10' },
      { id: 'reformer-row', rx: '5×15' },
      { id: 'serratus-punch', rx: '每侧 3×15' },
      { id: 'dead-bug', rx: '每侧 3×12' },
      { id: 'plank', rx: '2×60–75 秒' },
    ],
  },
  {
    title: '肩带完整',
    items: [
      { id: 'neck-isometric', rx: '四向各 2×6' },
      { id: 'wall-slide-plus', rx: '3×12' },
      { id: 'wall-pushup-plus', rx: '3×12' },
      { id: 'band-er', rx: '每侧 3×15' },
      { id: 'scapular-pushup', rx: '3×12' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '胸椎高峰',
    items: [
      { id: 'thoracic-extension', rx: '3×10' },
      { id: 'open-book', rx: '每侧 3×12' },
      { id: 'elevated-pushup-plus', rx: '3×12' },
      { id: 'reformer-row', rx: '5×15' },
      { id: 'plank', rx: '2×75 秒' },
      { id: 'stretch', rx: '拉伸 30 分钟' },
    ],
  },
  {
    title: '控制精炼',
    items: [
      { id: 'chin-tuck', rx: '3×12' },
      { id: 'serratus-punch', rx: '每侧 3×15（强调三帧）' },
      { id: 'scapular-pushup', rx: '3×15' },
      { id: 'dead-bug', rx: '每侧 4×10' },
      { id: 'band-er', rx: '每侧 3×15' },
      { id: 'plank', rx: '120 秒累计' },
    ],
  },
  {
    title: '全面巩固',
    items: [
      { id: 'gentle-neck-rom', rx: '1 轮完整' },
      { id: 'wall-slide-plus', rx: '3×12' },
      { id: 'elevated-pushup-plus', rx: '4×10' },
      { id: 'reformer-row', rx: '5×15' },
      { id: 'open-book', rx: '每侧 2×12' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '赛前微调',
    items: [
      { id: 'chin-tuck', rx: '3×10' },
      { id: 'thoracic-extension', rx: '2×10' },
      { id: 'wall-pushup-plus', rx: '3×10' },
      { id: 'serratus-punch', rx: '每侧 3×12' },
      { id: 'dead-bug', rx: '每侧 3×10' },
      { id: 'plank', rx: '90 秒' },
    ],
  },
  {
    title: '恢复日',
    items: [
      { id: 'gentle-neck-rom', rx: '轻柔活动 8–10 分钟' },
      { id: 'stretch', rx: '轻松拉伸 30 分钟' },
      { id: 'chin-tuck', rx: '可选 2×8' },
      { id: 'open-book', rx: '可选每侧 2×8' },
    ],
  },
  // —— 收官 ——
  {
    title: '冲刺日',
    items: [
      { id: 'chin-tuck', rx: '3×12，保持 5 秒' },
      { id: 'elevated-pushup-plus', rx: '4×10' },
      { id: 'reformer-row', rx: '5×15' },
      { id: 'wall-slide-plus', rx: '3×12' },
      { id: 'serratus-punch', rx: '每侧 3×15' },
      { id: 'dead-bug', rx: '每侧 3×12' },
      { id: 'plank', rx: '2×60 秒' },
      { id: 'stretch', rx: '米米拉伸 30 分钟' },
    ],
  },
  {
    title: '毕业日 · Day 30 🎉',
    items: [
      { id: 'chin-tuck', rx: '3×10（仪式感收尾）' },
      { id: 'open-book', rx: '每侧 2×10' },
      { id: 'wall-slide-plus', rx: '2×10' },
      { id: 'elevated-pushup-plus', rx: '3×8' },
      { id: 'reformer-row', rx: '4×12' },
      { id: 'serratus-punch', rx: '每侧 2×12' },
      { id: 'plank', rx: '60–90 秒' },
      { id: 'stretch', rx: '米米拉伸 30 分钟 · 好好庆祝！' },
    ],
  },
]

export const PLAN: PlanDay[] = RAW.map((raw, i) => {
  const day = i + 1
  return {
    day,
    date: dateForDay(day),
    isRestore: RESTORE.has(day),
    title: RESTORE.has(day) ? '恢复日' : raw.title,
    items: raw.items.map((it) => ({
      exerciseId: it.id as PlanDay['items'][0]['exerciseId'],
      prescription: it.rx,
      note: it.note,
    })),
  }
})

export function getDayByNumber(n: number): PlanDay {
  return PLAN[Math.max(0, Math.min(29, n - 1))]
}

export function getTodayDayNumber(now = new Date()): number {
  // Use Australia/Sydney calendar date
  const sydney = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now) // YYYY-MM-DD

  const idx = PLAN.findIndex((d) => d.date === sydney)
  if (idx >= 0) return idx + 1
  if (sydney < PLAN[0].date) return 1
  return 30
}

export function formatSydneyLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d, 2, 0, 0)) // midday-ish Sydney
  const weekday = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Australia/Sydney',
    weekday: 'short',
  }).format(utc)
  return `${m}月${d}日 · ${weekday} · Sydney`
}
