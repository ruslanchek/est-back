import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;
}