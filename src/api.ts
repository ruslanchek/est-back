import { HttpStatus } from '@nestjs/common';

export interface IApiResult<Payload> {
  payload: Payload;
  error: IApiResultError;
}

export interface IApiResultError {
  status: HttpStatus;
  code: string;
  fields?: {[field: string]: string};
  details?: any;
}

export interface IApiResultCreate {
  id: number;
}

export interface IApiResultList<Entity> {
  list: Entity[];
}

export interface IApiResultOne<Entity> {
  entity: Entity;
}

export class Api {
  static result<Payload>(payload: Payload): IApiResult<Payload> {
    return {
      payload,
      error: null,
    };
  }

  static error(error: IApiResultError): IApiResult<any> {
    return {
      payload: null,
      error,
    };
  }
}
