import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateAdvertDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;

  @IsInt()
  @ApiModelProperty()
  readonly agentId: number;
}