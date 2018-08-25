import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { swagger } from './swagger';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    cors: true,
  });

  swagger(app);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT);
}

bootstrap();
