import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ApitrackerService } from './apitracker.service';
import { StatsDbModule } from './stats-db.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [ConfigModule, ScheduleModule, StatsDbModule, HttpModule],
  providers: [StatsService, ApitrackerService],
  controllers: [StatsController],
})
export class StatsModule {}
