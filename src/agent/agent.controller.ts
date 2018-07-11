import { Get, Controller, Body, Param, Patch, UseGuards, Request, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';
import { UpdateAgentDto, UpdateAgentPasswordDto } from './agent.dto';
import { ValidationPipe } from '../validation.pipe';
import { IApiResult, IApiResultList, IApiResultOne } from '../api';
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

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param() params, @Body(new ValidationPipe()) dto: UpdateAgentDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    const { user } = req;

    if (user && user.id) {
      return await this.agentService.update(user.id, dto);
    } else {
      throw new HttpException(null, HttpStatus.FORBIDDEN);
    }
  }

  @Patch('update-password')
  @UseGuards(AuthGuard('jwt'))
  async passwordChange(
    @Request() req,
    @Param() params,
    @Body(new ValidationPipe()) dto: UpdateAgentPasswordDto,
  ): Promise<IApiResult<IApiResultOne<Agent>>> {
    const { user } = req;

    if (user && user.id) {
      return await this.agentService.updatePassword(user.id, dto);
    } else {
      throw new HttpException(null, HttpStatus.FORBIDDEN);
    }
  }
}
