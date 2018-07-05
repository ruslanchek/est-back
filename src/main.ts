import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  swagger(app);
  await app.listen(5666);
}

bootstrap();
