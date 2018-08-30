import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { EAdvertContractType, EAdvertType } from './advert.enum';
import { Agent } from '../agent/agent.entity';

export class CreateAdvertDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({
    required: true,
  })
  readonly title: string;

  @IsEnum(EAdvertType)
  @IsNotEmpty()
  @ApiModelProperty({
    required: true,
    enum: EAdvertType,
  })
  readonly type: string;

  @IsEnum(EAdvertContractType)
  @IsNotEmpty()
  @ApiModelProperty({
    required: true,
    enum: EAdvertContractType,
  })
  readonly contractType: string;

  @IsInt()
  @IsOptional()
  @IsNotEmpty()
  @ApiModelProperty({
    required: false,
  })
  readonly constructionDate: number;

  @IsNumber()
  @ApiModelProperty({
    required: true,
  })
  readonly price: number;
}

export class UpdateAdvertDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiModelProperty({
    required: false,
  })
  readonly title: string;

  @IsEnum(EAdvertType)
  @IsOptional()
  @IsNotEmpty()
  @ApiModelProperty({
    required: true,
    enum: EAdvertType,
  })
  readonly type: string;

  @IsEnum(EAdvertContractType)
  @IsOptional()
  @IsNotEmpty()
  @ApiModelProperty({
    required: true,
    enum: EAdvertContractType,
  })
  readonly contractType: string;

  @IsInt()
  @IsOptional()
  @IsNotEmpty()
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