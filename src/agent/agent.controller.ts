import { Get, Controller, Body, Post, Param } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';
import { IApiResult, IApiResultCreate, IApiResultList, IApiReultOne } from '../interface/api.interface';
import { CreateAgentDto } from './agent.dto';
import { ValidationPipe } from '../validation.pipe';

@Controller('/api/agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {
  }

  @Get()
  async list(): Promise<IApiResult<IApiResultList<Agent>>> {
    return await this.agentService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<IApiResult<IApiReultOne<Agent>>> {
    return await this.agentService.findOne(params.id);
  }

  @Post()
  async create(@Body(new ValidationPipe()) createAgentDto: CreateAgentDto): Promise<IApiResult<IApiResultCreate>> {
    return await this.agentService.insert(createAgentDto);
  }
}
