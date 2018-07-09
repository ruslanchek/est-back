import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    cors: true,
  });

  swagger(app);

  await app.listen(5667);
}

bootstrap();
