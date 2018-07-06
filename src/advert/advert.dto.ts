import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { EAdvertContractType, EAdvertType } from './advert.enum';

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
  @ApiModelProperty()
  readonly constructionDate: number;

  @IsNumber()
  @ApiModelProperty()
  readonly price: number;

  @IsInt()
  @ApiModelProperty()
  readonly agent: number;
}
