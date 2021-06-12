import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {HealthChecker, HealthEndpoint, LivenessEndpoint, ReadinessEndpoint} from '@cloudnative/health-connect';
import {JwksModule} from './jwks.module';

const logger = new Logger();
const healthcheck = new HealthChecker();

if (!process.env.JWKS) {
  logger.error('JWK not set');
  process.exit(1);
}

const bootstrap = async () =>{
  const app = await NestFactory.create(JwksModule);
  app.enableCors();

  app.use('/live', LivenessEndpoint(healthcheck));
  app.use('/ready', ReadinessEndpoint(healthcheck));
  app.use('/health', HealthEndpoint(healthcheck));

  const port = Number.parseInt(process.env.PORT || '80');
  await app.listen(port, () => logger.log(`Ready on port ${port}`));
};

void bootstrap();
