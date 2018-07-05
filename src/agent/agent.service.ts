import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent, CreateAgentDto } from './agent.entity';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EApiErrorCode } from '../enum/api.enum';
import { IApiResult, IApiResultCreate } from '../interface/api.interface';
import { Advert, CreateAdvertDto } from '../advert/advert.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentServiceRepository: Repository<Agent>,
  ) {
  }

  async findAll(): Promise<Agent[]> {
    return await this.agentServiceRepository.find();
  }

  public async insert(agent: CreateAgentDto): Promise<IApiResult<IApiResultCreate>> {
    return new Promise<IApiResult<IApiResultCreate>>((resolve, reject) => {
      this.agentServiceRepository.insert(agent as QueryPartialEntity<Agent>).then((result: InsertResult) => {
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
