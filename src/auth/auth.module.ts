import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { IsEmailUniqueValidatorConstraint } from './decorators/is-email-unique.decorator';
import { User, UserSchema } from './entities/user.entity';
import { RefreshTokenStrategy, TokenStrategy } from './strategies';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({}),
  ],
  providers: [
    UsersService,
    AuthService,
    AuthResolver,
    TokenStrategy,
    RefreshTokenStrategy,
    IsEmailUniqueValidatorConstraint,
  ],
})
export class AuthModule {}
