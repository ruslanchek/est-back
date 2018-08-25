import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { IApiResultError } from './api';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const errorData: IApiResultError = exception['response'];
    const errorResult: IApiResultError = {
      code: errorData.code,
      status: errorData.status || status,
      details: errorData.details,
      fields: errorData.fields,
    };

    if(!errorResult.code) {
      switch (status) {
        case HttpStatus.INTERNAL_SERVER_ERROR : errorResult.code = 'INTERNAL_SERVER_ERROR'; break;
        case HttpStatus.BAD_REQUEST : errorResult.code = 'BAD_REQUEST'; break;
        case HttpStatus.ACCEPTED : errorResult.code = 'ACCEPTED'; break;
        case HttpStatus.AMBIGUOUS : errorResult.code = 'AMBIGUOUS'; break;
        case HttpStatus.BAD_GATEWAY : errorResult.code = 'BAD_GATEWAY'; break;
        case HttpStatus.CONFLICT : errorResult.code = 'CONFLICT'; break;
        case HttpStatus.CONTINUE : errorResult.code = 'CONTINUE'; break;
        case HttpStatus.CREATED : errorResult.code = 'CREATED'; break;
        case HttpStatus.EXPECTATION_FAILED : errorResult.code = 'EXPECTATION_FAILED'; break;
        case HttpStatus.FORBIDDEN : errorResult.code = 'FORBIDDEN'; break;
        case HttpStatus.FOUND : errorResult.code = 'FOUND'; break;
        case HttpStatus.GATEWAY_TIMEOUT : errorResult.code = 'GATEWAY_TIMEOUT'; break;
        case HttpStatus.GONE : errorResult.code = 'GONE'; break;
        case HttpStatus.HTTP_VERSION_NOT_SUPPORTED : errorResult.code = 'HTTP_VERSION_NOT_SUPPORTED'; break;
        case HttpStatus.I_AM_A_TEAPOT : errorResult.code = 'I_AM_A_TEAPOT'; break;
        case HttpStatus.NO_CONTENT : errorResult.code = 'NO_CONTENT'; break;
        case HttpStatus.MOVED_PERMANENTLY : errorResult.code = 'MOVED_PERMANENTLY'; break;
        case HttpStatus.URI_TOO_LONG : errorResult.code = 'URI_TOO_LONG'; break;
        case HttpStatus.UNSUPPORTED_MEDIA_TYPE : errorResult.code = 'UNSUPPORTED_MEDIA_TYPE'; break;
        case HttpStatus.PARTIAL_CONTENT : errorResult.code = 'PARTIAL_CONTENT'; break;
        case HttpStatus.OK : errorResult.code = 'OK'; break;
        case HttpStatus.NOT_FOUND : errorResult.code = 'NOT_FOUND'; break;
        case HttpStatus.SEE_OTHER : errorResult.code = 'SEE_OTHER'; break;
        case HttpStatus.UNAUTHORIZED : errorResult.code = 'UNAUTHORIZED'; break;
        default : {
          errorResult.status = 500;
          errorResult.code = 'UNKNOWN_ERROR';
        }
      }
    }

    response
      .status(errorResult.status)
      .json({
        payload: null,
        error: errorResult,
      });
  }
}
