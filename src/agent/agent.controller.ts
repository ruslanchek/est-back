import { Get, Controller, Body, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';
import { IApiResult, IApiResultCreate } from '../interface/api.interface';
import { CreateAgentDto } from './agent.dto';
import { ValidationPipe } from '../validation.pipe';

@Controller('/api/agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {
  }

  @Get()
  async root(): Promise<Agent[]> {
    return await this.agentService.findAll();
  }

  @Post()
  async create(@Body(new ValidationPipe()) createAgentDto: CreateAgentDto): Promise<IApiResult<IApiResultCreate>> {
    return await this.agentService.insert(createAgentDto);
  }
}
