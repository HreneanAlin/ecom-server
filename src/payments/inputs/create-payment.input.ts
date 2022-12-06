import { Field, InputType } from '@nestjs/graphql';
import { MovieInput } from './movieInput.input';

@InputType()
export class CreatePaymentInput {
  @Field(() => [MovieInput])
  products: MovieInput[];
}
