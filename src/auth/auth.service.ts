import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUser } from './dto/create-user.input';
import { UsersService } from './users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  JWT_REFRESH_SECRET,
  JWT_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_SECONDS,
  TOKEN_EXPIRATION_SECONDS,
} from 'src/common/helpers/constants';
import { ITokens } from 'src/common/interfaces';
import { mapUserToUserDto, UserDto } from './dto/user.dto';
import { SignInLocal } from './dto/sign-in-local.input';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(_id: string, email: string): Promise<ITokens> {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: _id,
          email,
        },
        {
          expiresIn: TOKEN_EXPIRATION_SECONDS,
          secret: JWT_TOKEN_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: _id,
          email,
        },
        {
          expiresIn: REFRESH_TOKEN_EXPIRATION_SECONDS,
          secret: JWT_REFRESH_SECRET,
        },
      ),
    ]);
    return {
      token,
      refreshToken,
    };
  }

  async signUpLocal(createUser: CreateUser): Promise<UserDto> {
    createUser.password = await argon2.hash(createUser.password);
    const user = await this.usersService.create(createUser);
    const { token, refreshToken } = await this.getTokens(user._id, user.email);
    user.hashRefreshToken = await argon2.hash(refreshToken);
    await user.save();
    return mapUserToUserDto(user, token, refreshToken);
  }

  async signInLocal({ email, password }: SignInLocal) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('wrong email');
    const passwordMatches = await argon2.verify(user.password, password);
    if (!passwordMatches) throw new BadRequestException('wrong password');
    const { token, refreshToken } = await this.getTokens(user.id, user.email);
    user.hashRefreshToken = await argon2.hash(refreshToken);
    await user.save();
    return mapUserToUserDto(user, token, refreshToken);
  }

  async refreshTokens(_id: string, refreshToken: string): Promise<TokensDto> {
    const user = await this.usersService.findOne(_id);
    if (!user) throw new BadRequestException('Something went wrong ');
    const refreshTokensMatches = await argon2.verify(
      user.hashRefreshToken,
      refreshToken,
    );
    if (!refreshTokensMatches)
      throw new BadRequestException('Something went wrong');

    const { token, refreshToken: newRefreshToken } = await this.getTokens(
      _id,
      user.email,
    );
    user.hashRefreshToken = await argon2.hash(newRefreshToken);
    await user.save();
    return {
      token,
      refreshToken,
    };
  }
}