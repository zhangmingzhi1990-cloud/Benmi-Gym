interface Props {
  selfName: string
  partnerName: string
  onClose: () => void
}

export function Celebration({ selfName, partnerName, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-violet-950/50 p-4">
      <div className="animate-celebrate max-w-sm rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-rose-soft-bg p-6 text-center shadow-2xl">
        <div className="mb-2 text-5xl">🎉💜✨</div>
        <h2 className="text-xl font-bold text-violet-900">Day 30 完成！</h2>
        <p className="mt-3 text-sm leading-relaxed text-violet-700">
          {selfName} 与 {partnerName} 一起走完了「米米打卡」30 天。
          <br />
          温柔地照顾身体，真的很棒。
        </p>
        <p className="mt-2 text-xs text-violet-400">记得继续保持轻柔活动与休息节奏 🌸</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-violet-500 py-3 text-sm font-semibold text-white"
        >
          收下这份喜悦
        </button>
      </div>
    </div>
  )
}
