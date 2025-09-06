import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventsService, EventItemDto } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() data: Omit<EventItemDto, 'id' | 'createdAt'>) {
    return await this.eventsService.create(data);
  }

  @Get()
  async list() {
    return await this.eventsService.list();
  }

  @Get('next')
  async next() {
    return await this.eventsService.next();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() patch: Partial<EventItemDto>) {
    return await this.eventsService.update(id, patch);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.eventsService.remove(id);
  }
}