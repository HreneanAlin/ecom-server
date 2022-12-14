import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';

import { CheckoutSessionService } from './services/checkout-session.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { CheckoutSession } from './entities/checkout-session.entity';
import { PaymentsService } from './services/payments.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/auth/entities/user.entity';
import { PaymentIntentDTO } from './dto/payment-intent.dto';
import { PaymentIntentRecord } from './entities/payment-intent-record.entity';
import { PaymentIntentRecordsService } from './services/payment-intent-records.service';
import { redisPubSub } from 'src/common/helpers/redis-pubsub';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly checkoutSessionService: CheckoutSessionService,
    private readonly paymentIntentRecordsService: PaymentIntentRecordsService,
  ) {}

  @Mutation(() => CheckoutSession)
  createCheckoutSession(
    @Args('createPayment') createPayment: CreatePaymentInput,
    @CurrentUser() user: UserDocument,
  ) {
    return this.paymentsService.createCheckoutSession(createPayment, user);
  }

  @Query(() => CheckoutSession, { name: 'checkoutSession' })
  findOne(@CurrentUser() user: UserDocument, @Args('id') id: string) {
    return this.checkoutSessionService.findCurrentUsersOneByStripeId(id, user);
  }

  @Mutation(() => PaymentIntentDTO)
  createPaymentIntent(
    @Args('createPayment') createPayment: CreatePaymentInput,
    @CurrentUser() user: UserDocument,
  ) {
    return this.paymentsService.createPaymentIntent(createPayment, user);
  }

  @Query(() => PaymentIntentRecord)
  paymentIntent(@Args('id') id: string, @CurrentUser() user: UserDocument) {
    return this.paymentIntentRecordsService.findByStripeId(id, user);
  }

  @Subscription(() => PaymentIntentRecord, {
    name: 'paymentDone',
    filter(
      payload: { paymentDone: PaymentIntentRecord },
      variables: { id: string },
      context: { req: { user: UserDocument } },
    ) {
      const user = context.req.user;
      return (
        String(payload.paymentDone.user) === String(user._id) &&
        payload.paymentDone.stripeId === variables.id
      );
    },
  })
  paymentDone(@Args('id') id: string) {
    console.info(`Listening for payment completion with stripe id: ${id}`);
    return redisPubSub.asyncIterator('paymentDone');
  }
}
