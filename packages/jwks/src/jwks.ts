import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {JwksModule} from './jwks.module';

const logger = new Logger();

if (!process.env.WELL_KNOWN_PATH) {
  logger.error('WELL_KNOWN_PATH not set');
  process.exit(1);
}
if (!process.env.JWKS) {
  logger.error('JWK not set');
  process.exit(1);
}

const bootstrap = async () =>{
  const app = await NestFactory.create(JwksModule);
  app.enableCors();

  const port = Number.parseInt(process.env.PORT || '80');

  await app.listen(port, () => logger.log(`Ready on port ${port}`));
};

void bootstrap();
