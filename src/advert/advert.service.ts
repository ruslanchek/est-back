import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advert } from './advert.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { CreateAdvertDto, UpdateAdvertDto } from './advert.dto';
import { Api, IApiResult, IApiResultCreate, IApiResultList, IApiResultOne } from '../api';
import { MailingService } from 'mailing.service';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>,
    private readonly mailingService: MailingService,
  ) {
  }

  public async findOne(id: number): Promise<IApiResult<IApiResultOne<Advert>>> {
    try {
      const entity: Advert = await this.advertServiceRepository.findOne(id, {
        relations: ['agent'],
      });

      if (entity) {
        return Api.result<IApiResultOne<Advert>>({
          entity,
        });
      } else {
        throw new HttpException(null, HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAll(): Promise<IApiResult<IApiResultList<Advert>>> {
    try {
      const list: Advert[] = await this.advertServiceRepository.find({
        relations: ['agent'],
      });

      return Api.result<IApiResultList<Advert>>({
        list,
      });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async insert(agentId: number, dto: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    try {
      const result: InsertResult = await this.advertServiceRepository.insert(Object.assign(dto, {
        agent: agentId,
      }));

      if (result && result.identifiers && result.identifiers[0] && result.identifiers[0].id) {
        return Api.result<IApiResultCreate>({
          id: result.identifiers[0].id,
        });
      } else {
        throw new HttpException(null, HttpStatus.BAD_REQUEST);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(agentId: number, id: number, dto: UpdateAdvertDto): Promise<IApiResult<IApiResultOne<Advert>>> {
    try {
      const findResult: Advert = await this.advertServiceRepository.findOne(id, {
        relations: ['agent'],
      });

      if (findResult) {
        if (findResult.agent.id === agentId) {
          await this.advertServiceRepository.save(Object.assign(findResult, dto));

          const entity: Advert = await this.advertServiceRepository.findOne(id, {
            relations: ['agent'],
          });

          return Api.result<IApiResultOne<Advert>>({
            entity,
          });
        } else {
          throw new HttpException(null, HttpStatus.FORBIDDEN);
        }
      } else {
        throw new HttpException(null, HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}