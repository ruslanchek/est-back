import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    cors: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    swagger(app);
  }

  await app.listen(process.env.PORT);
}

bootstrap();
