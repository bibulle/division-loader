import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsModule } from '../stats/stats.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    StatsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL', 'mongodb://127.0.0.1:27017/test'),
        // uri: 'mongodb://127.0.0.1:27017/test',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  // constructor(private configService: ConfigService) {
  //   console.log(`"${configService.get('MONGO_URL', 'mongodb://127.0.0.1:27017/test')}"`);
  // }
}
