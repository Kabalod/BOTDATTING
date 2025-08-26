import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantsModule } from './participants/participants.module';
import { SettingsModule } from './settings/settings.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ParticipantsModule, SettingsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
