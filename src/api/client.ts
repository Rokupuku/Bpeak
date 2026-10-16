import { mockApi } from './mock'
import { httpApi } from './http'
import type { BpeakApi } from './types'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export const api: BpeakApi = useMock ? mockApi : httpApi
export { useMock }
