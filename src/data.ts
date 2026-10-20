import type { BeautyReport, DayKey, HourSlot, Mate, Mbti, UserProfile } from './types'
import { MBTI_TYPES } from './types'

export { MBTI_TYPES }
export type { Mbti }

export const DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
]

export const HOURS: HourSlot[] = [9, 10, 11, 12, 13, 14, 15]

export const DEFAULT_SLOTS = ['mon-13', 'mon-14', 'wed-10', 'wed-11', 'wed-12'] as const

export const SCHOOL_DOMAIN = 'bu.ac.kr'

export const MOCK_PROFILE: UserProfile = {
  id: 'me',
  givenName: '김',
  displayName: '사용자',
  email: 'student@bu.ac.kr',
  verified: true,
  emptyHours: 5,
  mateTag: '공부 메이트',
  mbti: null,
}

export const MOCK_MATES: Mate[] = [
  {
    id: 'minsu',
    givenName: '민',
    displayName: '민수',
    major: '컴퓨터공학',
    year: 3,
    mbti: 'ENFP',
    matchPercent: 92,
    overlapLabel: '공강 겹침 13-15시',
    tags: ['카페 / 공부', '학교 인증'],
  },
  {
    id: 'seoyeon',
    givenName: '서',
    displayName: '서연',
    major: '간호학과',
    year: 2,
    mbti: 'ISFJ',
    matchPercent: 87,
    overlapLabel: '공강 겹침 10-13시',
    tags: ['산책 / 공부', '학교 인증'],
  },
  {
    id: 'jihoon',
    givenName: '지',
    displayName: '지훈',
    major: '소프트웨어',
    year: 3,
    mbti: 'INTJ',
    matchPercent: 84,
    overlapLabel: '공강 겹침 13-15시',
    tags: ['게임 / 공부', '학교 인증'],
  },
  {
    id: 'harin',
    givenName: '하',
    displayName: '하린',
    major: '경영학과',
    year: 2,
    mbti: 'ENTP',
    matchPercent: 81,
    overlapLabel: '공강 겹침 10-13시',
    tags: ['카페 / 수다', '학교 인증'],
  },
  {
    id: 'doyun',
    givenName: '도',
    displayName: '도윤',
    major: '전자공학',
    year: 4,
    mbti: 'INFP',
    matchPercent: 79,
    overlapLabel: '공강 겹침 13-15시',
    tags: ['도서관 / 공부', '학교 인증'],
  },
]

export const MOCK_REPORT: BeautyReport = {
  total: 88,
  stars: 4,
  skinTone: 90,
  faceShape: 85,
  smile: 86,
  style: 87,
}

export const SEED_CHAT: Record<string, { from: 'me' | 'mate'; text: string }[]> = {
  minsu: [
    { from: 'mate', text: '안녕하세요! 월요일 13시 공강 겹치네요 :)' },
    { from: 'me', text: '네! 점심 먹고 같이 공부할까요?' },
    { from: 'mate', text: '좋아요. 학교 카페 어때요?' },
  ],
}
