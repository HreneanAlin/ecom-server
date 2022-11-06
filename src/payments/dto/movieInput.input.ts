import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MovieInput {
  @Field()
  movieId: string;

  @Field(() => Int)
  quantity: number;
}
