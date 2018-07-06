import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { EAdvertContractType, EAdvertType } from './advert.enum';
import { Agent } from '../agent/agent.entity';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';

export class CreateAdvertDto {
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly title: string;

  @IsEnum(EAdvertType)
  @ApiModelProperty({
    required: true,
    enum: EAdvertType,
  })
  readonly type: string;

  @IsEnum(EAdvertContractType)
  @ApiModelProperty({
    required: true,
    enum: EAdvertContractType,
  })
  readonly contractType: string;

  @IsInt()
  @IsOptional()
  @ApiModelProperty({
    required: false,
  })
  readonly constructionDate: number;

  @IsNumber()
  @ApiModelProperty({
    required: true,
  })
  readonly price: number;

  @IsInt()
  @ApiModelProperty({
    required: true,
  })
  readonly agent: Agent;
}

export class UpdateAdvertDto {
  @IsString()
  @IsOptional()
  @ApiModelProperty({
    required: false,
  })
  readonly title: string;

  @IsEnum(EAdvertType)
  @IsOptional()
  @ApiModelProperty({
    required: true,
    enum: EAdvertType,
  })
  readonly type: string;

  @IsEnum(EAdvertContractType)
  @IsOptional()
  @ApiModelProperty({
    required: true,
    enum: EAdvertContractType,
  })
  readonly contractType: string;

  @IsInt()
  @IsOptional()
  @ApiModelProperty({
    required: false,
  })
  readonly constructionDate: number;

  @IsNumber()
  @IsOptional()
  @ApiModelProperty({
    required: false,
  })
  readonly price: number;
}