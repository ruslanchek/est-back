import { Get, Controller, Param } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';
import { IApiResult, IApiResultList, IApiResultOne } from '../api';

@Controller('/api/agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {
  }

  @Get()
  async list(): Promise<IApiResult<IApiResultList<Agent>>> {
    return await this.agentService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<IApiResult<IApiResultOne<Agent>>> {
    return await this.agentService.findOne(params.id);
  }
}
