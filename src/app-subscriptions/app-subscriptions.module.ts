import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppSubscription,
  AppSubscriptionSchema,
} from './entities/app-subscription.entity';
import { AppSubscriptionsService } from './app-subscriptions.service';
import { AppSubscriptionsResolver } from './app-subscriptions.resolver';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AppSubscription.name,
        schema: AppSubscriptionSchema,
      },
    ]),
    StripeModule,
  ],
  providers: [AppSubscriptionsService, AppSubscriptionsResolver],
  exports: [AppSubscriptionsService],
})
export class AppSubscriptionsModule {}
