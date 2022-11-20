import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignOutDto {
  @Field()
  success: boolean;
}
