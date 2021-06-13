import {Logger} from '@nestjs/common';
import express from 'express';
import http from 'http';
import {createApp} from './nest-factory';

const logger = new Logger();

if (!process.env.PORT_PUBLIC) {
  logger.error('PORT_PUBLIC not set');
  process.exit(1);
}

export const createServer = async (module: any): Promise<void> => {
  const server = express();
  await createApp(module, server);

  const portPublic = Number.parseInt(process.env.PORT_PUBLIC!);

  http.createServer(server).listen(portPublic, () => logger.log(`Ready on public port ${portPublic}`));
};
