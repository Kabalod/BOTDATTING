import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaitlistEntry, City, Gender } from './entities/waitlist.entity';

export interface WaitlistEntryDto {
  id: string;
  telegramUsername?: string;
  name?: string;
  gender: string;
  preferredCity: string;
  contactInfo?: string;
  contacted: boolean;
  notes?: string;
  createdAt: string;
}

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntry)
    private waitlistRepository: Repository<WaitlistEntry>,
  ) {}

  async create(data: Omit<WaitlistEntryDto, 'id' | 'createdAt' | 'contacted'>): Promise<WaitlistEntryDto> {
    const entry = this.waitlistRepository.create({
      telegramUsername: data.telegramUsername,
      name: data.name,
      gender: data.gender as Gender,
      preferredCity: data.preferredCity as City,
      contactInfo: data.contactInfo,
      notes: data.notes,
      contacted: false,
    });

    const savedEntry = await this.waitlistRepository.save(entry);

    return {
      id: savedEntry.id,
      telegramUsername: savedEntry.telegramUsername,
      name: savedEntry.name,
      gender: savedEntry.gender,
      preferredCity: savedEntry.preferredCity,
      contactInfo: savedEntry.contactInfo,
      contacted: savedEntry.contacted,
      notes: savedEntry.notes,
      createdAt: savedEntry.createdAt.toISOString(),
    };
  }

  async findAll(city?: string): Promise<WaitlistEntryDto[]> {
    const query = this.waitlistRepository.createQueryBuilder('entry');

    if (city) {
      query.andWhere('entry.preferredCity = :city', { city });
    }

    const entries = await query
      .orderBy('entry.createdAt', 'DESC')
      .getMany();

    return entries.map(entry => ({
      id: entry.id,
      telegramUsername: entry.telegramUsername,
      name: entry.name,
      gender: entry.gender,
      preferredCity: entry.preferredCity,
      contactInfo: entry.contactInfo,
      contacted: entry.contacted,
      notes: entry.notes,
      createdAt: entry.createdAt.toISOString(),
    }));
  }

  async updateContacted(id: string, contacted: boolean, notes?: string): Promise<WaitlistEntryDto | null> {
    await this.waitlistRepository.update(id, { contacted, notes });
    const updated = await this.waitlistRepository.findOne({ where: { id } });

    if (!updated) return null;

    return {
      id: updated.id,
      telegramUsername: updated.telegramUsername,
      name: updated.name,
      gender: updated.gender,
      preferredCity: updated.preferredCity,
      contactInfo: updated.contactInfo,
      contacted: updated.contacted,
      notes: updated.notes,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.waitlistRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getStats(): Promise<{ total: number; byCity: Record<string, number>; byGender: Record<string, number> }> {
    const entries = await this.waitlistRepository.find();

    const stats = {
      total: entries.length,
      byCity: {} as Record<string, number>,
      byGender: {} as Record<string, number>,
    };

    entries.forEach(entry => {
      // Статистика по городам
      stats.byCity[entry.preferredCity] = (stats.byCity[entry.preferredCity] || 0) + 1;

      // Статистика по гендеру
      stats.byGender[entry.gender] = (stats.byGender[entry.gender] || 0) + 1;
    });

    return stats;
  }
}
