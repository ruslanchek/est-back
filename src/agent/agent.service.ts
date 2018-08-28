import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';
import { Api, IApiResult, IApiResultList, IApiResultOne } from '../api';
import { Utils } from '../utils';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {
  }

  async findAll(): Promise<IApiResult<IApiResultList<Agent>>> {
    const list: Agent[] = await this.agentRepository.find();

    return Api.result<IApiResultList<Agent>>({
      list,
    });
  }

  async findOne(agentId): Promise<IApiResult<IApiResultOne<Agent>>> {
    agentId = Utils.parseId(agentId);

    const entity: Agent = await this.agentRepository.findOne(agentId);

    if (entity) {
      return Api.result<IApiResultOne<Agent>>({
        entity,
      });
    } else {
      return Api.error({
        status: HttpStatus.NOT_FOUND,
        code: 'ENTITY_NOT_FOUND',
      });
    }
  }
}
