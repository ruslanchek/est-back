import { EApiErrorCode } from '../enum/api.enum';

export interface IApiResult<Payload> {
  payload: Payload;
  error: IApiResultError;
}

export interface IApiResultError {
  code: EApiErrorCode;
}

export interface IApiResultCreate {
  id: number;
}

export interface IApiResultList<Entity> {
  list: Entity[];
}

export interface IApiReultOne<Entity> {
  entity: Entity;
}