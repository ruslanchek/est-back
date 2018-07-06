import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advert } from './advert.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateAdvertDto, UpdateAdvertDto } from './advert.dto';
import { Api, EApiErrorCode, IApiResult, IApiResultCreate, IApiResultList, IApiResultUpdate, IApiResultOne } from '../api';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>,
  ) {
  }

  public async findOne(id: number): Promise<IApiResult<IApiResultOne<Advert>>> {
    const entity: Advert = await this.advertServiceRepository.findOne(id, {
      relations: ['agent'],
    });

    if (entity) {
      return Api.result<IApiResultOne<Advert>>({
        entity,
      });
    } else {
      Api.error(HttpStatus.NOT_FOUND, {
        code: EApiErrorCode.ENTRY_NOT_FOUND,
      });
    }
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
      Api.error(HttpStatus.BAD_REQUEST, {
        code: EApiErrorCode.BAD_REQUEST,
      });
    }
  }

  public async update(id: number, advert: UpdateAdvertDto): Promise<IApiResult<IApiResultUpdate>> {
    const findResult: Advert = await this.advertServiceRepository.findOne(id, {
      relations: ['agent'],
    });

    if (findResult) {
      const saveResult: Advert = await this.advertServiceRepository.save(findResult);

      return Api.result<IApiResultUpdate>(saveResult);
    } else {
      Api.error(HttpStatus.NOT_FOUND, {
        code: EApiErrorCode.ENTRY_NOT_FOUND,
      });
    }
  }
}