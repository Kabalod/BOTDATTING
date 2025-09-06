import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  getSettings() {
    return {
      message: 'Settings service',
      version: '1.0.0'
    };
  }
}
