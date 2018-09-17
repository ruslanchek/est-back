import { Controller, Get, Param, Patch, Post, Body, Request, UseGuards, UsePipes } from '@nestjs/common';
import { FakerService, IObject, IPreset } from './faker.service';

const GENERATE_OBJECTS_COUNT: number = 11;
const GENERATE_PRESETS_COUNT: number = 5;

@Controller('/api/faker')
export class FakerController {
  constructor(private readonly fakerService: FakerService) {
  }

  @Get('presets')
  async presets() {
    const presets: IPreset[] = [];

    for (let i: number = 1; i < GENERATE_PRESETS_COUNT; i++) {
      presets.push(this.fakerService.generatePreset());
    }

    return presets;
  }

  @Get('adverts')
  async adverts() {
    const objects: IObject[] = [];

    for (let i: number = 1; i < GENERATE_OBJECTS_COUNT; i++) {
      objects.push(this.fakerService.generateObject(i));
    }

    return objects;
  }
}
