import {HealthChecker, HealthEndpoint, LivenessEndpoint, ReadinessEndpoint} from '@cloudnative/health-connect';
import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ExpressAdapter} from '@nestjs/platform-express';
import {Express} from 'express';

const healthcheck = new HealthChecker();

export const createApp = async (module: any, server: Express) => {
  const app = await NestFactory.create(
      module,
      new ExpressAdapter(server),
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use('/live', LivenessEndpoint(healthcheck));
  app.use('/ready', ReadinessEndpoint(healthcheck));
  app.use('/health', HealthEndpoint(healthcheck));

  await app.init();
};
