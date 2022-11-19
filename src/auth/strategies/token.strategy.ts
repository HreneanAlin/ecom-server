import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_TOKEN_SECRET } from 'src/common/helpers/constants';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_TOKEN_SECRET,
    });
  }
  validate(payload: any) {
    return payload;
  }
}
