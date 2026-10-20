export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'

export type HourSlot = 9 | 10 | 11 | 12 | 13 | 14 | 15

export type SlotId = `${DayKey}-${HourSlot}`

export type AuthStatus = 'guest' | 'pending' | 'verified'

export const MBTI_TYPES = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
] as const

export type Mbti = (typeof MBTI_TYPES)[number]

export interface UserProfile {
  id: string
  givenName: string
  displayName: string
  email: string
  verified: boolean
  emptyHours: number
  mateTag: string
  mbti: Mbti | null
}

export interface EmptyRange {
  day: DayKey
  start: HourSlot
  end: number
  label: string
}

export interface Mate {
  id: string
  givenName: string
  displayName: string
  major: string
  year: number
  mbti: Mbti
  matchPercent: number
  overlapLabel: string
  tags: string[]
}

export interface ChatThread {
  mateId: string
  lastText: string
  lastFrom: 'me' | 'mate'
}

export interface ChatMessage {
  id: string
  mateId: string
  from: 'me' | 'mate'
  text: string
  sentAt: string
}

export interface BeautyReport {
  total: number
  stars: number
  skinTone: number
  faceShape: number
  smile: number
  style: number
}

export interface NotificationSettings {
  matchAlert: boolean
  chatAlert: boolean
  analysisAlert: boolean
}

export interface AppSnapshot {
  authStatus: AuthStatus
  email: string
  selectedSlots: SlotId[]
  mbti: Mbti | null
  preferredMbtis: Mbti[]
  openChats: string[]
  report: BeautyReport | null
  analysisDone: boolean
  messagesByMate: Record<string, ChatMessage[]>
  notifications: NotificationSettings
}
