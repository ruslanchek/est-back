import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advert } from './advert.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateAdvertDto, UpdateAdvertDto } from './advert.dto';
import { Api, EApiErrorCode, IApiResult, IApiResultCreate, IApiResultList, IApiResultUpdate, IApiReultOne } from '../api';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>,
  ) {
  }

  public async findOne(id: number): Promise<IApiResult<IApiReultOne<Advert>>> {
    const entity: Advert = await this.advertServiceRepository.findOne(id, {
      relations: ['agent'],
    });

    return Api.result<IApiReultOne<Advert>>({
      entity,
    });
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

  public async update(advert: UpdateAdvertDto): Promise<IApiResult<IApiResultUpdate>> {
    const result: UpdateResult = await this.advertServiceRepository.update(advert.id, advert);

    console.log(result);

    return Api.result<IApiResultUpdate>({
      id: 1111,
    });
  }
}