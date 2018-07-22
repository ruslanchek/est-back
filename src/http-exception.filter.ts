import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import express from 'express';

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

      if(status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        if (exception.message.error) {
          details = exception.message.error;
        } else if (exception.message.response) {
          details = exception.message.response;
        } else if (exception.message) {
          details = exception.message;
        }
      }
    }

    console.error(exception);

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
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        code = 'INTERNAL_SERVER_ERROR';
        console.log(`Error`, request.method, request.originalUrl, exception.message);
        break;
      }
    }

    response
      .status(status === HttpStatus.INTERNAL_SERVER_ERROR ? status : 200)
      .json({
        payload: null,
        error: {
          status,
          code,
          details,
        },
      });
  }
}