import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3090', 'http://localhost:3000'],
    credentials: true,
  });

  // Set global prefix for API
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001`);
}
bootstrap();
