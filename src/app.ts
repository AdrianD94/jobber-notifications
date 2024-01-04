import { winstonLogger } from '@adriand94/jobber-shared';
import { Logger } from 'winston';
import { Config } from '@notifications/config';
import express, { Express } from 'express';
import { Server } from '@notifications/server';
import { Channel } from 'amqplib';

import { checkConnection } from './elasticsearch';
import { createConnection } from './queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/email.consumer';

async function initialize(): Promise<void> {
  const config = new Config();
  const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

  await checkConnection(config, log);
  const emailChannel = (await createConnection(log, config)) as Channel;
  const app: Express = express();
  const server = new Server(app, log);

  server.startServer();
  log.info('Notification Service initialized');
  await consumeAuthEmailMessages(emailChannel, log, config);
  await consumeOrderEmailMessages(emailChannel, log, config);
}

initialize();
