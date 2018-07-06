import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { EAgentType } from './agent.enum';

export class CreateAgentDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;

  @IsEnum(EAgentType)
  @ApiModelProperty({
    required: true,
    enum: EAgentType,
  })
  readonly type: string;
}

export class UpdateAgentDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;

  @IsEnum(EAgentType)
  @IsOptional()
  @ApiModelProperty({
    required: false,
    enum: EAgentType,
  })
  readonly type: string;
}