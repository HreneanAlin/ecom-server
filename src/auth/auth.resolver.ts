import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { CreateUser } from './dto/create-user.input';
import { SignInLocal } from './dto/sign-in-local.input';
import { TokensDto } from './dto/tokens.dto';
import { UserRefreshDTO } from './dto/user-refresh.dto';
import { UserDto } from './dto/user.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => UserDto)
  signUpLocal(
    @Args('createUserInput', { type: () => CreateUser }) createUser: CreateUser,
  ) {
    return this.authService.signUpLocal(createUser);
  }

  @Public()
  @Mutation(() => UserDto)
  signInLocal(@Args('signInLocal') signInLocal: SignInLocal) {
    return this.authService.signInLocal(signInLocal);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => TokensDto)
  refreshTokens(@CurrentUser() user: UserRefreshDTO) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}
