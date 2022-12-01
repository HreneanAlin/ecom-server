import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Movie } from '../entities/movie.entity';
@ObjectType()
export class MovieWithQuantityDTO {
  @Field()
  _id?: string;

  @Field(() => Movie)
  movie: Movie;

  @Field(() => Int)
  quantity: number;
}
