import {createMutualTlsServer, createServer} from '@hana/common';
import {Logger} from '@nestjs/common';
import {JwksModule} from './jwks.module';
import {SignModule} from './sign.module';

const logger = new Logger();

if (!process.env.JWKS) {
  logger.error('JWKS not set');
  process.exit(1);
}


const bootstrap = async () => {
  await createServer(JwksModule);
  await createMutualTlsServer(SignModule);
};

void bootstrap();
