import { Version } from '@division-loader/apis';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class VersionInterceptor implements NestInterceptor {
  readonly logger = new Logger(VersionInterceptor.name);
  readonly version = new Version();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // in case of stream
        if (data.stream) {
          return data;
        }
        // this.logger.debug(data.stream);
        if (!data) {
          data = {};
        }
        if (!data.data) {
          data = { data: data };
        }

        // add version
        data.version = this.version;

        //this.logger.debug(data);

        return data;
      })
    );
  }
}
