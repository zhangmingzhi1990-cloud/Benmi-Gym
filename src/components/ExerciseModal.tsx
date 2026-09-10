import type { Exercise } from '../data/types'
import { EXERCISE_SVGS } from '../assets/exercises'

interface Props {
  exercise: Exercise
  onClose: () => void
}

export function ExerciseModal({ exercise, onClose }: Props) {
  const src = EXERCISE_SVGS[exercise.id]
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-violet-950/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal
    >
      <div
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl sm:rounded-3xl animate-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-violet-900">{exercise.name}</h2>
            <p className="text-xs text-violet-400">
              {exercise.nameEn} · {exercise.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-lavender-100 px-3 py-1 text-sm text-violet-600"
          >
            关闭
          </button>
        </div>

        {exercise.videoUrl ? (
          <div className="mb-4 overflow-hidden rounded-2xl border border-violet-100 bg-black">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${exercise.videoUrl}?rel=0`}
                title={`${exercise.name} 教学视频`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="bg-violet-50 px-3 py-2 text-[11px] text-violet-500">
              真人教学视频（YouTube）。网络需可访问 YouTube。
            </p>
          </div>
        ) : (
          <img
            src={src}
            alt={exercise.name}
            className="mb-4 w-full rounded-2xl border border-violet-100 bg-lavender-50"
          />
        )}

        <h3 className="mb-2 text-sm font-semibold text-violet-700">动作要点</h3>
        <ul className="space-y-2 text-sm leading-relaxed text-violet-800/90">
          {exercise.cues.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lavender-200 text-[10px] font-bold text-violet-700">
                {i + 1}
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>

        {exercise.caution && (
          <p className="mt-4 rounded-xl bg-rose-soft-bg px-3 py-2 text-xs text-rose-800">
            ⚠ {exercise.caution}
          </p>
        )}
      </div>
    </div>
  )
}
