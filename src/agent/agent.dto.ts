import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { EAgentType } from './agent.enum';
import { AUTH_POLICY } from '../auth/auth.policy';

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
  @Length(AUTH_POLICY.PASSWORD_MIN_LENGTH, AUTH_POLICY.PASSWORD_MAX_LENGTH)
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly oldPassword: string;

  @Length(AUTH_POLICY.PASSWORD_MIN_LENGTH, AUTH_POLICY.PASSWORD_MAX_LENGTH)
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly password: string;
}

export class UpdateAgentEmailDto {
  @IsEmail()
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;
}

export class AuthAgentDto {
  @IsEmail()
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;

  @Length(AUTH_POLICY.PASSWORD_MIN_LENGTH, AUTH_POLICY.PASSWORD_MAX_LENGTH)
  @IsString()
  @ApiModelProperty({
    required: true,
  })
  readonly password: string;
}
