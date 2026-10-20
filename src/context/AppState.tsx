import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_SLOTS, MOCK_PROFILE } from '../data'
import type {
  AppSnapshot,
  AuthStatus,
  BeautyReport,
  ChatMessage,
  Mbti,
  NotificationSettings,
  SlotId,
  UserProfile,
} from '../types'

const STORAGE_KEY = 'bpeak-app'

const defaultSnapshot: AppSnapshot = {
  authStatus: 'guest',
  email: '',
  selectedSlots: [...DEFAULT_SLOTS],
  mbti: null,
  preferredMbtis: [],
  openChats: ['minsu'],
  report: null,
  analysisDone: false,
  messagesByMate: {},
  notifications: {
    matchAlert: true,
    chatAlert: true,
    analysisAlert: false,
  },
}

function loadSnapshot(): AppSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSnapshot
    return { ...defaultSnapshot, ...(JSON.parse(raw) as Partial<AppSnapshot>) }
  } catch {
    return defaultSnapshot
  }
}

interface AppStateValue {
  snapshot: AppSnapshot
  profile: UserProfile
  setEmail: (email: string) => void
  setAuthStatus: (authStatus: AuthStatus) => void
  toggleSlot: (slot: SlotId) => void
  markAnalysisDone: (report: BeautyReport) => void
  setNotifications: (notifications: NotificationSettings) => void
  setMbti: (mbti: Mbti) => void
  setPreferredMbtis: (preferredMbtis: Mbti[]) => void
  openChat: (mateId: string) => void
  appendMessage: (mateId: string, message: ChatMessage) => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(loadSnapshot)

  const persist = useCallback((patch: (prev: AppSnapshot) => AppSnapshot) => {
    setSnapshot((prev) => {
      const next = patch(prev)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setEmail = useCallback((email: string) => persist((prev) => ({ ...prev, email })), [persist])
  const setAuthStatus = useCallback(
    (authStatus: AuthStatus) => persist((prev) => ({ ...prev, authStatus })),
    [persist],
  )
  const toggleSlot = useCallback(
    (slot: SlotId) =>
      persist((prev) => ({
        ...prev,
        selectedSlots: prev.selectedSlots.includes(slot)
          ? prev.selectedSlots.filter((item) => item !== slot)
          : [...prev.selectedSlots, slot],
      })),
    [persist],
  )
  const markAnalysisDone = useCallback(
    (report: BeautyReport) => persist((prev) => ({ ...prev, report, analysisDone: true })),
    [persist],
  )
  const setNotifications = useCallback(
    (notifications: NotificationSettings) => persist((prev) => ({ ...prev, notifications })),
    [persist],
  )
  const appendMessage = useCallback(
    (mateId: string, message: ChatMessage) =>
      persist((prev) => ({
        ...prev,
        messagesByMate: {
          ...prev.messagesByMate,
          [mateId]: [...(prev.messagesByMate[mateId] ?? []), message],
        },
      })),
    [persist],
  )
  const setMbti = useCallback((mbti: Mbti) => persist((prev) => ({ ...prev, mbti })), [persist])
  const setPreferredMbtis = useCallback(
    (preferredMbtis: Mbti[]) => persist((prev) => ({ ...prev, preferredMbtis })),
    [persist],
  )
  const openChat = useCallback(
    (mateId: string) =>
      persist((prev) =>
        prev.openChats.includes(mateId) ? prev : { ...prev, openChats: [mateId, ...prev.openChats] },
      ),
    [persist],
  )

  const profile = useMemo<UserProfile>(
    () => ({
      ...MOCK_PROFILE,
      email: snapshot.email || MOCK_PROFILE.email,
      verified: snapshot.authStatus === 'verified',
      emptyHours: snapshot.selectedSlots.length,
      mbti: snapshot.mbti,
    }),
    [snapshot.authStatus, snapshot.email, snapshot.mbti, snapshot.selectedSlots.length],
  )

  const value = useMemo<AppStateValue>(
    () => ({
      snapshot,
      profile,
      setEmail,
      setAuthStatus,
      toggleSlot,
      markAnalysisDone,
      setNotifications,
      setMbti,
      setPreferredMbtis,
      openChat,
      appendMessage,
    }),
    [
      snapshot,
      profile,
      setEmail,
      setAuthStatus,
      toggleSlot,
      markAnalysisDone,
      setNotifications,
      setMbti,
      setPreferredMbtis,
      openChat,
      appendMessage,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('AppStateProvider가 필요합니다.')
  return value
}
