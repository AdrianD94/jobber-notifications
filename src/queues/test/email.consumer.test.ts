import { Config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { winstonLogger } from '@adriand94/jobber-shared';

import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '../email.consumer';

jest.mock('@notifications/queues/connection');
jest.mock('@adriand94/jobber-shared');
jest.mock('amqplib');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages method', () => {
    it('should be called ', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };

      const logger = {
        info: jest.fn()
      } as unknown as Logger;

      (<jest.Mock>createConnection).mockReturnValue(channel);
      (<jest.Mock>winstonLogger).mockReturnValue(logger);
      channel.assertQueue.mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });

      const connectionChannel = (await createConnection(logger, {} as Config)) as Channel;
      await consumeAuthEmailMessages(connectionChannel, logger, {} as Config);

      expect(connectionChannel.assertExchange).toHaveBeenCalledWith('jobber-email-notification', 'direct');
      expect(connectionChannel.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'jobber-email-notification', 'auth-email');
    });
  });

  describe('consumeOrderEmailMessages method', () => {
    it('should be called ', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };

      const logger = {
        info: jest.fn()
      } as unknown as Logger;

      (<jest.Mock>createConnection).mockReturnValue(channel);
      (<jest.Mock>winstonLogger).mockReturnValue(logger);
      channel.assertQueue.mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0 });

      const connectionChannel = (await createConnection(logger, {} as Config)) as Channel;
      await consumeOrderEmailMessages(connectionChannel, logger, {} as Config);

      expect(connectionChannel.assertExchange).toHaveBeenCalledWith('jobber-order-notification', 'direct');
      expect(connectionChannel.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel.bindQueue).toHaveBeenCalledWith('order-email-queue', 'jobber-order-notification', 'order-email');
    });
  });
});
