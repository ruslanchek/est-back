import { Injectable } from '@nestjs/common';
import { Api, IApiResult, IApiResultEnum } from '../api';

@Injectable()
export class EnumService {
  getEnum(e): IApiResult<IApiResultEnum> {
    return Api.result<IApiResultEnum>({
      enum: Object.keys(e).map(key => e[key]),
    });
  }
}
