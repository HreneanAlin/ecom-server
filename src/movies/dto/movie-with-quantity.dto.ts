import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Movie } from '../entities/movie.entity';
import { Types } from 'mongoose';
@ObjectType()
export class MovieWithQuantityDTO {
  @Field(() => String)
  _id?: Types.ObjectId;

  @Field(() => Movie)
  movie: Movie;

  @Field(() => Int)
  quantity: number;
}
