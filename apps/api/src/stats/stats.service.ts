import { ApiReturn, CategoryDescription, CharacterStats, Version } from '@division-loader/apis';
import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { ApitrackerService } from './apitracker.service';
import { StatsDbService } from './stats-db.service';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  private static readonly CACHE_PATH_ALL = 'data/all-stats.json';
  private static readonly CACHE_PATH_CURRENT = 'data/current-stats.json';

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
            this._statsDbService
              .save(stats)
              .then(() => {
                this.saveCurrentValueInCache(stats);
              })
              .catch((reason) => {
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
    return this._statsDbService
      .findLastCharacterStats()
      .then((stats) => {
        for (let i = 0; i < stats.length; i++) {
          const stat = stats[i];
          this._fillStats(stat);
        }
        return Promise.resolve(stats);
      })
      .catch((reason) => {
        return Promise.reject(reason);
      });
  }
  async getStatsDescription(): Promise<CategoryDescription[]> {
    return new Promise<CategoryDescription[]>((resolve, reject) => {
      this._statsDbService
        .findLastCharacterStats()
        .then((charStats) => {
          const stats = charStats.flatMap((char) => {
            return Object.entries(this._fillStats(char).stats).map((entries) => {
              const key = entries[0];
              const value = entries[1];

              value.key = key;

              return value;
            });
          });
          const descriptions = stats.reduce((ret, stat) => {
            let category = ret.find((d) => d.category === stat.category);
            if (!category) {
              category = { category: stat.category, descriptions: [] };
              ret.push(category);
            }

            let description = category.descriptions.find((d) => d.displayName === stat.displayName);
            if (!description) {
              description = { key: stat.key, displayName: stat.displayName, description: stat.description };
              category.descriptions.push(description);
            }

            return ret;
          }, [] as CategoryDescription[]);

          resolve(descriptions);
        })
        .catch((reason) => {
          this.logger.error(reason);
          reject(reason);
        });
    });
  }

  getAllValueCacheDateMs(): Promise<string> {
    const stats = statSync(StatsService.CACHE_PATH_ALL);
    return stats ? Promise.resolve(stats.mtimeMs.toString()) : Promise.reject(`File not found : '${StatsService.CACHE_PATH_ALL}'`);
  }
  getAllValueCachePath(): Promise<string> {
    const stats = statSync(StatsService.CACHE_PATH_ALL);
    return stats ? Promise.resolve(StatsService.CACHE_PATH_ALL) : Promise.reject(`File not found : '${StatsService.CACHE_PATH_ALL}'`);
  }
  getCurrentValueCacheDateMs(): Promise<string> {
    const stats = statSync(StatsService.CACHE_PATH_CURRENT);
    return stats ? Promise.resolve(stats.mtimeMs.toString()) : Promise.reject(`File not found : '${StatsService.CACHE_PATH_CURRENT}'`);
  }
  getCurrentValueCachePath(): Promise<string> {
    const stats = statSync(StatsService.CACHE_PATH_CURRENT, { throwIfNoEntry: false });
    return stats ? Promise.resolve(StatsService.CACHE_PATH_CURRENT) : Promise.reject(`File not found : '${StatsService.CACHE_PATH_CURRENT}'`);
  }
  private async _calcCache() {
    this.logger.debug('_calcCache');
    mkdirSync(dirname(StatsService.CACHE_PATH_ALL), { recursive: true });

    const allValues = await this._statsDbService.findAllCharacterStats();
    allValues.forEach((stats) => {
      this._fillStats(stats);
    });
    const data: ApiReturn = { data: allValues, version: new Version() };

    writeFileSync(`${StatsService.CACHE_PATH_ALL}.tmp`, JSON.stringify(data), 'utf8');
    renameSync(`${StatsService.CACHE_PATH_ALL}.tmp`, StatsService.CACHE_PATH_ALL);
  }

  private _fillStats(srcStats: CharacterStats): CharacterStats {
    srcStats.stats.levelPlus = { ...srcStats.stats.highestPlayerLevel };

    if (srcStats.stats.levelPlus.value === 30) {
      srcStats.stats.levelPlus = { ...srcStats.stats.latestGearScore };
    }

    srcStats.stats.levelPlus.displayName = 'Level+';

    // this.logger.debug(JSON.stringify(srcStats, null, 2));
    return srcStats;
  }

  async saveCurrentValueInCache(stats: CharacterStats): Promise<void> {
    // this.logger.debug(JSON.stringify(stats,null,2));

    let values: CharacterStats[] = [];

    const path = await this.getCurrentValueCachePath().catch((reason) => {
      this.logger.warn(reason);
    });

    if (path) {
      const old = JSON.parse(readFileSync(path, 'utf8')) as ApiReturn;
      values = old.data as CharacterStats[];
    }

    values = values.filter((v) => v.userId !== stats.userId);
    values.push(stats);

    const ret = {
      version: new Version(),
      data: values,
    };
    writeFileSync(`${StatsService.CACHE_PATH_CURRENT}.tmp`, JSON.stringify(ret, null, 2), 'utf8');
    renameSync(`${StatsService.CACHE_PATH_CURRENT}.tmp`, StatsService.CACHE_PATH_CURRENT);
  }
}
