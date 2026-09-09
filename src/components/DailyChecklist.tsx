import { useState } from 'react'
import type { CoupleState, PlanDay } from '../data/types'
import { EXERCISES } from '../data/exercises'
import { formatSydneyLabel } from '../data/plan'
import { isItemChecked } from '../lib/sync'
import { ExerciseModal } from './ExerciseModal'
import type { Exercise } from '../data/types'

interface Props {
  day: PlanDay
  state: CoupleState
  onToggle: (exerciseId: string) => void
}

export function DailyChecklist({ day, state, onToggle }: Props) {
  const [modal, setModal] = useState<Exercise | null>(null)
  const selfId = state.profiles.selfId
  const partnerId = state.profiles.partnerId
  const self = state.profiles.self
  const partner = state.profiles.partner

  const selfDone = day.items.filter((it) => isItemChecked(state, day.day, selfId, it.exerciseId)).length
  const partnerDone = day.items.filter((it) =>
    isItemChecked(state, day.day, partnerId, it.exerciseId),
  ).length
  const total = day.items.length

  return (
    <div className="px-3 pb-4">
      <div className="mb-3 rounded-3xl bg-white/85 p-4 shadow-md shadow-violet-100/80 backdrop-blur">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">
                Day {day.day}
              </span>
              {day.isRestore && (
                <span className="rounded-full bg-teal-soft-bg px-2 py-0.5 text-xs font-medium text-teal-700">
                  恢复日
                </span>
              )}
            </div>
            <h2 className="mt-1.5 text-base font-bold text-violet-900">{day.title}</h2>
            <p className="mt-0.5 text-xs text-violet-400">{formatSydneyLabel(day.date)}</p>
          </div>
          <div className="text-right text-xs text-violet-500">
            <div>
              {self.emoji} {selfDone}/{total}
            </div>
            <div>
              {partner.emoji} {partnerDone}/{total}
            </div>
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {day.items.map((item) => {
          const ex = EXERCISES[item.exerciseId]
          const mine = isItemChecked(state, day.day, selfId, item.exerciseId)
          const theirs = isItemChecked(state, day.day, partnerId, item.exerciseId)
          return (
            <li
              key={item.exerciseId}
              className={`rounded-2xl border bg-white/90 p-3 shadow-sm transition ${
                mine ? 'border-teal-200 bg-teal-soft-bg/50' : 'border-violet-100'
              }`}
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label={mine ? '取消完成' : '标记完成'}
                  onClick={() => onToggle(item.exerciseId)}
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-sm transition ${
                    mine
                      ? 'border-teal-400 bg-teal-400 text-white'
                      : 'border-violet-200 bg-white text-transparent'
                  }`}
                >
                  ✓
                </button>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => ex && setModal(ex)}
                  >
                    <div className="font-semibold text-violet-900">{ex?.name || item.exerciseId}</div>
                    <div className="mt-0.5 text-xs text-violet-500">{item.prescription}</div>
                  </button>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className={mine ? 'text-teal-600' : 'text-violet-300'}>
                      {self.emoji} {mine ? '已打卡' : '未打卡'}
                    </span>
                    <span className={theirs ? 'text-pink-500' : 'text-violet-300'}>
                      {partner.emoji} {theirs ? '已打卡' : '未打卡'}
                    </span>
                    <button
                      type="button"
                      onClick={() => ex && setModal(ex)}
                      className="ml-auto text-violet-400 underline-offset-2 hover:underline"
                    >
                      看图解
                    </button>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {modal && <ExerciseModal exercise={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
