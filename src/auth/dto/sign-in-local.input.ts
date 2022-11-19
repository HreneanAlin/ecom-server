import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInLocal {
  @Field()
  email: string;
  @Field()
  password: string;
}
