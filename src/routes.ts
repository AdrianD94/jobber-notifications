import express, { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export function healthRoutes(): Router {
  const router: Router = express.Router();
  router.get('/notification-health', (_: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Notification Service is healthy.');
  });
  return router;
}
