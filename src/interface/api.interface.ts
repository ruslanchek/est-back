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