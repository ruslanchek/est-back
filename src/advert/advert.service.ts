import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advert } from './advert.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { CreateAdvertDto, UpdateAdvertDto } from './advert.dto';
import { Api, IApiResult, IApiResultCreate, IApiResultList, IApiResultOne } from '../api';
import { Utils } from '../utils';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>,
  ) {
  }

  public async findOne(id: string): Promise<IApiResult<IApiResultOne<Advert>>> {
    const parsedId: number = Utils.parseId(id);

    if (isNaN(parsedId) || parsedId <= 1) {
      return Api.error({
        status: HttpStatus.BAD_REQUEST,
        code: 'BAD_REQUEST',
      });
    }

    const entity: Advert = await this.advertServiceRepository.findOne({
      id: parsedId,
      published: true,
    }, {
      relations: [
        'agent',
        'images',
      ],
    });

    if (entity) {
      return Api.result<IApiResultOne<Advert>>({
        entity,
      });
    } else {
      return Api.error({
        status: HttpStatus.NOT_FOUND,
        code: 'ENTITY_NOT_FOUND',
      });
    }
  }

  public async findAll(): Promise<IApiResult<IApiResultList<Advert>>> {
    const list: Advert[] = await this.advertServiceRepository.find({
      where: {
        published: true,
      },
      relations: ['agent', 'images'],
    });

    return Api.result<IApiResultList<Advert>>({
      list,
    });
  }

  public async insert(agentId, dto: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    agentId = Utils.parseId(agentId);

    const result: InsertResult = await this.advertServiceRepository.insert(Object.assign(dto, {
      agent: agentId,
    }));

    if (result && result.identifiers && result.identifiers[0] && result.identifiers[0].id) {
      return Api.result<IApiResultCreate>({
        id: result.identifiers[0].id,
      });
    } else {
      return Api.error({
        status: HttpStatus.BAD_REQUEST,
        code: 'BAD_REQUEST',
      });
    }
  }

  public async update(agentId, advertId, dto: UpdateAdvertDto): Promise<IApiResult<IApiResultOne<Advert>>> {
    agentId = Utils.parseId(agentId);
    advertId = Utils.parseId(advertId);

    const findResult: Advert = await this.advertServiceRepository.findOne(advertId, {
      relations: [
        'agent',
      ],
    });

    if (findResult) {
      if (findResult.agent.id === agentId) {
        await this.advertServiceRepository.save(Object.assign(findResult, dto));

        const entity: Advert = await this.advertServiceRepository.findOne(findResult.id);

        return Api.result<IApiResultOne<Advert>>({
          entity,
        });
      } else {
        return Api.error({
          status: HttpStatus.FORBIDDEN,
          code: 'FORBIDDEN',
        });
      }
    } else {
      return Api.error({
        status: HttpStatus.NOT_FOUND,
        code: 'ENTITY_NOT_FOUND',
      });
    }
  }
}