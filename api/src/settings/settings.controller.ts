import { Controller, Get } from '@nestjs/common';

@Controller('settings')
export class SettingsController {
  @Get()
  getSettings() {
    return {
      message: 'Settings endpoint',
      version: '1.0.0'
    };
  }
}
