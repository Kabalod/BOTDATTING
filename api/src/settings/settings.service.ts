import { Injectable } from '@nestjs/common';

export interface EventSettingsDto {
  eventDate: string // YYYY-MM-DD
  eventTime: string // HH:mm
  roundDuration: number // minutes
}

@Injectable()
export class SettingsService {
  private settings: EventSettingsDto = {
    eventDate: '2024-08-20',
    eventTime: '19:00',
    roundDuration: 7,
  }

  get(): EventSettingsDto {
    return this.settings
  }

  update(dto: Partial<EventSettingsDto>): EventSettingsDto {
    this.settings = { ...this.settings, ...dto }
    return this.settings
  }
}


