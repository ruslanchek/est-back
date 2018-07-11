import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { swagger } from './swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  swagger(app);
  await app.listen(process.env.PORT || 5667);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
