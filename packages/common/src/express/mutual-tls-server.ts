import {Logger} from '@nestjs/common';
import express from 'express';
import https from 'https';
import {ServerOptions} from 'https';
import {createApp} from './nest-factory';

const logger = new Logger();

if (!process.env.PORT_INTERNAL) {
  logger.error('PORT_INTERNAL not set');
  process.exit(1);
}
if (!process.env.JWKS_TLS_KEY) {
  logger.error('JWKS_TLS_KEY not set');
  process.exit(1);
}
if (!process.env.JWKS_TLS_CRT) {
  logger.error('JWKS_TLS_CRT not set');
  process.exit(1);
}
if (!process.env.CA_TLS_CRT) {
  logger.error('CA_TLS_CRT not set');
  process.exit(1);
}

export const createMutualTlsServer = async (module: any): Promise<void> => {
  const httpsOptions: ServerOptions = {
    ca: process.env.CA_TLS_CRT,
    cert: process.env.JWKS_TLS_CRT,
    key: process.env.JWKS_TLS_KEY,
    requestCert: true,
    rejectUnauthorized: !process.env.DEBUG,
    passphrase: process.env.JWKS_TLS_PWD,
  };

  const server = express();
  await createApp(module, server);

  const portInternal = Number.parseInt(process.env.PORT_INTERNAL!);
  https.createServer(httpsOptions, server).listen(portInternal, () => logger.log(`Ready on internal port ${portInternal}`));
};
