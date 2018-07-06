import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advert } from './advert.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { IApiResult, IApiResultCreate, IApiResultList } from '../interface/api.interface';
import { EApiErrorCode } from '../enum/api.enum';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateAdvertDto } from './advert.dto';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>
  ) {
  }

  public async findAll(): Promise<IApiResult<IApiResultList<Advert>>> {
    const list: Advert[] = await this.advertServiceRepository.find({
      relations: ['agent'],
    });

    return {
      payload: {
        list,
      },
      error: null,
    };
  }

  public async insert(advert: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    return new Promise<IApiResult<IApiResultCreate>>((resolve, reject) => {
      this.advertServiceRepository.insert(advert as QueryPartialEntity<Advert>).then((result: InsertResult) => {
        if (result && result.identifiers && result.identifiers[0] && result.identifiers[0].id) {
          resolve({
            payload: {
              id: result.identifiers[0].id,
            },
            error: null,
          });
        } else {
          resolve({
            payload: null,
            error: {
              code: EApiErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      }).catch(() => {
        resolve({
          payload: null,
          error: {
            code: EApiErrorCode.INTERNAL_SERVER_ERROR,
          },
        });
      });
    });
  }
}