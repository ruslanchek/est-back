import { IApiResultError } from './http-exception.filter';

export interface IApiResult<Payload> {
  payload: Payload;
  error: IApiResultError;
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
}
