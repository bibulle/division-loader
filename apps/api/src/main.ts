import { Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';

import { AppModule } from './app/app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { VersionInterceptor } from './interceptors/version.interceptor';

async function bootstrap() {
  let logger_levels: LogLevel[] = ['error', 'warn', 'log'];
  if (process.env.LOG_LEVEL) {
    switch (process.env.LOG_LEVEL.toUpperCase()) {
      case 'VERBOSE':
        logger_levels = ['error', 'warn', 'log', 'debug', 'verbose'];
        break;
      case 'DEBUG':
        logger_levels = ['error', 'warn', 'log', 'debug'];
        break;
      case 'LOG':
        logger_levels = ['error', 'warn', 'log'];
        break;
      default:
        logger_levels = ['error', 'warn'];
        break;
    }
  }

  console.log(`LOG_LEVEL : ${process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'LOG (by default)'}`);

  const app = await NestFactory.create(AppModule, {
    logger: logger_levels,
    cors: true,
  });

  const config = app.get<ConfigService>(ConfigService);
  app.useGlobalInterceptors(new LoggingInterceptor(), new VersionInterceptor());

  // // Add cors
  // app.use(cors());

  app.use(
    session({
      secret: config.get('SESSION_SECRET', 'SECRET_SESSION'),
      resave: true,
      saveUninitialized: true,
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app
    .listen(port, () => {
      Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    })
    .catch((reason) => {
      Logger.error('Error on serveur');
      Logger.error(reason);
    });
}

bootstrap();
