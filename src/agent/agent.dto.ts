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

  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;

  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly password: string;

  @IsString()
  @ApiModelProperty({
    required: false,
  })
  readonly phone: string;
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

  @IsString()
  @IsOptional()
  @ApiModelProperty({
    required: false,
  })
  readonly phone: string;
}

export class UpdateAgentPasswordDto {
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly password: string;
}

export class UpdateAgentEmailDto {
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;
}

export class LoginAgentDto {
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;

  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly password: string;
}

export class RegisterAgentDto {
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;

  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly password: string;
}