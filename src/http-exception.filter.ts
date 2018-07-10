import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import express from 'express';

export interface IApiResultError {
  code: string;
  details?: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: express.Response = ctx.getResponse();
    const request: express.Request = ctx.getRequest();

    let status: HttpStatus = exception.getStatus();
    let code = '';
    let details = null;

    if (exception && exception.message) {
      if (exception.message.status) {
        status = exception.message.status;
      }

      if (exception.message.error) {
        details = exception.message.error;
      }
    }

    switch (status) {
      case HttpStatus.BAD_REQUEST : {
        code = 'BAD_REQUEST';
        break;
      }

      case HttpStatus.FORBIDDEN : {
        code = 'FORBIDDEN';
        break;
      }

      case HttpStatus.CONFLICT : {
        code = 'CONFLICT';
        break;
      }

      case HttpStatus.NOT_FOUND : {
        code = 'NOT_FOUND';
        break;
      }

      case HttpStatus.UNAUTHORIZED : {
        code = 'UNAUTHORIZED';
        break;
      }

      default : {
        code = 'INTERNAL_SERVER_ERROR';
        console.log(`Error`, request.method, request.originalUrl, exception.message);
        break;
      }
    }

    response
      .status(status)
      .json({
        payload: null,
        error: {
          code,
          details,
        },
      });
  }
}