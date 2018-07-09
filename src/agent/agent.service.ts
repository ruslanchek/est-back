import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { AuthAgentDto, UpdateAgentDto } from './agent.dto';
import { Api, EApiErrorCode, IApiResult, IApiResultCreate, IApiResultList, IApiResultOne, IApiResultUpdate } from '../api';
import * as bcrypt from 'bcrypt';
import { async } from 'rxjs/internal/scheduler/async';

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

  async findOneByEmail(email: string): Promise<Agent> {
    return await this.agentServiceRepository.findOne({
      email,
    });
  }

  public async insert(dto: AuthAgentDto): Promise<IApiResultCreate> {
    const hashedPassword: string = await bcrypt.hash(dto.password, 10);
    const result: InsertResult = await this.agentServiceRepository.insert(Object.assign(dto, {
      password: hashedPassword,
    }));

    return {
      id: result.identifiers[0].id,
    };
  }
}
