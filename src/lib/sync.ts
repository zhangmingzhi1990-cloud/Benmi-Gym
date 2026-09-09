import LZString from 'lz-string'
import type { CoupleState } from '../data/types'
import { STORAGE_KEY } from '../data/types'

const SYNC_PREFIX = 'BENMI1:'

export function loadState(): CoupleState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CoupleState
  } catch {
    return null
  }
}

export function saveState(state: CoupleState): void {
  const next = { ...state, updatedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  // Optional URL hash sync mirror (short states only — best-effort)
  try {
    const code = encodeSyncCode(next)
    if (code.length < 1800) {
      const url = new URL(window.location.href)
      url.hash = `sync=${encodeURIComponent(code)}`
      history.replaceState(null, '', url.toString())
    }
  } catch {
    /* ignore */
  }
}

export function createDefaultState(): CoupleState {
  return {
    version: 1,
    profiles: {
      selfId: 'mimi',
      partnerId: 'benben',
      self: { id: 'mimi', name: '米米', emoji: '🌸' },
      partner: { id: 'benben', name: '笨笨', emoji: '🐻' },
      onboarded: false,
    },
    checks: {
      // Seed 米米 Day1 + Day2 all checked
      '1': {
        mimi: [
          'chin-tuck',
          'reformer-row',
          'wall-slide-plus',
          'stretch',
          'plank',
        ],
      },
      '2': {
        mimi: [
          'chin-tuck',
          'open-book',
          'serratus-punch',
          'wall-slide-plus',
          'stretch',
          'plank',
        ],
      },
    },
    updatedAt: new Date().toISOString(),
  }
}

export function encodeSyncCode(state: CoupleState): string {
  const json = JSON.stringify(state)
  const compressed = LZString.compressToBase64(json)
  return SYNC_PREFIX + compressed
}

export function decodeSyncCode(code: string): CoupleState | null {
  try {
    let payload = code.trim()
    if (payload.startsWith(SYNC_PREFIX)) payload = payload.slice(SYNC_PREFIX.length)
    // Also accept raw JSON for export/import flexibility
    if (payload.startsWith('{')) {
      return JSON.parse(payload) as CoupleState
    }
    const json = LZString.decompressFromBase64(payload)
    if (!json) return null
    const parsed = JSON.parse(json) as CoupleState
    if (parsed.version !== 1 || !parsed.profiles || !parsed.checks) return null
    return parsed
  } catch {
    return null
  }
}

/** Merge remote into local: union of checkmarks, keep newer profile names if remote newer */
export function mergeStates(local: CoupleState, remote: CoupleState): CoupleState {
  const localTime = Date.parse(local.updatedAt || '') || 0
  const remoteTime = Date.parse(remote.updatedAt || '') || 0
  const profiles = remoteTime >= localTime ? remote.profiles : local.profiles

  const checks: CoupleState['checks'] = { ...local.checks }
  for (const [day, users] of Object.entries(remote.checks || {})) {
    if (!checks[day]) checks[day] = {}
    for (const [userId, items] of Object.entries(users)) {
      const set = new Set([...(checks[day][userId] || []), ...items])
      checks[day][userId] = Array.from(set)
    }
  }

  return {
    version: 1,
    profiles,
    checks,
    updatedAt: new Date().toISOString(),
  }
}

export function exportJson(state: CoupleState): string {
  return JSON.stringify(state, null, 2)
}

export function tryReadHashSync(): CoupleState | null {
  try {
    const hash = window.location.hash.replace(/^#/, '')
    const params = new URLSearchParams(hash.includes('=') ? hash : `sync=${hash}`)
    const code = params.get('sync')
    if (!code) return null
    return decodeSyncCode(decodeURIComponent(code))
  } catch {
    return null
  }
}

export function dayCompletion(
  state: CoupleState,
  day: number,
  userId: string,
  totalItems: number,
): number {
  if (totalItems <= 0) return 0
  const checked = state.checks[String(day)]?.[userId]?.length || 0
  return Math.min(100, Math.round((checked / totalItems) * 100))
}

export function isItemChecked(
  state: CoupleState,
  day: number,
  userId: string,
  exerciseId: string,
): boolean {
  return (state.checks[String(day)]?.[userId] || []).includes(exerciseId)
}

export function toggleCheck(
  state: CoupleState,
  day: number,
  userId: string,
  exerciseId: string,
): CoupleState {
  const key = String(day)
  const dayChecks = { ...(state.checks[key] || {}) }
  const list = new Set(dayChecks[userId] || [])
  if (list.has(exerciseId)) list.delete(exerciseId)
  else list.add(exerciseId)
  dayChecks[userId] = Array.from(list)
  return {
    ...state,
    checks: { ...state.checks, [key]: dayChecks },
    updatedAt: new Date().toISOString(),
  }
}
