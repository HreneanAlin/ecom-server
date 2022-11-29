import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength } from 'class-validator';

@InputType()
export class SignInLocal {
  @MaxLength(30)
  @IsEmail()
  @Field()
  email: string;

  @MaxLength(60)
  @Field()
  password: string;
}
