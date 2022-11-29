import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUser {
  @MinLength(2)
  @Field()
  firstName: string;

  @MinLength(2)
  @Field()
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;
}
