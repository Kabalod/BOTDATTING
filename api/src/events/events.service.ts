import { Injectable } from '@nestjs/common';

export interface EventItemDto {
  id: string
  title?: string
  eventDate: string // YYYY-MM-DD
  eventTime: string // HH:mm
  roundDuration: number
  createdAt: string
}

@Injectable()
export class EventsService {
  private events: EventItemDto[] = []

  list(): EventItemDto[] {
    return this.events.sort((a, b) =>
      a.eventDate.localeCompare(b.eventDate) || a.eventTime.localeCompare(b.eventTime)
    )
  }

  create(data: Omit<EventItemDto, 'id' | 'createdAt'>): EventItemDto {
    const item: EventItemDto = {
      id: String(this.events.length + 1),
      createdAt: new Date().toISOString(),
      ...data,
    }
    this.events.push(item)
    return item
  }

  update(id: string, patch: Partial<EventItemDto>): EventItemDto | undefined {
    const idx = this.events.findIndex((e) => e.id === id)
    if (idx === -1) return undefined
    this.events[idx] = { ...this.events[idx], ...patch }
    return this.events[idx]
  }

  remove(id: string): boolean {
    const before = this.events.length
    this.events = this.events.filter((e) => e.id !== id)
    return this.events.length !== before
  }

  next(): EventItemDto | null {
    const now = new Date()
    const upcoming = this.list().find((e) => {
      const dt = new Date(`${e.eventDate}T${e.eventTime}:00`)
      return dt >= now
    })
    return upcoming ?? null
  }
}


