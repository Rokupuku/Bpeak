import { DAYS, HOURS } from './data'
import type { DayKey, EmptyRange, HourSlot, SlotId } from './types'

export function slotId(day: DayKey, hour: HourSlot): SlotId {
  return `${day}-${hour}`
}

export function rangesFromSlots(slots: readonly string[]): EmptyRange[] {
  const selected = new Set(slots)
  const ranges: EmptyRange[] = []

  for (const day of DAYS) {
    let start: HourSlot | null = null
    let last: HourSlot | null = null

    const flush = () => {
      if (start == null || last == null) return
      ranges.push({
        day: day.key,
        start,
        end: last + 1,
        label: `${day.label} ${start}-${last + 1}시`,
      })
      start = null
      last = null
    }

    for (const hour of HOURS) {
      if (selected.has(slotId(day.key, hour))) {
        if (start == null) {
          start = hour
          last = hour
        } else if (last != null && hour === last + 1) {
          last = hour
        } else {
          flush()
          start = hour
          last = hour
        }
      } else {
        flush()
      }
    }
    flush()
  }

  return ranges
}

export function emptyHoursFromSlots(slots: readonly string[]): number {
  return slots.length
}
