import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentIntentDTO {
  @Field()
  clientSecret: string;
}
