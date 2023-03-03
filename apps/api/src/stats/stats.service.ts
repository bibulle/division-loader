import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ApitrackerService } from './apitracker.service';
import { CronJob } from 'cron';
import { StatsDbService } from './stats-db.service';
import { ApiReturn, CharacterStats, Version } from '@division-loader/apis';
import { mkdirSync, rename, renameSync, statSync, writeFileSync } from 'fs';
import { dirname } from 'path';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  private static readonly CACHE_PATH_ALL = 'data/all-stats.json';

  private static readonly CRON_STATS_RECURRING_DEFAULT = CronExpression.EVERY_10_MINUTES;
  private static cronStatsRecurrent = StatsService.CRON_STATS_RECURRING_DEFAULT;

  private static isStatsRefreshDisabled = false;

  constructor(private apitrackerService: ApitrackerService, private _configService: ConfigService, private _schedulerRegistry: SchedulerRegistry, private _statsDbService: StatsDbService) {
    StatsService.cronStatsRecurrent = this._configService.get('CRON_STATS_RECURRING', StatsService.CRON_STATS_RECURRING_DEFAULT);
    this.logger.debug(`cronStatsRecurrent : ${StatsService.cronStatsRecurrent}`);

    StatsService.isStatsRefreshDisabled = this._configService.get<boolean>('DISABLE_STATS_REFRESH', false);

    this._calcCache();

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

      if (StatsService.isStatsRefreshDisabled) {
        this.logger.warn('Stats refresh Disable !!');
        return;
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
      this._calcCache();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getCurrentValues(): Promise<CharacterStats[]> {
    return this._statsDbService.findLastCharacterStats();
  }

  getAllValueCacheDateMs(): Promise<string> {
    const stats = statSync(StatsService.CACHE_PATH_ALL);
    return stats ? Promise.resolve(stats.mtimeMs.toString()) : Promise.reject(`File not found : '${StatsService.CACHE_PATH_ALL}'`);
  }
  getAllValueCachePath(): Promise<string> {
    const stats = statSync(StatsService.CACHE_PATH_ALL);
    return stats ? Promise.resolve(StatsService.CACHE_PATH_ALL) : Promise.reject(`File not found : '${StatsService.CACHE_PATH_ALL}'`);
  }
  private async _calcCache() {
    this.logger.debug('_calcCache');
    mkdirSync(dirname(StatsService.CACHE_PATH_ALL), { recursive: true });

    const allValues = await this._statsDbService.findAllCharacterStats();
    const data: ApiReturn = { data: allValues, version: new Version() };

    writeFileSync(`${StatsService.CACHE_PATH_ALL}.tmp`, JSON.stringify(data));
    renameSync(`${StatsService.CACHE_PATH_ALL}.tmp`, StatsService.CACHE_PATH_ALL);
  }
}
