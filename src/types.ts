export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'

export type HourSlot = 9 | 10 | 11 | 12 | 13 | 14 | 15

export type SlotId = `${DayKey}-${HourSlot}`

export type AuthStatus = 'guest' | 'pending' | 'verified'

export interface UserProfile {
  id: string
  givenName: string
  displayName: string
  email: string
  verified: boolean
  emptyHours: number
  mateTag: string
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
  matchPercent: number
  overlapLabel: string
  tags: string[]
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
  report: BeautyReport | null
  analysisDone: boolean
  messagesByMate: Record<string, ChatMessage[]>
  notifications: NotificationSettings
}
