import type { CoupleState } from '../data/types'
import { PLAN } from '../data/plan'
import { dayCompletion } from '../lib/sync'

interface Props {
  state: CoupleState
  selectedDay: number
  onSelect: (day: number) => void
}

export function CalendarView({ state, selectedDay, onSelect }: Props) {
  const selfId = state.profiles.selfId
  const partnerId = state.profiles.partnerId

  return (
    <div className="px-3 pb-6">
      <h2 className="mb-2 px-1 text-sm font-semibold text-violet-700">30 天总览</h2>
      <p className="mb-3 px-1 text-xs text-violet-400">
        外环 {state.profiles.self.emoji} · 内点 {state.profiles.partner.emoji} · 恢复日有叶子标记
      </p>
      <div className="grid grid-cols-5 gap-2">
        {PLAN.map((d) => {
          const selfPct = dayCompletion(state, d.day, selfId, d.items.length)
          const partnerPct = dayCompletion(state, d.day, partnerId, d.items.length)
          const selected = selectedDay === d.day
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => onSelect(d.day)}
              className={`relative rounded-2xl border p-2 text-center transition ${
                selected
                  ? 'border-violet-400 bg-lavender-100 shadow-md'
                  : 'border-violet-100 bg-white/80'
              }`}
            >
              <div className="text-[10px] font-bold text-violet-400">D{d.day}</div>
              {d.isRestore && <div className="absolute right-1 top-1 text-[9px]">🍃</div>}
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{ width: `${selfPct}%` }}
                />
              </div>
              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-pink-100">
                <div
                  className="h-full rounded-full bg-pink-300"
                  style={{ width: `${partnerPct}%` }}
                />
              </div>
              <div className="mt-1 text-[9px] text-violet-400">
                {selfPct}/{partnerPct}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
