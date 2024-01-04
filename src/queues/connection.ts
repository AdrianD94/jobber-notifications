import { Config } from '@notifications/config';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

export async function createConnection(log: Logger, config: Config): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: client.Channel = await connection.createChannel();
    log.info('Notification service connected to rabbitMq');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'Notification Service RabbitMq error', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
