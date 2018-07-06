import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advert } from './advert.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateAdvertDto } from './advert.dto';
import { Api, EApiErrorCode, IApiResult, IApiResultCreate, IApiResultList } from '../api';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>,
  ) {
  }

  public async findAll(): Promise<IApiResult<IApiResultList<Advert>>> {
    const list: Advert[] = await this.advertServiceRepository.find({
      relations: ['agent'],
    });

    return Api.result<IApiResultList<Advert>>({
      list,
    });
  }

  public async insert(advert: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    const result: InsertResult = await this.advertServiceRepository.insert(advert as QueryPartialEntity<Advert>);

    if (result && result.identifiers && result.identifiers[0] && result.identifiers[0].id) {
      return Api.result<IApiResultCreate>({
        id: result.identifiers[0].id,
      });
    } else {
      Api.error({
        code: EApiErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}