import { HttpException } from '@nestjs/common';

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

export interface IApiReultOne<Entity> {
  entity: Entity;
}

export enum EApiErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class Api {
  static error<Payload>(error: IApiResultError): IApiResult<Payload> {
    const result: IApiResult<Payload> = {
      payload: null,
      error,
    };

    throw new HttpException(result, 400);
  }

  static result<Payload>(payload: Payload): IApiResult<Payload> {
    return {
      payload,
      error: null,
    };
  }
}
