import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { PaymentsResolver } from './payments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CheckoutSession,
  CheckoutSessionSchema,
} from './entities/checkout-session.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { CheckoutSessionService } from './services/checkout-session.service';
import { AuthModule } from 'src/auth/auth.module';
import {
  PaymentIntentRecord,
  PaymentIntentRecordSchema,
} from './entities/payment-intent-record.entity';
import { PaymentIntentRecordsService } from './services/payment-intent-records.service';
import { AppSubscriptionsModule } from 'src/app-subscriptions/app-subscriptions.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    StripeModule,
    AuthModule,
    MoviesModule,
    MongooseModule.forFeature([
      { name: CheckoutSession.name, schema: CheckoutSessionSchema },
      {
        name: PaymentIntentRecord.name,
        schema: PaymentIntentRecordSchema,
      },
    ]),
  ],
  providers: [
    PaymentsResolver,
    PaymentsService,
    CheckoutSessionService,
    PaymentIntentRecordsService,
  ],
  exports: [CheckoutSessionService, PaymentIntentRecordsService],
})
export class PaymentsModule {}
