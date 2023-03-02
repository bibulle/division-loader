import { CharacterStats } from '@division-loader/apis';
import { Injectable, Logger, Module } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICharacterStats } from './character-stats/character-stats.interface';
import { CharacterStatsSchema } from './character-stats/character-stats.schema';

@Injectable()
export class StatsDbService {
  private readonly logger = new Logger(StatsDbService.name);

  constructor(@InjectModel('CharacterStats') private readonly characterStatsModel: Model<ICharacterStats>) {}

  async save(characterStats: CharacterStats): Promise<void> {
    const createdCharStats = new this.characterStatsModel(characterStats);

    const lastValue = await this.characterStatsModel.findOne({ userId: characterStats.userId }, {}, { sort: { dateStart: -1 } });

    if (lastValue && lastValue.stats.timePlayed.value === createdCharStats.stats.timePlayed.value) {
      // this.logger.debug('Only updated');

      this.characterStatsModel
        .updateOne({ _id: lastValue._id }, { $set: { dateEnd: createdCharStats.dateStart } })
        .then(() => {
          // this.logger.debug(ret);
          return Promise.resolve();
        })
        .catch((reason) => {
          this.logger.error(reason);
          return Promise.reject(reason);
        });
    } else {
      // this.logger.debug('New value saved');
      createdCharStats
        .save()
        .then(() => {
          return Promise.resolve();
        })
        .catch((reason) => {
          this.logger.error(reason);
          return Promise.reject(reason);
        });
    }
  }

  async findLastCharacterStats(): Promise<CharacterStats[]> {
    // const stats = await this.characterStatsModel.find().sort({dateStart:1}).exec();
    const stats = await this.characterStatsModel
      .aggregate([
        {
          $group: {
            _id: '$userId',
            obj: {
              $top: {
                output: { dateStart: '$dateStart', dateEnd: '$dateEnd', userId: '$userId', platformInfo: '$platformInfo', userInfo: '$userInfo', stats: '$stats' },
                sortBy: { dateStart: -1 },
              },
            },
          },
        },
      ])
      .exec();

    // this.logger.debug(stats);
    return stats.map((mObj) => {
      return mObj.obj;
    });
  }

  async findAllCharacterStats(limitDate = new Date('2018-04-01T00:00:00.000Z')): Promise<CharacterStats[]> {
    const stats = await this.characterStatsModel.find({ dateStart: { $gte: limitDate } }).exec();

    return stats.map((mObj) => {
      return mObj.toObject();
    });
  }

  async deleteCharacterStats(stats: CharacterStats[]) {
    const ids: Types.ObjectId[] = stats.map((s) => {
      return new Types.ObjectId(s._id);
    });

    return this.characterStatsModel.deleteMany({ _id: { $in: ids } });
  }
}

@Module({
  imports: [MongooseModule.forFeature([{ name: 'CharacterStats', schema: CharacterStatsSchema }])],
  controllers: [],
  providers: [StatsDbService],
  exports: [StatsDbService],
})
export class StatsDbModule {}
