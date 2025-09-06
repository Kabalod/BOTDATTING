import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantsModule } from './participants/participants.module';
import { SettingsModule } from './settings/settings.module';
import { EventsModule } from './events/events.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { Participant } from './participants/entities/participant.entity';
import { Event } from './events/entities/event.entity';
import { WaitlistEntry } from './waitlist/entities/waitlist.entity';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
          ttl: 300, // 5 минут по умолчанию
        }),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'botdatting',
      entities: [Participant, Event, WaitlistEntry],
      synchronize: true, // В продакшене использовать миграции
      logging: process.env.NODE_ENV === 'development',
    }),
    ParticipantsModule,
    SettingsModule,
    EventsModule,
    WaitlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
