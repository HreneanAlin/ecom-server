import { Field, InputType } from '@nestjs/graphql';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

@InputType()
export class CreateAppSubscriptionInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field(() => SubscriptionPlan)
  plan: keyof typeof SubscriptionPlan;
}
