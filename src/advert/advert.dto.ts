import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { EAdvertContractType, EAdvertType } from './advert.enum';
import { Agent } from '../agent/agent.entity';

export class CreateAdvertDto {
  @IsString()
  @ApiModelProperty()
  readonly title: string;

  @IsEnum(EAdvertType)
  @ApiModelProperty()
  readonly type: string;

  @IsEnum(EAdvertContractType)
  @ApiModelProperty()
  readonly contractType: string;

  @IsNumber()
  @IsOptional()
  @ApiModelProperty()
  readonly constructionDate: number;

  @IsNumber()
  @ApiModelProperty()
  readonly price: number;

  @IsInt()
  @ApiModelProperty()
  readonly agent: Agent;
}

export class UpdateAdvertDto {
  @IsNumber()
  @ApiModelProperty()
  readonly id: number;

  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly title: string;

  @IsEnum(EAdvertType)
  @IsOptional()
  @ApiModelProperty()
  readonly type: string;

  @IsEnum(EAdvertContractType)
  @IsOptional()
  @ApiModelProperty()
  readonly contractType: string;

  @IsNumber()
  @IsOptional()
  @ApiModelProperty()
  readonly constructionDate: number;

  @IsNumber()
  @IsOptional()
  @ApiModelProperty()
  readonly price: number;
}