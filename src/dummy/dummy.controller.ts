import { Get, Controller } from '@nestjs/common';
import { DummyService } from './dummy.service';
import { Dummy } from './dummy.entity';

@Controller(`/api/dummy`)
export class DummyController {
  constructor(private readonly agentService: DummyService) {
  }

  @Get()
  async root(): Promise<Dummy[]> {
    return await this.agentService.findAll();
  }
}
