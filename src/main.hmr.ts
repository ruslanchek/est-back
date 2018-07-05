import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { swagger } from './swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  swagger(app);
  await app.listen(5666);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
