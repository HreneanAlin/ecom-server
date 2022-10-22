import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMovieInput {
  @Field()
  title: string;

  @Field(() => Int, { description: 'price in USD' })
  price: number;
}
