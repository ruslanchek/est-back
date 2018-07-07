import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { AUTH_POLICY } from './auth.policy';
import { IJwtPayload } from './auth.interface';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: AgentService) { }

  async createToken() {
    const payload: IJwtPayload = {
      email: 'test@email1.com',
      id: 1,
    };

    const accessToken = jwt.sign(payload, AUTH_POLICY.SECRET_KEY, {
      expiresIn: AUTH_POLICY.EXPIRES_IN,
    });

    return {
      expiresIn: AUTH_POLICY.EXPIRES_IN,
      accessToken,
    };
  }

  async validateUser(payload: IJwtPayload): Promise<any> {
    const agent = await this.usersService.findOneByEmail(payload.email);

    return agent;
  }
}