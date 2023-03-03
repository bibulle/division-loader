import { CharacterStats } from '@division-loader/apis';
import { Controller, Get, Logger, Res, Headers, StreamableFile, HttpException, HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  private readonly logger = new Logger(StatsController.name);

  constructor(private readonly _statsService: StatsService) {}

  @Get('/current')
  async getCurrentValues(): Promise<CharacterStats[]> {
    return this._statsService.getCurrentValues();
  }
  @Get()
  async getAllValues(@Headers() headers: Record<string, string>, @Res({ passthrough: true }) res): Promise<StreamableFile> {
    return new Promise<StreamableFile>((resolve) => {
      this._statsService
        .getAllValueCachePath()
        .then((path) => {
          this._statsService
            .getAllValueCacheDateMs()
            .then((etag) => {
              if (headers['if-none-match'] === etag) {
                this.logger.debug('getAllValue : 304 No change');
                return res.status(304).send('No change');
              }
              res.set({
                ETag: etag,
              });

              const file = createReadStream(path);
              resolve(new StreamableFile(file));
            })
            .catch((err) => {
              this.logger.error(err);
              throw new HttpException('Something go wrong', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        })
        .catch((err) => {
          this.logger.error(err);
          throw new HttpException('Something go wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });
  }
}
