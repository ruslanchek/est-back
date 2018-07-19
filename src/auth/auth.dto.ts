import { IsEmail, IsString, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { AUTH_POLICY } from './auth.policy';

export class AuthDto {
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
