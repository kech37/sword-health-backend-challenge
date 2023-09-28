import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpErrorCode } from '../../@types/http-error-code';
import { Config } from '../../configs/config';
import { ErrorMapper } from '../../mappers/error-mapper';

export function JwtAuthenticationMiddleware(request: Request, response: Response, next: NextFunction): Response | void {
  const authorizationHeader = request.header('authorization');

  if (!authorizationHeader) {
    return response
      .status(HttpErrorCode.HTTP_401_Unauthorized)
      .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, HttpErrorCode.HTTP_401_Unauthorized, undefined, 'TOKEN NOT SENT'));
  }

  try {
    response.locals.jwtPayload = jwt.verify(authorizationHeader.split(' ')[1], Config.TOKEN_SCRET); // TODO Config different secrest?
  } catch (_error) {
    // TODO log error
    return response
      .status(HttpErrorCode.HTTP_401_Unauthorized)
      .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, HttpErrorCode.HTTP_401_Unauthorized, undefined, 'Invalid authorization provided'));
  }

  return next();
}
