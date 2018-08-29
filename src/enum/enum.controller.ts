import { Controller, Get } from '@nestjs/common';
import { IApiResult, IApiResultEnum } from '../api';
import { EnumService } from './enum.service';
import { EAdvertContractType, EAdvertType } from '../advert/advert.enum';

@Controller('/api/enum')
export class EnumController {
  constructor(private readonly enumService: EnumService) {
  }

  @Get('/advert-type')
  advertType(): IApiResult<IApiResultEnum> {
    return this.enumService.getEnum(EAdvertType);
  }

  @Get('/advert-contract-type')
  advertContractType(): IApiResult<IApiResultEnum> {
    return this.enumService.getEnum(EAdvertContractType);
  }
}
