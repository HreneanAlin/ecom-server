import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_TOKEN_SECRET } from 'src/common/helpers/constants';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { UserDocument } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_TOKEN_SECRET,
    });
  }
  async validate(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user.hashRefreshToken) throw new UnauthorizedException();
    return user;
  }
}
