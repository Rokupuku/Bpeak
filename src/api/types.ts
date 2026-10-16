import type {
  BeautyReport,
  ChatMessage,
  EmptyRange,
  Mate,
  NotificationSettings,
  UserProfile,
} from '../types'

export interface SendEmailCodeRequest {
  email: string
}

export interface SendEmailCodeResponse {
  expiresInSec: number
  resendAfterSec: number
}

export interface VerifyEmailCodeRequest {
  email: string
  code: string
}

export interface VerifyEmailCodeResponse {
  accessToken: string
  profile: UserProfile
}

export interface SaveTimetableRequest {
  slots: string[]
}

export interface SaveTimetableResponse {
  emptyHours: number
  ranges: EmptyRange[]
}

export interface MatchListResponse {
  mates: Mate[]
}

export interface ChatRequestResponse {
  chatId: string
  mate: Mate
}

export interface SendMessageRequest {
  text: string
}

export interface AnalysisSubmitResponse {
  jobId: string
}

export interface AnalysisResultResponse {
  status: 'pending' | 'done'
  report: BeautyReport | null
}

export type BpeakApi = {
  sendEmailCode: (body: SendEmailCodeRequest) => Promise<SendEmailCodeResponse>
  verifyEmailCode: (body: VerifyEmailCodeRequest) => Promise<VerifyEmailCodeResponse>
  me: () => Promise<UserProfile>
  saveTimetable: (body: SaveTimetableRequest) => Promise<SaveTimetableResponse>
  matches: () => Promise<MatchListResponse>
  requestChat: (mateId: string) => Promise<ChatRequestResponse>
  listMessages: (mateId: string) => Promise<ChatMessage[]>
  sendMessage: (mateId: string, body: SendMessageRequest) => Promise<ChatMessage>
  submitAnalysis: (photo?: File) => Promise<AnalysisSubmitResponse>
  analysisResult: (jobId: string) => Promise<AnalysisResultResponse>
  saveNotifications: (body: NotificationSettings) => Promise<NotificationSettings>
}
