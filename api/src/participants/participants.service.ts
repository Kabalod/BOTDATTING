import { Injectable } from '@nestjs/common';
import { CreateParticipantDto, Gender } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class ParticipantsService {
  private readonly participants: Array<CreateParticipantDto & { id: number; status: string; createdAt: Date }> = [];

  create(createParticipantDto: CreateParticipantDto) {
    // TODO: Добавить валидацию telegramInitData и логику сохранения в БД
    const newUser = {
      id: this.participants.length + 1, // Простой инкремент для примера
      ...createParticipantDto,
      status: 'REGISTERED',
      createdAt: new Date(),
    };
    this.participants.push(newUser);
    return newUser;
  }

  findAll() {
    return this.participants;
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
