import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Event } from './entities/event.entity';

export interface EventItemDto {
  id: string
  title?: string
  city: string
  eventDate: string // YYYY-MM-DD
  eventTime: string // HH:mm
  roundDuration: number
  maxParticipants: number
  malePercentage: number
  femalePercentage: number
  isActive: boolean
  createdAt: string
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async list(city?: string, activeOnly: boolean = true): Promise<EventItemDto[]> {
    const cacheKey = `events:list:${city || 'all'}:${activeOnly}`;
    const cachedEvents = await this.cacheManager.get<EventItemDto[]>(cacheKey);
    if (cachedEvents) {
      return cachedEvents;
    }

    const query = this.eventsRepository.createQueryBuilder('event');

    if (city) {
      query.andWhere('event.city = :city', { city });
    }

    if (activeOnly) {
      query.andWhere('event.isActive = :isActive', { isActive: true });
    }

    const events = await query
      .orderBy('event.eventDate', 'ASC')
      .addOrderBy('event.eventTime', 'ASC')
      .getMany();

    const eventDtos = events.map(event => ({
      id: event.id,
      title: event.title,
      city: event.city,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      roundDuration: event.roundDuration,
      maxParticipants: event.maxParticipants,
      malePercentage: event.malePercentage,
      femalePercentage: event.femalePercentage,
      isActive: event.isActive,
      createdAt: event.createdAt.toISOString(),
    }));

    // Кешируем на 5 минут
    await this.cacheManager.set(cacheKey, eventDtos, 300);
    return eventDtos;
  }

  async create(data: Omit<EventItemDto, 'id' | 'createdAt'>): Promise<EventItemDto> {
    const event = this.eventsRepository.create({
      title: data.title,
      city: data.city as any,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      roundDuration: data.roundDuration,
      maxParticipants: data.maxParticipants,
      malePercentage: data.malePercentage,
      femalePercentage: data.femalePercentage,
      isActive: data.isActive,
    });
    const savedEvent = await this.eventsRepository.save(event);

    // Инвалидируем кеш
    await this.cacheManager.del('events:list:*');
    await this.cacheManager.del('events:next');

    return {
      id: savedEvent.id,
      title: savedEvent.title,
      city: savedEvent.city,
      eventDate: savedEvent.eventDate,
      eventTime: savedEvent.eventTime,
      roundDuration: savedEvent.roundDuration,
      maxParticipants: savedEvent.maxParticipants,
      malePercentage: savedEvent.malePercentage,
      femalePercentage: savedEvent.femalePercentage,
      isActive: savedEvent.isActive,
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
    await this.cacheManager.del('events:list:*');
    await this.cacheManager.del('events:next');

    return {
      id: updatedEvent.id,
      title: updatedEvent.title,
      city: updatedEvent.city,
      eventDate: updatedEvent.eventDate,
      eventTime: updatedEvent.eventTime,
      roundDuration: updatedEvent.roundDuration,
      maxParticipants: updatedEvent.maxParticipants,
      malePercentage: updatedEvent.malePercentage,
      femalePercentage: updatedEvent.femalePercentage,
      isActive: updatedEvent.isActive,
      createdAt: updatedEvent.createdAt.toISOString(),
    };
  }

  async findOne(id: string): Promise<EventItemDto | null> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) return null;
    return {
      id: event.id,
      title: event.title,
      city: event.city,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      roundDuration: event.roundDuration,
      maxParticipants: event.maxParticipants,
      malePercentage: event.malePercentage,
      femalePercentage: event.femalePercentage,
      isActive: event.isActive,
      createdAt: event.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.eventsRepository.delete(id);
    if ((result.affected ?? 0) > 0) {
      // Инвалидируем кеш
      await this.cacheManager.del('events:list:*');
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
      city: upcoming.city,
      eventDate: upcoming.eventDate,
      eventTime: upcoming.eventTime,
      roundDuration: upcoming.roundDuration,
      maxParticipants: upcoming.maxParticipants,
      malePercentage: upcoming.malePercentage,
      femalePercentage: upcoming.femalePercentage,
      isActive: upcoming.isActive,
      createdAt: upcoming.createdAt.toISOString(),
    };

    // Кешируем на 2 минуты
    await this.cacheManager.set('events:next', result, 120);
    return result;
  }
}