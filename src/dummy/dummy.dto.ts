import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDummyDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;
}