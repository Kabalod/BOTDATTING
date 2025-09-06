import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParticipantDto, Gender } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantsRepository: Repository<Participant>,
  ) {}

  async create(createParticipantDto: CreateParticipantDto): Promise<Participant> {
    const participant = this.participantsRepository.create({
      name: createParticipantDto.name,
      bio: createParticipantDto.bio,
      gender: createParticipantDto.gender as Gender,
      status: 'REGISTERED',
      ready: createParticipantDto.ready ?? false,
      paid: createParticipantDto.paid ?? false,
      registeredAt: new Date(),
      eventIds: createParticipantDto.eventIds,
    });
    return await this.participantsRepository.save(participant);
  }

  async findAll(eventId?: string): Promise<Participant[]> {
    if (!eventId) {
      return await this.participantsRepository.find();
    }
    // Используем более простой подход - получаем всех и фильтруем в JavaScript
    const allParticipants = await this.participantsRepository.find();
    return allParticipants.filter(p => p.eventIds?.includes(eventId));
  }

  async findOne(id: string): Promise<Participant | null> {
    return await this.participantsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto): Promise<Participant | null> {
    await this.participantsRepository.update(id, updateParticipantDto);
    return await this.participantsRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.participantsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}