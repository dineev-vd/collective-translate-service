import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { UserService } from 'user/user.service';
import { Request } from 'express';
import { jwtConstants } from './constants';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['refresh_token'];
        },
      ]),
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies['refresh_token'];
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.sub,
    );
  }
}
