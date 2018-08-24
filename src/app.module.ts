import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger.middleware';
import { AdvertModule } from './advert/advert.module';
import { AgentModule } from './agent/agent.module';
import { AuthModule } from './auth/auth.module';
import { parse } from 'pg-connection-string';
import { ProfileModule } from './profile/profile.module';
import { AdvertImageModule } from './advert-image/advert-image.module';

const PG_CONFIG = parse(process.env.DATABASE_URL);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: PG_CONFIG.host,
      port: PG_CONFIG.port,
      username: PG_CONFIG.user,
      password: PG_CONFIG.password,
      database: PG_CONFIG.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: process.env.DATABASE_SSL === 'true',
      synchronize: true,
    }),
    AdvertModule,
    AdvertImageModule,
    AgentModule,
    ProfileModule,
    AuthModule,
  ],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/api');
  }
}
