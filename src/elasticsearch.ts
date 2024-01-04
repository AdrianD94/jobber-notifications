import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { ClusterHealthHealthResponseBody } from '@elastic/elasticsearch/lib/api/types';
import { Config } from '@notifications/config';

export async function checkConnection(config: Config, log: Logger): Promise<void> {
  const elasticSearchClient = new Client({
    node: `${config.ELASTIC_SEARCH_URL}`
  });
  let isConnected: boolean = false;
  let attemptNr: number = 0;

  while (!isConnected && attemptNr < 3) {
    try {
      const health: ClusterHealthHealthResponseBody = await elasticSearchClient.cluster.health({});
      log.info(`NotificationService ElasticSearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed. Retrying....');
      log.log('error', 'NotificationService checkConenction() method:', error);
      isConnected = false;
      attemptNr++;
    }
  }
}
