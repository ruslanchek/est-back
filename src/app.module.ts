import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger.middleware';
import { AdvertModule } from './advert/advert.module';
import { DummyModule } from './dummy/dummy.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '138.197.185.147',
      port: 3306,
      username: 'realthub',
      password: 'Tukzara2044',
      database: 'realthub',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AdvertModule,
    AgentModule,
  ],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('/api');
  }
}
