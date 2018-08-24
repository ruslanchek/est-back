import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';
import { Api, IApiResult, IApiResultList, IApiResultOne } from '../api';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentServiceRepository: Repository<Agent>,
  ) {
  }

  async findAll(): Promise<IApiResult<IApiResultList<Agent>>> {
    try {
      const list: Agent[] = await this.agentServiceRepository.find();

      return Api.result<IApiResultList<Agent>>({
        list,
      });
    } catch (e) {
      return Api.unhandled(e, null);
    }
  }

  async findOne(id: number): Promise<IApiResult<IApiResultOne<Agent>>> {
    try {
      const entity: Agent = await this.agentServiceRepository.findOne(id);

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
    } catch (e) {
      return Api.unhandled(e, null);
    }
  }
}
