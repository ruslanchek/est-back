import * as jwt from 'jsonwebtoken';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AUTH_POLICY } from './auth.policy';
import { IJwtPayload, ITokenPayload } from './auth.interface';
import { AgentService } from '../agent/agent.service';
import { Api, EApiErrorCode, IApiResult, IApiResultOne } from '../api';
import { Agent } from '../agent/agent.entity';
import { LoginAgentDto, UpdateAgentDto } from '../agent/agent.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: AgentService) {
  }

  async createToken(payload: IJwtPayload): Promise<ITokenPayload> {
    const accessToken = jwt.sign(payload, AUTH_POLICY.SECRET_KEY, {
      expiresIn: AUTH_POLICY.EXPIRES_IN,
    });

    return {
      expiresIn: AUTH_POLICY.EXPIRES_IN,
      accessToken,
    };
  }

  async validateUser(payload: IJwtPayload): Promise<IApiResult<IApiResultOne<Agent>>> {
    return await this.usersService.findOne(payload.id);
  }

  async login(dto: LoginAgentDto): Promise<IApiResult<ITokenPayload>> {
    const entity = await this.usersService.findOneByEmailAndPassword(dto.email, dto.password);

    if (entity) {
      const tokenPayload: ITokenPayload = await this.createToken({
        id: entity.payload.entity.id,
      });

      return Api.result<ITokenPayload>(tokenPayload);
    } else {
      return Api.error<ITokenPayload>(HttpStatus.FORBIDDEN, {
        code: EApiErrorCode.NOT_AUTHORIZED,
      });
    }
  }
}
