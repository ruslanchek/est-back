import { HttpException, HttpStatus } from '@nestjs/common';
import { IFileDeleteResult, IFileResult } from './upload.service';

export interface IApiResult<Payload> {
  payload: Payload;
  error: IApiResultError;
}

export interface IApiResultError {
  status: HttpStatus;
  code: string;
  fields?: { [field: string]: string };
  details?: any;
}

export interface IApiResultCreate {
  id: number;
}

export interface IApiResultList<Entity> {
  list: Entity[];
}

export interface IApiResultUploadFile {
  files: IFileResult[];
}

export interface IApiResultDeleteFile {
  files: IFileDeleteResult[];
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

  static unhandled(e, dto?: any): IApiResult<any> {
    if (dto && dto.error) {
      return dto;
    } else {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
