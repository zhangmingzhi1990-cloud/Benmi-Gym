import { useState } from 'react'
import { EXERCISE_LIST } from '../data/exercises'
import { EXERCISE_SVGS } from '../assets/exercises'
import { ExerciseModal } from './ExerciseModal'
import type { Exercise } from '../data/types'

export function LibraryView() {
  const [modal, setModal] = useState<Exercise | null>(null)

  return (
    <div className="px-3 pb-6">
      <h2 className="mb-3 px-1 text-sm font-semibold text-violet-700">动作图解库</h2>
      <div className="grid grid-cols-1 gap-3">
        {EXERCISE_LIST.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => setModal(ex)}
            className="overflow-hidden rounded-2xl border border-violet-100 bg-white/90 text-left shadow-sm"
          >
            <img
              src={EXERCISE_SVGS[ex.id]}
              alt={ex.name}
              className="h-28 w-full object-cover object-center bg-lavender-50"
            />
            <div className="p-3">
              <div className="font-semibold text-violet-900">{ex.name}</div>
              <div className="text-xs text-violet-400">
                {ex.category} · {ex.frames} 帧示意
              </div>
            </div>
          </button>
        ))}
      </div>
      {modal && <ExerciseModal exercise={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
