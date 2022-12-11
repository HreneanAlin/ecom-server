import { Field, ObjectType } from '@nestjs/graphql';
import { MovieWithQuantityDTO } from 'src/movies/dto/movie-with-quantity.dto';
import { CheckoutSession } from 'src/payments/entities/checkoutSession.entity';
import { Types } from 'mongoose';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserDto {
  @Field(() => String)
  _id: Types.ObjectId;

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
}

export const mapUserToUserDto = (user: User): UserDto => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    movies: user.movies,
    payments: user.payments,
  };
};
