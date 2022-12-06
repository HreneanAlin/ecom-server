import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CheckoutSession,
  CheckoutSessionSchema,
} from './entities/checkoutSession.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { CheckoutSessionService } from './checkout-session.service';
import { AuthModule } from 'src/auth/auth.module';
import {
  PaymentIntentRecord,
  PaymentIntentRecordSchema,
} from './entities/payment-intent-record.entity';
import { PaymentIntentRecordsService } from './payment-intent-records.service';
import { StripeService } from './stripe.service';

@Module({
  imports: [
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
    StripeService,
  ],
  exports: [CheckoutSessionService, PaymentIntentRecordsService],
})
export class PaymentsModule {}
