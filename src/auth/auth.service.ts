import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { AUTH_POLICY } from './auth.policy';
import { IJwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
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
    // put some validation logic here
    // for example query user by id/email/username
    return {};
  }
}