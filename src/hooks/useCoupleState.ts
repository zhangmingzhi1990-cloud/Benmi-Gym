import { useCallback, useEffect, useState } from 'react'
import type { CoupleState, Profile } from '../data/types'
import {
  createDefaultState,
  loadState,
  mergeStates,
  saveState,
  toggleCheck,
  tryReadHashSync,
  decodeSyncCode,
  encodeSyncCode,
  exportJson,
} from '../lib/sync'

export function useCoupleState() {
  const [state, setState] = useState<CoupleState>(() => {
    const fromHash = typeof window !== 'undefined' ? tryReadHashSync() : null
    const stored = typeof window !== 'undefined' ? loadState() : null
    if (fromHash && stored) return mergeStates(stored, fromHash)
    if (fromHash) return fromHash
    if (stored) return stored
    return createDefaultState()
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  const completeOnboarding = useCallback((self: Profile, partner: Profile) => {
    setState((s) => ({
      ...s,
      profiles: {
        selfId: self.id,
        partnerId: partner.id,
        self,
        partner,
        onboarded: true,
      },
    }))
  }, [])

  const updateNames = useCallback((selfName: string, partnerName: string) => {
    setState((s) => ({
      ...s,
      profiles: {
        ...s.profiles,
        self: { ...s.profiles.self, name: selfName },
        partner: { ...s.profiles.partner, name: partnerName },
      },
    }))
  }, [])

  const swapRoles = useCallback(() => {
    setState((s) => ({
      ...s,
      profiles: {
        selfId: s.profiles.partnerId,
        partnerId: s.profiles.selfId,
        self: s.profiles.partner,
        partner: s.profiles.self,
        onboarded: s.profiles.onboarded,
      },
    }))
  }, [])

  const toggle = useCallback((day: number, exerciseId: string) => {
    setState((s) => toggleCheck(s, day, s.profiles.selfId, exerciseId))
  }, [])

  const applySyncCode = useCallback((code: string): { ok: boolean; message: string } => {
    const remote = decodeSyncCode(code)
    if (!remote) return { ok: false, message: '同步码无效或已损坏' }
    setState((s) => mergeStates(s, remote))
    return { ok: true, message: '已合并同步码（勾选取并集）' }
  }, [])

  const getSyncCode = useCallback(() => encodeSyncCode(state), [state])

  const getExportJson = useCallback(() => exportJson(state), [state])

  const importJson = useCallback((text: string): { ok: boolean; message: string } => {
    try {
      const remote = JSON.parse(text) as CoupleState
      if (remote.version !== 1) return { ok: false, message: 'JSON 版本不匹配' }
      setState((s) => mergeStates(s, remote))
      return { ok: true, message: '已导入并合并 JSON' }
    } catch {
      return { ok: false, message: 'JSON 解析失败' }
    }
  }, [])

  const resetAll = useCallback(() => {
    const fresh = createDefaultState()
    setState(fresh)
    saveState(fresh)
  }, [])

  return {
    state,
    completeOnboarding,
    updateNames,
    swapRoles,
    toggle,
    applySyncCode,
    getSyncCode,
    getExportJson,
    importJson,
    resetAll,
  }
}
