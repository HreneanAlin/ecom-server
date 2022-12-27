import { registerEnumType } from '@nestjs/graphql';

export enum SubscriptionPlan {
  Year = 'Year',
  HalfYear = 'HalfYear',
  Month = 'HalfMonth',
}

registerEnumType(SubscriptionPlan, {
  name: 'SubscriptionPlan',
});
