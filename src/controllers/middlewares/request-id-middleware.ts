import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function RequestIdMiddleware(_request: Request, response: Response, next: NextFunction): void {
  const uuid = uuidv4();
  response.locals.requestId = uuid;
  response.setHeader('X-Request-ID', uuid);
  next();
}
