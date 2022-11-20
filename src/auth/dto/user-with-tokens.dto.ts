import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { TokensDto } from './tokens.dto';
import { UserDto } from './user.dto';

@ObjectType()
export class UserWithTokensDto extends UserDto {
  @Field(() => TokensDto)
  tokens: TokensDto;
}
export const mapUserToUserWithTokensDto = (
  user: User,
  token: string,
  refreshToken: string,
): UserWithTokensDto => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    movies: user.movies,
    payments: user.payments,
    tokens: {
      token,
      refreshToken,
    },
  };
};
