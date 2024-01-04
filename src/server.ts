import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';

export class Server {
  private SERVER_PORT = 4001;
  constructor(
    private app: Application,
    private log: Logger
  ) {}

  startServer(): void {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      this.log.info(`Worker with process id of ${process.pid} on notification server has started `);

      this.app.use('', healthRoutes());

      httpServer.listen(this.SERVER_PORT, () => {
        this.log.info(`Notification Service running on port ${this.SERVER_PORT}`);
      });
    } catch (error) {
      this.log.error('error', 'NotificationService start error', error);
    }
  }
}
