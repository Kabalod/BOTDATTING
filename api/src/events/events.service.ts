import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Event } from './entities/event.entity';

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
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async list(): Promise<EventItemDto[]> {
    // Проверяем кеш
    const cachedEvents = await this.cacheManager.get<EventItemDto[]>('events:list');
    if (cachedEvents) {
      return cachedEvents;
    }

    const events = await this.eventsRepository.find({
      order: { eventDate: 'ASC', eventTime: 'ASC' }
    });
    const eventDtos = events.map(event => ({
      id: event.id,
      title: event.title,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      roundDuration: event.roundDuration,
      createdAt: event.createdAt.toISOString(),
    }));

    // Кешируем на 5 минут
    await this.cacheManager.set('events:list', eventDtos, 300);
    return eventDtos;
  }

  async create(data: Omit<EventItemDto, 'id' | 'createdAt'>): Promise<EventItemDto> {
    const event = this.eventsRepository.create({
      title: data.title,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      roundDuration: data.roundDuration,
    });
    const savedEvent = await this.eventsRepository.save(event);

    // Инвалидируем кеш
    await this.cacheManager.del('events:list');
    await this.cacheManager.del('events:next');

    return {
      id: savedEvent.id,
      title: savedEvent.title,
      eventDate: savedEvent.eventDate,
      eventTime: savedEvent.eventTime,
      roundDuration: savedEvent.roundDuration,
      createdAt: savedEvent.createdAt.toISOString(),
    };
  }

  async update(id: string, patch: Partial<EventItemDto>): Promise<EventItemDto | null> {
    await this.eventsRepository.update(id, {
      title: patch.title,
      eventDate: patch.eventDate,
      eventTime: patch.eventTime,
      roundDuration: patch.roundDuration,
    });
    const updatedEvent = await this.eventsRepository.findOne({ where: { id } });
    if (!updatedEvent) return null;

    // Инвалидируем кеш
    await this.cacheManager.del('events:list');
    await this.cacheManager.del('events:next');

    return {
      id: updatedEvent.id,
      title: updatedEvent.title,
      eventDate: updatedEvent.eventDate,
      eventTime: updatedEvent.eventTime,
      roundDuration: updatedEvent.roundDuration,
      createdAt: updatedEvent.createdAt.toISOString(),
    };
  }

  async findOne(id: string): Promise<EventItemDto | null> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) return null;
    return {
      id: event.id,
      title: event.title,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      roundDuration: event.roundDuration,
      createdAt: event.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.eventsRepository.delete(id);
    if ((result.affected ?? 0) > 0) {
      // Инвалидируем кеш
      await this.cacheManager.del('events:list');
      await this.cacheManager.del('events:next');
    }
    return (result.affected ?? 0) > 0;
  }

  async next(): Promise<EventItemDto | null> {
    // Проверяем кеш
    const cachedNext = await this.cacheManager.get<EventItemDto>('events:next');
    if (cachedNext) {
      return cachedNext;
    }

    const now = new Date();
    const events = await this.eventsRepository
      .createQueryBuilder('event')
      .where('CONCAT(event.eventDate, \'T\', event.eventTime, \':00\') >= :now', { now: now.toISOString() })
      .orderBy('event.eventDate', 'ASC')
      .addOrderBy('event.eventTime', 'ASC')
      .getMany();

    if (events.length === 0) {
      // Кешируем пустой результат на 1 минуту
      await this.cacheManager.set('events:next', null, 60);
      return null;
    }

    const upcoming = events[0];
    const result = {
      id: upcoming.id,
      title: upcoming.title,
      eventDate: upcoming.eventDate,
      eventTime: upcoming.eventTime,
      roundDuration: upcoming.roundDuration,
      createdAt: upcoming.createdAt.toISOString(),
    };

    // Кешируем на 2 минуты
    await this.cacheManager.set('events:next', result, 120);
    return result;
  }
}