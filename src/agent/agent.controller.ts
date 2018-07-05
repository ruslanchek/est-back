import { Get, Controller } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';

@Controller(`/api/agent`)
export class AgentController {
  constructor(private readonly agentService: AgentService) {
  }

  @Get()
  async root(): Promise<Agent[]> {
    return await this.agentService.findAll();
  }
}
