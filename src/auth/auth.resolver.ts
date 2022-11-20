import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { CreateUser } from './dto/create-user.input';
import { SignInLocal } from './dto/sign-in-local.input';
import { SignOutDto } from './dto/sign-out.dto';
import { TokensDto } from './dto/tokens.dto';
import { UserRefreshDTO } from './dto/user-refresh.dto';
import { UserWithTokensDto } from './dto/user-with-tokens.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => UserWithTokensDto)
  signUpLocal(
    @Args('createUserInput', { type: () => CreateUser }) createUser: CreateUser,
  ) {
    return this.authService.signUpLocal(createUser);
  }

  @Public()
  @Mutation(() => UserWithTokensDto)
  signInLocal(@Args('signInLocal') signInLocal: SignInLocal) {
    return this.authService.signInLocal(signInLocal);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => TokensDto)
  refreshTokens(@CurrentUser() user: UserRefreshDTO) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @Query(() => UserDto)
  me(@CurrentUser() user: User) {
    return this.authService.mapToUserDto(user);
  }

  @Mutation(() => SignOutDto)
  signOut(@CurrentUser() user: UserDocument) {
    return this.authService.signOut(user);
  }
}
