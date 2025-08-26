import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import type { EventItemDto } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  list(): EventItemDto[] {
    return this.service.list()
  }

  @Get('next')
  next(): EventItemDto | null {
    return this.service.next()
  }

  @Post()
  create(@Body() dto: Omit<EventItemDto, 'id' | 'createdAt'>): EventItemDto {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() patch: Partial<EventItemDto>) {
    return this.service.update(id, patch)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}


