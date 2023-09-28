import { Request, Response } from 'express';

export type AsyncRequestHandler = (request: Request, response: Response) => Promise<Response>;

export type AsyncRequestHandlerErrorWrapper = (handler: AsyncRequestHandler) => AsyncRequestHandler;
