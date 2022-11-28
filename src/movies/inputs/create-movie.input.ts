import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMovieInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Int, { description: 'price in USD' })
  price: number;

  @Field({ nullable: true })
  onSale?: boolean;
}
