import { useEffect, useMemo, useState } from 'react'
import { useCoupleState } from './hooks/useCoupleState'
import { Onboarding } from './components/Onboarding'
import { SafetyBanner } from './components/SafetyBanner'
import { DailyChecklist } from './components/DailyChecklist'
import { CalendarView } from './components/CalendarView'
import { LibraryView } from './components/LibraryView'
import { SyncPanel } from './components/SyncPanel'
import { Celebration } from './components/Celebration'
import { getDayByNumber, getTodayDayNumber, PLAN } from './data/plan'
import { dayCompletion } from './lib/sync'

type Tab = 'today' | 'calendar' | 'library' | 'sync'

export default function App() {
  const {
    state,
    completeOnboarding,
    updateNames,
    swapRoles,
    toggle,
    applySyncCode,
    getSyncCode,
    getExportJson,
    importJson,
  } = useCoupleState()

  const [tab, setTab] = useState<Tab>('today')
  const [selectedDay, setSelectedDay] = useState(() => getTodayDayNumber())
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const [showAddHomeTip, setShowAddHomeTip] = useState(() => {
    try {
      return localStorage.getItem('benmi-hide-add-home-tip') !== '1'
    } catch {
      return true
    }
  })

  const day = useMemo(() => getDayByNumber(selectedDay), [selectedDay])

  const day30Done = useMemo(() => {
    const d30 = PLAN[29]
    const pct = dayCompletion(state, 30, state.profiles.selfId, d30.items.length)
    return pct === 100
  }, [state])

  useEffect(() => {
    if (day30Done && !celebrated && state.profiles.onboarded) {
      setShowCelebrate(true)
      setCelebrated(true)
    }
  }, [day30Done, celebrated, state.profiles.onboarded])

  if (!state.profiles.onboarded) {
    return <Onboarding onDone={completeOnboarding} />
  }

  const { self, partner } = state.profiles

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
      <header className="sticky top-0 z-20 border-b border-violet-100/80 bg-lavender-50/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-violet-900">米米打卡</h1>
            <p className="text-[11px] text-violet-400">偏头痛与颈肩辅助 · 30 天</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-3 py-1.5 text-xs text-violet-600 shadow-sm">
            <span>
              {self.emoji} {self.name}
            </span>
            <span className="mx-1 text-violet-300">+</span>
            <span>
              {partner.emoji} {partner.name}
            </span>
          </div>
        </div>
        {tab === 'today' && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {[selectedDay - 1, selectedDay, selectedDay + 1]
              .filter((d) => d >= 1 && d <= 30)
              .map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    d === selectedDay
                      ? 'bg-violet-500 text-white'
                      : 'bg-white text-violet-500'
                  }`}
                >
                  Day {d}
                  {PLAN[d - 1].isRestore ? ' 🍃' : ''}
                </button>
              ))}
            <button
              type="button"
              onClick={() => setSelectedDay(getTodayDayNumber())}
              className="shrink-0 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-600"
            >
              回到今天
            </button>
          </div>
        )}
      </header>

      <SafetyBanner />

      {tab === 'today' && showAddHomeTip && (
        <div className="mx-3 mt-2 flex items-start gap-2 rounded-2xl border border-violet-200/70 bg-white/80 px-3 py-2 text-xs text-violet-600 shadow-sm">
          <span className="mt-0.5 shrink-0" aria-hidden>
            📲
          </span>
          <p className="flex-1 leading-relaxed">
            iPhone 提示：Safari 分享 → 添加到主屏幕，可像 App 一样打开「米米打卡」。
          </p>
          <button
            type="button"
            aria-label="关闭提示"
            className="shrink-0 rounded-lg px-1.5 py-0.5 text-violet-400 hover:bg-violet-50"
            onClick={() => {
              setShowAddHomeTip(false)
              try {
                localStorage.setItem('benmi-hide-add-home-tip', '1')
              } catch {
                /* ignore */
              }
            }}
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pt-3 safe-pb">
        {tab === 'today' && (
          <DailyChecklist
            day={day}
            state={state}
            onToggle={(id) => toggle(selectedDay, id)}
          />
        )}
        {tab === 'calendar' && (
          <CalendarView
            state={state}
            selectedDay={selectedDay}
            onSelect={(d) => {
              setSelectedDay(d)
              setTab('today')
            }}
          />
        )}
        {tab === 'library' && <LibraryView />}
        {tab === 'sync' && (
          <SyncPanel
            getSyncCode={getSyncCode}
            applySyncCode={applySyncCode}
            getExportJson={getExportJson}
            importJson={importJson}
            selfName={self.name}
            partnerName={partner.name}
            onSwap={swapRoles}
            onUpdateNames={updateNames}
          />
        )}
      </main>

      <nav className="sticky bottom-0 z-20 border-t border-violet-100 bg-white/95 px-2 pt-2 safe-pb backdrop-blur">
        <div className="grid grid-cols-4 gap-1">
          {(
            [
              ['today', '今日', '🏠'],
              ['calendar', '日历', '📅'],
              ['library', '动作库', '📖'],
              ['sync', '同步', '🔗'],
            ] as const
          ).map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-2xl py-2 text-center text-[11px] ${
                tab === id ? 'bg-lavender-100 font-semibold text-violet-700' : 'text-violet-400'
              }`}
            >
              <div className="text-base leading-none">{icon}</div>
              <div className="mt-1">{label}</div>
            </button>
          ))}
        </div>
      </nav>

      {showCelebrate && (
        <Celebration
          selfName={self.name}
          partnerName={partner.name}
          onClose={() => setShowCelebrate(false)}
        />
      )}
    </div>
  )
}
