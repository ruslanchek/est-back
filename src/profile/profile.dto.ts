import { EAgentType } from '../agent/agent.enum';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { AUTH_POLICY } from '../auth/auth.policy';

export class UpdateProfileDto {
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

export class UpdateProfilePasswordDto {
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

export class UpdateProfileEmailDto {
  @IsEmail()
  @ApiModelProperty({
    required: true,
  })
  readonly email: string;
}