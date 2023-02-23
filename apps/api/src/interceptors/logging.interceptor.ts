import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  readonly logger = new Logger(LoggingInterceptor.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const message = context.getClass().name + ' ' + context.getHandler().name;
    const now = Date.now();

    this.logger.log(`Called : ${message}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`  Done : ${message} - ${Date.now() - now}ms`);
      })
    );
  }
}
