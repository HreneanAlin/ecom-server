import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_SECRET } from 'src/common/helpers/constants';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtRefreshDto } from '../dto/jwt-refresh-payload.dto';
import { UserRefreshDTO } from '../dto/user-refresh.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtRefreshDto): UserRefreshDTO {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
