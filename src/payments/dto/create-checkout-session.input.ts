import { Field, InputType } from '@nestjs/graphql';
import { MovieInput } from './movieInput.input';

@InputType()
export class CreateCheckoutSession {
  @Field(() => [MovieInput])
  products: MovieInput[];
}
