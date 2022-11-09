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

@Module({
  imports: [
    MoviesModule,
    MongooseModule.forFeature([
      { name: CheckoutSession.name, schema: CheckoutSessionSchema },
    ]),
  ],
  providers: [PaymentsResolver, PaymentsService, CheckoutSessionService],
  exports: [CheckoutSessionService],
})
export class PaymentsModule {}
