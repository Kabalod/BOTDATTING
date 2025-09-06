import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WaitlistService, WaitlistEntryDto } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  async create(@Body() data: Omit<WaitlistEntryDto, 'id' | 'createdAt' | 'contacted'>) {
    return await this.waitlistService.create(data);
  }

  @Get()
  async findAll(@Query('city') city?: string) {
    return await this.waitlistService.findAll(city);
  }

  @Get('stats')
  async getStats() {
    return await this.waitlistService.getStats();
  }

  @Patch(':id/contacted')
  async updateContacted(
    @Param('id') id: string,
    @Body() data: { contacted: boolean; notes?: string }
  ) {
    return await this.waitlistService.updateContacted(id, data.contacted, data.notes);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.waitlistService.remove(id);
  }
}
