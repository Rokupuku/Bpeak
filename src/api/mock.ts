import { MOCK_MATES, MOCK_PROFILE, MOCK_REPORT, SCHOOL_DOMAIN, SEED_CHAT } from '../data'
import { emptyHoursFromSlots, rangesFromSlots } from '../timetable'
import type { ChatMessage } from '../types'
import type { BpeakApi } from './types'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_CODE = '123456'
let token: string | null = localStorage.getItem('bpeak-token')
const extraMessages: Record<string, ChatMessage[]> = {}

function requireAuth() {
  if (!token) {
    const error = new Error('로그인이 필요합니다.')
    throw error
  }
}

export const mockApi: BpeakApi = {
  async sendEmailCode({ email }) {
    await wait(450)
    if (!email.toLowerCase().endsWith(`@${SCHOOL_DOMAIN}`)) {
      throw new Error(`이메일 형식은 *@${SCHOOL_DOMAIN} 만 허용됩니다.`)
    }
    return { expiresInSec: 600, resendAfterSec: 60 }
  },

  async verifyEmailCode({ email, code }) {
    await wait(400)
    if (code !== MOCK_CODE) {
      throw new Error('인증 코드가 올바르지 않습니다.')
    }
    token = 'mock-access-token'
    localStorage.setItem('bpeak-token', token)
    return {
      accessToken: token,
      profile: { ...MOCK_PROFILE, email },
    }
  },

  async me() {
    await wait(200)
    requireAuth()
    return MOCK_PROFILE
  },

  async saveTimetable({ slots }) {
    await wait(350)
    return {
      emptyHours: emptyHoursFromSlots(slots),
      ranges: rangesFromSlots(slots),
    }
  },

  async matches() {
    await wait(300)
    return { mates: MOCK_MATES }
  },

  async requestChat(mateId) {
    await wait(250)
    const mate = MOCK_MATES.find((item) => item.id === mateId)
    if (!mate) throw new Error('메이트를 찾을 수 없습니다.')
    return { chatId: mateId, mate }
  },

  async listMessages(mateId) {
    await wait(150)
    const seed = (SEED_CHAT[mateId] ?? []).map((item, index) => ({
      id: `${mateId}-seed-${index}`,
      mateId,
      from: item.from,
      text: item.text,
      sentAt: new Date().toISOString(),
    }))
    return [...seed, ...(extraMessages[mateId] ?? [])]
  },

  async sendMessage(mateId, { text }) {
    await wait(180)
    const message: ChatMessage = {
      id: `${mateId}-${Date.now()}`,
      mateId,
      from: 'me',
      text,
      sentAt: new Date().toISOString(),
    }
    extraMessages[mateId] = [...(extraMessages[mateId] ?? []), message]
    return message
  },

  async submitAnalysis() {
    await wait(400)
    return { jobId: 'analysis-demo' }
  },

  async analysisResult() {
    await wait(900)
    return { status: 'done', report: MOCK_REPORT }
  },

  async saveNotifications(body) {
    await wait(200)
    return body
  },
}

export const MOCK_OTP_HINT = MOCK_CODE
