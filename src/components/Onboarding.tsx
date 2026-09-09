import { useState } from 'react'
import type { Profile } from '../data/types'

const PRESETS: Profile[] = [
  { id: 'mimi', name: '米米', emoji: '🌸' },
  { id: 'benben', name: '笨笨', emoji: '🐻' },
]

interface Props {
  onDone: (self: Profile, partner: Profile) => void
}

export function Onboarding({ onDone }: Props) {
  const [selfIdx, setSelfIdx] = useState(0)
  const [customSelf, setCustomSelf] = useState('')
  const [customPartner, setCustomPartner] = useState('')

  const selfPreset = PRESETS[selfIdx]
  const partnerPreset = PRESETS[1 - selfIdx]

  const submit = () => {
    const self: Profile = {
      ...selfPreset,
      name: customSelf.trim() || selfPreset.name,
    }
    const partner: Profile = {
      ...partnerPreset,
      name: customPartner.trim() || partnerPreset.name,
    }
    onDone(self, partner)
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-5 py-8 animate-float">
      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl">💜</div>
        <h1 className="text-2xl font-bold tracking-wide text-violet-800">米米打卡</h1>
        <p className="mt-2 text-sm text-violet-600/80">
          米米专属偏头痛与颈肩辅助训练 · 30 天
        </p>
        <p className="mt-1 text-xs text-violet-400">2026-09-09 → 2026-10-08 · Australia/Sydney</p>
      </div>

      <div className="rounded-3xl bg-white/80 p-5 shadow-lg shadow-violet-100 backdrop-blur">
        <p className="mb-3 text-sm font-medium text-violet-700">我是谁？</p>
        <div className="mb-4 grid grid-cols-2 gap-3">
          {PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelfIdx(i)}
              className={`rounded-2xl border-2 px-3 py-4 text-center transition ${
                selfIdx === i
                  ? 'border-violet-400 bg-lavender-100 shadow-md'
                  : 'border-violet-100 bg-white'
              }`}
            >
              <div className="text-2xl">{p.emoji}</div>
              <div className="mt-1 font-semibold text-violet-800">{p.name}</div>
            </button>
          ))}
        </div>

        <label className="mb-1 block text-xs text-violet-500">自定义我的昵称（可选）</label>
        <input
          className="mb-3 w-full rounded-xl border border-violet-200 bg-lavender-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
          placeholder={selfPreset.name}
          value={customSelf}
          onChange={(e) => setCustomSelf(e.target.value)}
        />

        <label className="mb-1 block text-xs text-violet-500">另一半昵称（可选）</label>
        <input
          className="mb-4 w-full rounded-xl border border-violet-200 bg-lavender-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
          placeholder={partnerPreset.name}
          value={customPartner}
          onChange={(e) => setCustomPartner(e.target.value)}
        />

        <p className="mb-4 rounded-xl bg-teal-soft-bg px-3 py-2 text-xs text-teal-800">
          搭档将显示为：{customPartner.trim() || partnerPreset.name} {partnerPreset.emoji}
        </p>

        <button
          type="button"
          onClick={submit}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-pink-300 py-3.5 text-sm font-semibold text-white shadow-md active:scale-[0.98]"
        >
          开始 30 天打卡
        </button>
      </div>
    </div>
  )
}
