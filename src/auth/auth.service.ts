import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';
import { JwtPayload } from './auth.interface';
import { AUTH_POLICY } from './auth.policy';

@Injectable()
export class AuthService {
  constructor(private readonly agentService: AgentService) {}

  createToken() {
    const user: JwtPayload = {
      email: 'user@email.com',
    };

    jwt.sign(user, AUTH_POLICY.SECRET_KEY, {
      expiresIn: 3600,
    });
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.agentService.findOneByEmail(payload.email);
  }
}