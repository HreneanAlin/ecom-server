import { Field, ObjectType } from '@nestjs/graphql';
import { MovieWithQuantityDTO } from 'src/movies/dto/movie-with-quantity.dto';
import { CheckoutSession } from 'src/payments/entities/checkoutSession.entity';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '../entities/user.entity';
import { TokensDto } from './tokens.dto';
@ObjectType()
export class UserDto {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [CheckoutSession])
  payments: CheckoutSession[];

  @Field(() => [MovieWithQuantityDTO])
  movies: MovieWithQuantityDTO[];

  @Field(() => TokensDto)
  tokens: TokensDto;
}

export const mapUserToUserDto = (
  user: User,
  token: string,
  refreshToken: string,
): UserDto => {
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
