import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ApitrackerService } from './apitracker.service';
import { CronJob } from 'cron';
import { StatsDbService } from './stats-db.service';
import { CharacterStats } from '@division-loader/apis';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  private static readonly CRON_STATS_RECURRING_DEFAULT = CronExpression.EVERY_10_MINUTES;
  private static cronStatsRecurrent = StatsService.CRON_STATS_RECURRING_DEFAULT;

  constructor(private apitrackerService: ApitrackerService, private _configService: ConfigService, private _schedulerRegistry: SchedulerRegistry, private _statsDbService: StatsDbService) {
    StatsService.cronStatsRecurrent = this._configService.get('CRON_STATS_RECURRING', StatsService.CRON_STATS_RECURRING_DEFAULT);
    this.logger.debug(`cronStatsRecurrent : ${StatsService.cronStatsRecurrent}`);

    const job1 = new CronJob(StatsService.cronStatsRecurrent, () => {
      this.handle10MinutesCron();
    });
    this._schedulerRegistry.addCronJob('cronStatsRecurrent', job1);
    job1.start();
  }

  async handle10MinutesCron() {
    try {
      // const lastValues = await this._statsDbService.findLastCharacterStats();
      // lastValues.forEach(v => {
      //   this.logger.debug(`${v.userId} ${v.dateStart.toUTCString()}->${v.dateEnd.toUTCString()} : ${v.stats.timePlayed.value}`);
      // });

      const players = (this._configService.get('PLAYERS', '') as string)
        .split(',')
        .map((n) => n.trim())
        .filter((s) => s !== '');

      if (players.length === 0) {
        this.logger.error('ERROR : No player defined !!');
      }

      for (let index = 0; index < players.length; index++) {
        const player = players[index];
        await this.apitrackerService
          .getStats(player)
          .then((stats) => {
            this._statsDbService.save(stats).catch((reason) => {
              this.logger.error(reason);
            });
          })
          .catch((reason) => {
            this.logger.error(reason);
          });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getCurrentValues(): Promise<CharacterStats[]> {
    return this._statsDbService.findLastCharacterStats();
  }
}
