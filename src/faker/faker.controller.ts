import { Controller, Get, Param, Patch, Post, Body, Request, UseGuards, UsePipes } from '@nestjs/common';
import { FakerService, IAdvert, IPreset } from './faker.service';
import { Api, IApiResult, IApiResultList } from '../api';

const GENERATE_OBJECTS_COUNT: number = 11;
const GENERATE_PRESETS_COUNT: number = 5;

@Controller('/api/faker')
export class FakerController {
  constructor(private readonly fakerService: FakerService) {
  }

  @Get('presets')
  async presets() {
    const list: IPreset[] = [];

    for (let i: number = 1; i < GENERATE_PRESETS_COUNT; i++) {
      list.push(this.fakerService.generatePreset());
    }

    return Api.result<IApiResultList<IPreset>>({
      list,
    });
  }

  @Get('adverts')
  async adverts() {
    const list: IAdvert[] = [];

    for (let i: number = 1; i < GENERATE_OBJECTS_COUNT; i++) {
      list.push(this.fakerService.generateAdvert(i));
    }

    return Api.result<IApiResultList<IAdvert>>({
      list,
    });
  }
}
