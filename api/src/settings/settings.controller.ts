import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import type { EventSettingsDto } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  get(): EventSettingsDto {
    return this.service.get()
  }

  @Patch()
  update(@Body() dto: Partial<EventSettingsDto>): EventSettingsDto {
    return this.service.update(dto)
  }
}


