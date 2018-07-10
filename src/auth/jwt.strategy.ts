import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_POLICY } from './auth.policy';
import { IJwtPayload } from './auth.interface';

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
      const entity = await this.authService.validateUser(payload);
      done(null, entity.payload.entity);
    } catch (e) {
      return done(
        new UnauthorizedException(),
        false,
      );
    }
  }
}
