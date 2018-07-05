import { Get, Controller } from '@nestjs/common';
import { ObjectItemService } from './object-item.service';
import { ObjectItem } from './object-item.entity';

@Controller(`/api/object-item`)
export class ObjectItemController {
  constructor(private readonly objectItemService: ObjectItemService) {
  }

  @Get()
  async root(): Promise<ObjectItem[]> {
    return await this.objectItemService.findAll();
  }
}
