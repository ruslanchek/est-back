import { HttpException, HttpStatus } from '@nestjs/common';

export interface IApiResult<Payload> {
  payload: Payload;
  error: IApiResultError;
}

export interface IApiResultError {
  code: EApiErrorCode;
  details?: any;
}

export interface IApiResultCreate {
  id: number;
}

export interface IApiResultUpdate {
  id: number;
}

export interface IApiResultList<Entity> {
  list: Entity[];
}

export interface IApiResultOne<Entity> {
  entity: Entity;
}

export enum EApiErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  ENTRY_NOT_FOUND = 'ENTRY_NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  CONFLICT = 'CONFLICT',
}

export class Api {
  static error<Payload>(status: HttpStatus, error: IApiResultError): IApiResult<Payload> {
    const result: IApiResult<Payload> = {
      payload: null,
      error,
    };

    throw new HttpException(result, status);
  }

  static result<Payload>(payload: Payload): IApiResult<Payload> {
    return {
      payload,
      error: null,
    };
  }
}
