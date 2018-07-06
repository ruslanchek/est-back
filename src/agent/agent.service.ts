import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { CreateAgentDto, UpdateAgentDto } from './agent.dto';
import { Api, EApiErrorCode, IApiResult, IApiResultCreate, IApiResultList, IApiResultOne, IApiResultUpdate } from '../api';

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

    if (entity) {
      return Api.result<IApiResultOne<Agent>>({
        entity,
      });
    } else {
      Api.error(HttpStatus.NOT_FOUND, {
        code: EApiErrorCode.ENTRY_NOT_FOUND,
      });
    }
  }

  public async insert(dto: CreateAgentDto): Promise<IApiResult<IApiResultCreate>> {
    const result: InsertResult = await this.agentServiceRepository.insert(dto);

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

  public async update(id: number, dto: UpdateAgentDto): Promise<IApiResult<IApiResultUpdate>> {
    const findResult: Agent = await this.agentServiceRepository.findOne(id);

    if (findResult) {
      await this.agentServiceRepository.save(Object.assign(findResult, dto));
      const findNewResult: Agent = await this.agentServiceRepository.findOne(id);

      return Api.result<IApiResultUpdate>(findNewResult);
    } else {
      Api.error(HttpStatus.NOT_FOUND, {
        code: EApiErrorCode.ENTRY_NOT_FOUND,
      });
    }
  }
}
