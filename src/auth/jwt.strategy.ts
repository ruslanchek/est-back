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
    const user = await this.authService.validateUser(payload);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}