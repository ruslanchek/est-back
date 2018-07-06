import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { CreateAgentDto } from './agent.dto';
import { Api, EApiErrorCode, IApiResult, IApiResultCreate, IApiResultList, IApiResultOne } from '../api';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentServiceRepository: Repository<Agent>,
  ) {
  }

  async findAll(): Promise<IApiResult<IApiResultList<Agent>>> {
    const list: Agent[] = await this.agentServiceRepository.find();

    return Api.result<IApiResultList<Agent>>({
      list,
    });
  }

  async findOne(id: number): Promise<IApiResult<IApiResultOne<Agent>>> {
    const entity: Agent = await this.agentServiceRepository.findOne(id);

    return Api.result<IApiResultOne<Agent>>({
      entity,
    });
  }

  public async insert(agent: CreateAgentDto): Promise<IApiResult<IApiResultCreate>> {
    const result: InsertResult = await this.agentServiceRepository.insert(agent as QueryPartialEntity<Agent>);

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
}
