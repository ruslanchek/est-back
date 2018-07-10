import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { AUTH_POLICY } from './auth.policy';
import { IJwtPayload } from './auth.interface';
import { Api, EApiErrorCode } from 'api';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH_POLICY.SECRET_KEY,
    });
  }

  async validate(payload: IJwtPayload, done: any) {
    try {
      const user = await this.authService.validateUser(payload);
      done(null, user);
    } catch (e) {
      return done(
        Api.error(HttpStatus.UNAUTHORIZED, {
          code: EApiErrorCode.UNAUTHORIZED,
        }),
        false,
      );
    }
  }
}
