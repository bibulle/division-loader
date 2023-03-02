import { CharacterStats } from '@division-loader/apis';
import { Controller, Get, Logger } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  private readonly logger = new Logger(StatsController.name);

  constructor(private readonly _statsService: StatsService) {}

  @Get()
  async getCurrentValues(): Promise<CharacterStats[]> {
    return this._statsService.getCurrentValues();
  }
}
