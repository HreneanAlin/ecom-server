import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Movie } from '../entities/movie.entity';
@ObjectType()
export class MovieWithQuantityDTO {
  @Field(() => Movie)
  movie: Movie;

  @Field(() => Int)
  quantity: number;
}
