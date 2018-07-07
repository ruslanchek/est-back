import { Get, Controller, Body, Post, Param, Patch, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';
import { CreateAgentDto, UpdateAgentDto, UpdateAgentPasswordDto } from './agent.dto';
import { ValidationPipe } from '../validation.pipe';
import { IApiResult, IApiResultCreate, IApiResultList, IApiResultOne, IApiResultUpdate } from '../api';
import { AuthGuard } from '@nestjs/passport';

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

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body(new ValidationPipe()) dto: CreateAgentDto): Promise<IApiResult<IApiResultCreate>> {
    return await this.agentService.insert(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param() params, @Body(new ValidationPipe()) dto: UpdateAgentDto): Promise<IApiResult<IApiResultUpdate>> {
    return await this.agentService.update(params.id, dto);
  }

  // @Patch(':id/password-change')
  // @UseGuards(AuthGuard('jwt'))
  // async passwordChange(@Param() params, @Body(new ValidationPipe()) dto: UpdateAgentPasswordDto): Promise<IApiResult<IApiResultUpdate>> {
  //   return await this.agentService.update(params.id, dto);
  // }
}
