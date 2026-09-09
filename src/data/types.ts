export type ExerciseId =
  | 'chin-tuck'
  | 'open-book'
  | 'neck-isometric'
  | 'thoracic-extension'
  | 'gentle-neck-rom'
  | 'wall-slide-plus'
  | 'serratus-punch'
  | 'wall-pushup-plus'
  | 'elevated-pushup-plus'
  | 'scapular-pushup'
  | 'reformer-row'
  | 'band-er'
  | 'dead-bug'
  | 'plank'
  | 'stretch'

export interface Exercise {
  id: ExerciseId
  name: string
  nameEn: string
  category: string
  cues: string[]
  frames: number
  caution?: string
}

export interface DayItem {
  exerciseId: ExerciseId
  prescription: string
  note?: string
}

export interface PlanDay {
  day: number
  date: string // YYYY-MM-DD
  isRestore: boolean
  title: string
  items: DayItem[]
}

export interface Profile {
  id: string
  name: string
  emoji: string
}

export interface CoupleState {
  version: 1
  profiles: {
    selfId: string
    partnerId: string
    self: Profile
    partner: Profile
    onboarded: boolean
  }
  /** day -> userId -> exerciseId[] checked */
  checks: Record<string, Record<string, string[]>>
  updatedAt: string
}

export const STORAGE_KEY = 'benmi-couple-state'
export const PLAN_START = '2026-09-09'
export const PLAN_END = '2026-10-08'
export const TZ_LABEL = 'Australia/Sydney'
