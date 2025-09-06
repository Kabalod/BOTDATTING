import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  async create(@Body() createParticipantDto: CreateParticipantDto) {
    return await this.participantsService.create(createParticipantDto);
  }

  @Get()
  async findAll(@Query('eventId') eventId?: string) {
    return await this.participantsService.findAll(eventId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.participantsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateParticipantDto: UpdateParticipantDto) {
    return await this.participantsService.update(id, updateParticipantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.participantsService.remove(id);
  }
}