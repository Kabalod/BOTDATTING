import { Injectable } from '@nestjs/common';
import { CreateParticipantDto, Gender } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {
  private readonly participants: Participant[] = []; // Временное хранилище в памяти

  create(createParticipantDto: CreateParticipantDto): Participant {
    const newUser: Participant = {
      id: String(this.participants.length + 1),
      name: createParticipantDto.name,
      bio: createParticipantDto.bio,
      gender: createParticipantDto.gender as Gender,
      status: 'REGISTERED',
      ready: createParticipantDto.ready ?? false,
      paid: createParticipantDto.paid ?? false,
      registeredAt: new Date(),
      createdAt: new Date(),
      eventId: createParticipantDto.eventId,
    };
    this.participants.push(newUser);
    return newUser;
  }

  findAll(eventId?: string): Participant[] {
    if (!eventId) return this.participants
    return this.participants.filter((p) => p.eventId === eventId)
  }

  findOne(id: string): Participant | undefined {
    return this.participants.find((p) => p.id === id);
  }

  update(id: string, updateParticipantDto: UpdateParticipantDto): Participant | undefined {
    const idx = this.participants.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const updated: Participant = { ...this.participants[idx], ...updateParticipantDto } as Participant;
    this.participants[idx] = updated;
    return updated;
  }

  remove(id: string): boolean {
    const before = this.participants.length;
    const after = this.participants.filter((p) => p.id !== id);
    const removed = after.length !== before;
    if (removed) this.participants.splice(0, this.participants.length, ...after);
    return removed;
  }
}
