import type { BpeakApi } from './types'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('bpeak-token')
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? `요청에 실패했습니다. (${response.status})`)
  }
  return (await response.json()) as T
}

export const httpApi: BpeakApi = {
  sendEmailCode: (body) =>
    request('/auth/email/send', { method: 'POST', body: JSON.stringify(body) }),
  verifyEmailCode: async (body) => {
    const result = await request<Awaited<ReturnType<BpeakApi['verifyEmailCode']>>>(
      '/auth/email/verify',
      { method: 'POST', body: JSON.stringify(body) },
    )
    localStorage.setItem('bpeak-token', result.accessToken)
    return result
  },
  me: () => request('/me'),
  saveProfile: (body) => request('/me', { method: 'PATCH', body: JSON.stringify(body) }),
  saveTimetable: (body) =>
    request('/me/timetable', { method: 'PUT', body: JSON.stringify(body) }),
  matches: (filters) => {
    const params = new URLSearchParams()
    filters?.mbti?.forEach((type) => params.append('mbti', type))
    const query = params.toString()
    return request(`/matches${query ? `?${query}` : ''}`)
  },
  requestChat: (mateId) =>
    request(`/matches/${mateId}/chat-requests`, { method: 'POST' }),
  listChats: () => request('/chats'),
  listMessages: (mateId) => request(`/chats/${mateId}/messages`),
  sendMessage: (mateId, body) =>
    request(`/chats/${mateId}/messages`, { method: 'POST', body: JSON.stringify(body) }),
  submitAnalysis: () => request('/analysis', { method: 'POST' }),
  analysisResult: (jobId) => request(`/analysis/${jobId}`),
  saveNotifications: (body) =>
    request('/me/notifications', { method: 'PATCH', body: JSON.stringify(body) }),
}
